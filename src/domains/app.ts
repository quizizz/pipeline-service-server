import ServiceLocator from '@app/core/service-locator';
import { SessionUser } from '@app/domains/user';

/** Additional values which may be set in Context (Context extends Locals) */
export interface Locals {
  user?: SessionUser;
}

/** Context passed in controller request */
export interface Context extends Locals {
  requestId?: string;
  container?: ServiceLocator;
  log?: boolean;
  topic?: string;
}

/** Request data to controllers */
export interface Request<Query, Body, Params> {
  body?: Body;
  params?: Params;
  query?: Query;
  context?: Context;
  headers?: Record<string, string | string[]>;
  cookies?: Record<string, string>;
}

/** Response from controllers */
export interface Response<Body> {
  data?: Body;
  headers?: { [key: string]: string }[];
}
