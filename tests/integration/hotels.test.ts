import supertest from 'supertest';
import app, { init } from '@/app';
import { cleanDb, generateValidToken } from '../helpers';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import {
  createEnrollmentWithAddress,
  createGuestlessTicketType,
  createRemoteTicketType,
  createTicket,
  createTicketType,
  createUser,
  createValidTicketType,
} from '../factories';
import jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { createHotelWithRooms } from '../factories/hotels-factory';

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

function hotelTestRoutes(route: string) {
  describe('when token is invalid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.post(route);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();

      const response = await server.post(route).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.get(route).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });
  describe('when token is valid', () => {
    it('should respond with status 404 when there is no enrollment for given user', async () => {
      const token = await generateValidToken();

      const response = await server.get(route).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when there is no ticket for given user', async () => {
      const user = await createUser();
      await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);

      const response = await server.get(route).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 when ticket was not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get(route).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when typeticket is not remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createRemoteTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get(route).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when typeticket has no hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createGuestlessTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get(route).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    if (route === '/hotels') {
      it('should respond with status 404 when there are no hotels available', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createValidTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get(route).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it('should respond with status 200 and hotel list', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createValidTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createHotelWithRooms();

        const response = await server.get(route).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              image: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ]),
        );
      });
    } else {
      it('should respond with status 404 when hotel doesnt exist', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createValidTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createHotelWithRooms();

        const response = await server.get('/hotels/999').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });
      it('should respond with status 200 and hotel with rooms', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createValidTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotelWithRooms();
        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          id: hotel.id,
          image: hotel.image,
          name: hotel.name,
          updatedAt: expect.any(String),
          createdAt: expect.any(String),
          Rooms: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              capacity: expect.any(Number),
              name: expect.any(String),
              hotelId: expect.any(Number),
              updatedAt: expect.any(String),
              createdAt: expect.any(String),
            }),
          ]),
        });
      });
    }
  });
}

describe('/GET /hotels', () => {
  hotelTestRoutes('/hotels');
});

describe('/GET /hotels/:id', () => {
  hotelTestRoutes('/hotels/1');
});
