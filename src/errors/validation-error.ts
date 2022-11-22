import BaseError from '@app/errors/base-error';

/** Validation error 400 */
export default class ValidationError extends BaseError {
  override code = 400;
  override data: any = null;
  constructor(msg?: string, details?: any, data?: any) {
    super(msg ?? 'Validation error', 400, 'validation.Error', details, data);
  }
}
