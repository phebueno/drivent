import { Router } from 'express';
import { authenticateToken } from '../middlewares';
import { createBooking, getBooking, updateBooking } from '@/controllers';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('', getBooking)
  .post('', createBooking)
  .put('/:hotelId', updateBooking);

export { bookingsRouter };
