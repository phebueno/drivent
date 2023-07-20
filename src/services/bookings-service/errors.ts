import { ApplicationError } from '@/protocols';

export function roomRentalError(message?: string): ApplicationError {
  const errorMsg = message || "Permission denied."
  return {
    name: 'RoomRentalError',
    message: errorMsg,
  };
}
