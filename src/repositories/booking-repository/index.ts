import { prisma } from '../../config';

async function getBookingDB(userId: number) {
  return prisma.booking.findFirst({ where: { User: { id: userId } }, include: { Room: true } });
}

async function createBookingDB(userId: number, roomId: number) {
  return prisma.booking.create({ data: { userId, roomId } });
}

async function updateBookingDB(id: number, roomId: number) {
  return prisma.booking.update({ where: { id }, data: { roomId } });
}

async function getRoomByIdDB(roomId: number) {
  return prisma.room.findFirst({ where: { id: roomId }, include: { Booking: true } });
}

async function userBookingDB(userId: number) {
  return prisma.booking.findFirst({ where: { userId } });
}

const bookingsRepository = { getBookingDB, createBookingDB, updateBookingDB, getRoomByIdDB, userBookingDB };

export default bookingsRepository;
