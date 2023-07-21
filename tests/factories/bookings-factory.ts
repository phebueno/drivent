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
  const bookingInfo = generateBooking(userId);
  return {
    ...bookingInfo,
    Room: { ...generateRoom(), id: bookingInfo.id, hotelId: 1, createdAt: new Date(), updatedAt: new Date() },
  };
}

export function generateRoomWithBookings(userId: number, options?: RoomOptions) {
  const fullRoom = { ...generateRoom(), id: 1, hotelId: 1, createdAt: new Date(), updatedAt: new Date() };
  let MAX_CAPACITY = options ? setRoomOptions(options, fullRoom.capacity) : fullRoom.capacity - 1;
  if (options) setRoomOptions(options, fullRoom.capacity);
  const Booking = [];
  for (let i = 0; i < MAX_CAPACITY; i++) {
    Booking.push({ id: 1, userId: i + 1, roomId: fullRoom.id, createdAt: new Date(), updatedAt: new Date() });
  }
  return {
    ...fullRoom,
    Booking,
  };
}

function setRoomOptions(options: RoomOptions, capacity: number) {
  if (options.fullRoom) return capacity;
  else return capacity - 1;
}

type RoomOptions = {
  fullRoom: boolean;
};
