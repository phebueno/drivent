import { Booking } from '@prisma/client';
import bookingsRepository from '../../repositories/booking-repository';
import { notFoundError } from '../../errors';
import { roomRentalError } from './errors';
import ticketsRepository from '../../repositories/tickets-repository';

async function getBooking(userId: number) {
  const bookingInfo = await bookingsRepository.getBookingDB(userId);
  if(!bookingInfo) throw notFoundError("Booking not found!");
  return { id: bookingInfo.id, Room: bookingInfo.Room };
}

async function createBooking(userId: number, roomId: number): Promise<Booking> {
  const room = await bookingsRepository.getRoomById(roomId);
  if (!room) throw notFoundError('No room found!');
  if (room.Booking.length >= room.capacity) throw roomRentalError('No vacancies available for this room!');
  const ticket = await ticketsRepository.findTicketByUserId(userId);
  if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote || ticket.status !== 'PAID')
    throw roomRentalError();
  return await bookingsRepository.createBookingDB(userId, roomId);
}

async function updateBooking() {
  return await bookingsRepository.updateBookingDB();
}

const bookingsService = { getBooking, createBooking, updateBooking };

export default bookingsService;
