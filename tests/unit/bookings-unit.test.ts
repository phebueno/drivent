import { init } from '@/app';
import { cleanDb } from '../helpers';
import bookingsRepository from '@/repositories/booking-repository';
import bookingsService from '@/services/bookings-service';
import {
  generateBooking,
  generateBookingWithRoomInfo,
  generateRoomWithBookings,
  generateTicketWithTicketType,
} from '../factories';
import ticketsRepository from '@/repositories/tickets-repository';
import { TicketStatus } from '@prisma/client';

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
  jest.clearAllMocks();
});

describe('GET /booking', () => {
  it('should return error when booking is not found', async () => {
    jest.spyOn(bookingsRepository, 'getBookingDB').mockImplementationOnce((): any => {});
    const result = bookingsService.getBooking(999);
    expect(result).rejects.toEqual({ message: 'Booking not found!', name: 'NotFoundError' });
  });

  it('should return booking information', async () => {
    const userId = 1;
    jest.spyOn(bookingsRepository, 'getBookingDB').mockResolvedValueOnce({
      ...generateBookingWithRoomInfo(userId),
    });
    const result = await bookingsService.getBooking(userId);
    expect(result).toEqual({
      id: expect.any(Number),
      Room: {
        id: expect.any(Number),
        name: expect.any(String),
        capacity: expect.any(Number),
        hotelId: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});

describe('POST /booking', () => {
  it('should return error room does not exist', async () => {
    jest.spyOn(bookingsRepository, 'getRoomByIdDB').mockResolvedValueOnce(undefined);
    const result = bookingsService.createBooking(1, 999);
    expect(result).rejects.toEqual({ message: 'Room not found!', name: 'NotFoundError' });
  });

  it('should return permission denied when room is full', async () => {
    const userId = 1;
    const fullRoom = generateRoomWithBookings(userId, { fullRoom: true });
    jest.spyOn(bookingsRepository, 'getRoomByIdDB').mockResolvedValueOnce(fullRoom);
    const result = bookingsService.createBooking(userId, fullRoom.id);
    expect(result).rejects.toEqual({
      name: 'RoomRentalError',
      message: 'No vacancies available for this room!',
    });
  });

  describe('should return permission denied if ticket is not compatible', () => {
    it('should return permission denied when ticket was not paid', async () => {
      const userId = 1;
      const room = generateRoomWithBookings(userId);
      jest.spyOn(bookingsRepository, 'getRoomByIdDB').mockResolvedValueOnce(room);
      jest
        .spyOn(ticketsRepository, 'findTicketByUserId')
        .mockResolvedValueOnce(generateTicketWithTicketType(TicketStatus.RESERVED));
      const result = bookingsService.createBooking(userId, room.id);
      expect(result).rejects.toEqual({
        name: 'RoomRentalError',
        message: 'Permission denied.',
      });
    });

    it('should return permission denied when typeticket is not remote', async () => {
      const userId = 1;
      const room = generateRoomWithBookings(userId);
      jest.spyOn(bookingsRepository, 'getRoomByIdDB').mockResolvedValueOnce(room);
      jest
        .spyOn(ticketsRepository, 'findTicketByUserId')
        .mockResolvedValueOnce(generateTicketWithTicketType(TicketStatus.PAID, { isRemote: true }));
      const result = bookingsService.createBooking(userId, room.id);
      expect(result).rejects.toEqual({
        name: 'RoomRentalError',
        message: 'Permission denied.',
      });
    });

    it('should return permission denied when typeticket has no hotel', async () => {
      const userId = 1;
      const room = generateRoomWithBookings(userId);
      jest.spyOn(bookingsRepository, 'getRoomByIdDB').mockResolvedValueOnce(room);
      jest
        .spyOn(ticketsRepository, 'findTicketByUserId')
        .mockResolvedValueOnce(generateTicketWithTicketType(TicketStatus.PAID, { includesHotel: false }));
      const result = bookingsService.createBooking(userId, room.id);
      expect(result).rejects.toEqual({
        name: 'RoomRentalError',
        message: 'Permission denied.',
      });
    });
  });
  it('should create a booking', async () => {
    const userId = 1;
    const room = generateRoomWithBookings(userId);
    jest.spyOn(bookingsRepository, 'getRoomByIdDB').mockResolvedValueOnce(room);
    jest
      .spyOn(ticketsRepository, 'findTicketByUserId')
      .mockResolvedValueOnce(generateTicketWithTicketType(TicketStatus.PAID));
    jest.spyOn(bookingsRepository, 'createBookingDB').mockResolvedValueOnce(generateBooking(userId));

    const result = await bookingsService.createBooking(userId, room.id);
    expect(result).toEqual({
      id: expect.any(Number),
      roomId: room.id,
      userId,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
