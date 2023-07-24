import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import httpStatus from 'http-status';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { createBooking, createEnrollmentWithAddress, createTicket, createTicketType, createUser, createValidTicketType } from '../factories';
import { createHotelWithRooms } from '../factories/hotels-factory';
import { TicketStatus } from '@prisma/client';

beforeAll(async () => {
  await init();
  await cleanDb();
});
init;

beforeEach(async () => {
  await cleanDb();
  jest.clearAllMocks();
});

const server = supertest(app);

describe('GET /bookings', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should return 404 when user has no bookings', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return booking id and roomInfo', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotelRooms = await createHotelWithRooms();
      const booking = await createBooking(user.id, hotelRooms.Rooms[0].id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          ...hotelRooms.Rooms[0],
          createdAt: hotelRooms.Rooms[0].createdAt.toISOString(),
          updatedAt: hotelRooms.Rooms[0].updatedAt.toISOString(),
        },
      });
    });
  });
});

describe('POST /bookings/:roomId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should return bookingId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotelRooms = await createHotelWithRooms();
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId: hotelRooms.Rooms[0].id});
      expect(response.body).toEqual({bookingId: expect.any(Number)});

      expect(response.status).toBe(httpStatus.OK);


    });
  });
});

describe('PUT /bookings/:roomId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  // describe('when token is valid', () => {
  //   it('should return bookingId', async () => {
  //     const userWithoutSession = await createUser();
  //     const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  //     const hotelRooms = await createHotelWithRooms();

  //     const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send({roomId: hotelRooms.Rooms[0].id});
  //     expect(response.body).toBe('');

  //     expect(response.status).toBe(httpStatus.OK);
  //   });
  // });
});
