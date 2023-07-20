import { ApplicationError } from '@/protocols';

export function notFoundError(message?: string): ApplicationError {
  const errorMsg = message || 'No result for this search!';
  return {
    name: 'NotFoundError',
    message: errorMsg,
  };
}
