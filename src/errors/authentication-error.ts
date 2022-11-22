import BaseError from '@app/errors/base-error';

/** Error handler for 401 */
export default class AuthenticationError extends BaseError {
  override code = 401;
  override details: any = null;
  trace: any;
  constructor(msg?: string, details?: any, data?: any) {
    super(msg ?? 'Unauthorized request', 401, 'auth.ERROR', details, data);
  }
}
