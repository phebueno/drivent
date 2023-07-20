import { generateRoom } from './hotels-factory';

export function generateBooking(userId: number) {
  return {
    id: 1,
    roomId: 1,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function generateBookingWithRoomInfo(userId: number) {
  const booking = generateBooking(userId);
  return {
    ...booking,
    Room: { ...generateRoom(), id: booking.id, hotelId: 1, createdAt: new Date(), updatedAt: new Date() },
  };
}
