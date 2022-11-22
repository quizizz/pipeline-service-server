import { Locals, Request } from '@app/domains/app';

/** Base middleware, app agnostic */
export default interface BaseMiddleware {
  exec(
    req?: Request<unknown, unknown, unknown>,
  ): Promise<void | Partial<Locals>>;
}
