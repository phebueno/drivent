import { notFoundError } from '../../errors';
import enrollmentRepository from '../../repositories/enrollment-repository';
import hotelsRepository from '../../repositories/hotels-repository';
import ticketsRepository from '../../repositories/tickets-repository';
import { paymentRequiredError, serviceNotIncludedError } from './errors';

async function getHotels(userId: number) {
  await hotelErrorHandling(userId);
  const hotels = await hotelsRepository.getHotelsDB();
  if (hotels.length===0) throw notFoundError();
  return hotels;
}

async function getHotelById(hotelId: number, userId: number) {
  await hotelErrorHandling(userId);
  const hotelRooms = await hotelsRepository.getHotelByIdDB(hotelId);
  if (!hotelRooms) throw notFoundError();
  return hotelRooms;
}

async function hotelErrorHandling(userId: number){
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status !== 'PAID') throw paymentRequiredError();
  if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote) throw serviceNotIncludedError();  
}

const hotelsService = { getHotels, getHotelById };

export default hotelsService;
