import { ApplicationError } from '@/protocols';

export function paymentRequiredError(): ApplicationError {
  return {
    name: 'PaymentRequiredError',
    message: 'ticket must be paid before continuing',
  };
}

export function serviceNotIncludedError(): ApplicationError {
    return {
      name: 'ServiceNotIncludedError',
      message: 'service not included in your ticket type',
    };
  }
