import { Request, Response } from 'express';
import hotelsService from '../services/hotels-service';
import { AuthenticatedRequest } from '../middlewares';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const hotels = await hotelsService.getHotels(req.userId);
  res.send(hotels);
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const hotel = await hotelsService.getHotelById(Number(req.params.hotelId), req.userId);
  res.send(hotel);
}
