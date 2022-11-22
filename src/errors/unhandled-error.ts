import BaseError from '@app/errors/base-error';

/** Unhandled error 500 */
export default class UnhandledError extends BaseError {
  constructor(ex?: Error, details?: any) {
    super(
      ex?.message ?? `Unhandled Exception :: ${ex?.toString()}`,
      500,
      'unknown.Error',
      details,
    );
  }
}
