import BaseError from '@app/errors/base-error';

/** Error handler for 404 */
export default class NotFoundError extends BaseError {
  constructor(msg?: string, details?: any, data?: any) {
    super(
      msg ?? 'Resource not found',
      404,
      'resource.NOT_FOUND',
      details,
      data,
    );
  }
}
