import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares';
import bookingsService from '../services/bookings-service';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const booking = await bookingsService.getBooking();
  res.send(booking);
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body;
  const booking = await bookingsService.createBooking(req.userId, Number(roomId));
  res.send({ bookingId: booking.id });
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const booking = await bookingsService.updateBooking();
  res.send(booking);
}
