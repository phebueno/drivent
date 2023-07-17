import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotelWithRooms() {
  return prisma.hotel.create({
    data: {
      name: `${faker.company.companyName()} Hotel`,
      image: faker.internet.avatar(),
      Rooms: {
        createMany: {
          data: [
            { name: faker.word.adjective(), capacity: faker.datatype.number({ min: 1, max: 10 }) },
            { name: faker.word.adjective(), capacity: faker.datatype.number({ min: 1, max: 10 }) },
          ],
        },
      },
    },
  });
}
