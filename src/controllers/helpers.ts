import BaseError from '@app/errors/base-error';

interface ErrorMessage {
  success: boolean;
  error: string;
  time: Date;
  data?: any;
  errorType?: string;
}

/**
 * Helper utility to generate ErrorMessage for different transports
 */
export class ErrorMessageGenerator {
  static httpErrorMessage(err: BaseError | Error): ErrorMessage {
    return {
      success: false,
      error: err.message,
      errorType: err instanceof BaseError ? err.desc : 'server.UKW',
      time: new Date(),
      data: (err as BaseError)?.data,
    };
  }
}
