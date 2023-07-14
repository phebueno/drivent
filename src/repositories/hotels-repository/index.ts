import { prisma } from '../../config';

async function getHotelsDB() {
  return prisma.hotel.findMany();
}

async function getHotelByIdDB(id: number) {
  return prisma.hotel.findFirst({ include: { Rooms: true }, where: { id } });
}

const hotelsRepository = { getHotelsDB, getHotelByIdDB };

export default hotelsRepository;
