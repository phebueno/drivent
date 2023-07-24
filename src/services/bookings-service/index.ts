import { Booking } from '@prisma/client';
import bookingsRepository from '../../repositories/booking-repository';
import { notFoundError } from '../../errors';
import { roomRentalError } from './errors';
import ticketsRepository from '../../repositories/tickets-repository';

async function getBooking(userId: number) {
  const bookingInfo = await bookingsRepository.getBookingDB(userId);
  if (!bookingInfo) throw notFoundError('Booking not found!');
  return { id: bookingInfo.id, Room: bookingInfo.Room };
}

async function createBooking(userId: number, roomId: number): Promise<Booking> {
  const room = await bookingsRepository.getRoomByIdDB(roomId);
  if (!room) throw notFoundError('Room not found!');
  if (room.Booking.length >= room.capacity) throw roomRentalError('No vacancies available for this room!');
  const ticket = await ticketsRepository.findTicketByUserId(userId);
  if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote || ticket.status !== 'PAID')
    throw roomRentalError();
  return await bookingsRepository.createBookingDB(userId, roomId);
}

async function updateBooking(userId: number, roomId: number) {
  //validar usuário (tem que possuir um booking já)
  const userBooking = await bookingsRepository.userBookingDB(userId);
  if (!userBooking) throw roomRentalError('No booking to update!');
  //validar quarto (mesmas validações da criação do quarto):
  //se quarto existe
  const room = await bookingsRepository.getRoomByIdDB(roomId);
  if (!room) throw notFoundError('Room not found!');
  //se há vagas no quarto
  if (room.Booking.length >= room.capacity) throw roomRentalError('No vacancies available for this room!');
  // se incluihotel/remoto/pago já não faz mais sentido (já foi verificado na criação)
  return await bookingsRepository.updateBookingDB(userBooking.id, roomId);
}

const bookingsService = { getBooking, createBooking, updateBooking };

export default bookingsService;
