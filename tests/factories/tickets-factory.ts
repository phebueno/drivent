import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: faker.datatype.boolean(),
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createRemoteTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createValidTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
}

export async function createGuestlessTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: false,
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}

export function generateTicketWithTicketType(
  status: TicketStatus,
  { isRemote = false, includesHotel = true }: GenTicketOptions = {},
) {
  return {
    id: 1,
    ticketTypeId: 1,
    enrollmentId: 1,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
    TicketType: {
      id: 1,
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote,
      includesHotel,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}

type GenTicketOptions = { isRemote?: boolean; includesHotel?: boolean };

// id: 1,
//     ticketTypeId: 1,
//     enrollmentId: 1,
//     status: 'RESERVED',
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     TicketType: {
//       id: 1,
//       name: faker.name.findName(),
//       price: faker.datatype.number(),
//       isRemote: true,
//       includesHotel: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
