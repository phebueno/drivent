import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotelWithRooms() {
  return prisma.hotel.create({
    include: {Rooms: true},
    data: {
      name: `${faker.company.companyName()} Hotel`,
      image: faker.internet.avatar(),
      Rooms: {
        createMany: {
          data: [
            generateRoom(),
            generateRoom(),
          ],
        },
      },
    },
  });
}

export function generateRoom() {
  return {
    name: faker.word.adjective(),
    capacity: faker.datatype.number({ min: 1, max: 10 }),
  };
}
