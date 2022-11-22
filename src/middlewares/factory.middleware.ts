import ServiceLocator from '@app/core/service-locator';
import { HttpMiddleware } from '@app/middlewares/http.middleware';
import BaseMiddleware from '@app/middlewares/base.middleware';
import { injectable, inject } from 'inversify';
import beans from '@app/core/beans';

/**
 * Middleware factory. Can create attachable middleware functions from BaseMiddleware class for
 * different transports.
 */
@injectable()
export default class MiddlewareFactory {
  /** constructor */
  constructor() {}

  /**
   * @param Middleware BaseMiddleware class
   * @returns Attachable Express middlware
   */
  createHttpMiddleware(Middleware: new () => BaseMiddleware) {
    const httpMiddleware = new HttpMiddleware(new Middleware());
    return httpMiddleware.exec.bind(httpMiddleware);
  }
}
