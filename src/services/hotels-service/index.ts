import { notFoundError } from '../../errors';
import enrollmentRepository from '../../repositories/enrollment-repository';
import hotelsRepository from '../../repositories/hotels-repository';
import ticketsRepository from '../../repositories/tickets-repository';
import { paymentRequiredError, serviceNotIncludedError } from './errors';

async function getHotels(userId: number) {
  //404 se inscrição não existir
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  //404 se ticket não existir
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  //402 se ticket não foi pago
  if (ticket.status !== 'PAID') throw paymentRequiredError();
  //402 se tipoticket for remoto
  //402 se tipoticket não inclui hotel
  if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote) throw serviceNotIncludedError();  
  //404 se não existir hotéis
  const hotels = await hotelsRepository.getHotelsDB();
  if (!hotels) throw notFoundError();
  return hotels;
}

async function getHotelById(hotelId: number) {
  return hotelsRepository.getHotelByIdDB(hotelId);
}

const hotelsService = { getHotels, getHotelById };

export default hotelsService;
