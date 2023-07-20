import { prisma } from '../../config';

async function getBookingDB() {
  return 'seu booking';
}

async function createBookingDB(userId: number, roomId: number) {
  return prisma.booking.create({ data: { userId, roomId } });
}

async function updateBookingDB() {
  return 'seu booking update';
}

async function getRoomById(roomId: number) {
  return prisma.room.findFirst({ where: { id: roomId }, include: { Booking: true } });
}

const bookingsRepository = { getBookingDB, createBookingDB, updateBookingDB, getRoomById };

export default bookingsRepository;
