import { init } from '@/app';
import { cleanDb } from '../helpers';
import bookingsRepository from '@/repositories/booking-repository';
import bookingsService from '@/services/bookings-service';
import { generateBookingWithRoomInfo } from '../factories';

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
