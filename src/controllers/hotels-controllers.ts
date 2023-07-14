import { Request, Response } from 'express';
import hotelsService from '../services/hotels-service';

export async function getHotels(req: Request, res: Response) {
  const hotels = await hotelsService.getHotels();
  res.send(hotels);
}

export async function getHotelById(req: Request, res: Response) {
  const hotel = await hotelsService.getHotelById(Number(req.params.hotelId));
  res.send(hotel);
}
