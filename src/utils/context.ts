import { NextFunction, Response } from 'express';
import is from 'is_js';

export interface ContextReq {
  method: string;
  originalUrl: string;
  'User-Agent': string;
  Referer: string;
}

export class MockReq implements ContextReq {
  method: string;
  originalUrl: string;
  'User-Agent': string;
  Referer: string;

  constructor(
    args: {
      method?: 'PUT' | 'POST' | 'GET' | 'DELETE';
      route?: string;
      userAgent?: string;
      referer?: string;
    } = {},
  ) {
    this.method = args.method;
    this.originalUrl = args.route;
    this['User-Agent'] = args.userAgent;
    this.Referer = args.referer;
  }

  get(key: keyof MockReq): any {
    return this[key];
  }
}

export class Context {
  req: ContextReq;
  res: Response;
  next: NextFunction;

  throwConcurrently: boolean;
  meta: { response?: Record<string, any> };

  constructor(args: {
    req?: ContextReq;
    res?: Response;
    next?: NextFunction;
    throwConcurrently?: boolean;
    meta?: { response?: any };
  }) {
    this.req = args.req;
    this.res = args.res;
    this.next = args.next;
    this.throwConcurrently = args.throwConcurrently;
    this.meta = args.meta ?? {};
  }

  shouldThrowConcurrently(): boolean {
    return is.boolean(this.throwConcurrently) ? this.throwConcurrently : false;
  }

  static getDefault = (
    args: {
      route?: string;
      method?: 'GET' | 'PUT' | 'POST' | 'DELETE';
      userAgent?: string;
      referer?: string;
    } = {},
  ): Context => {
    const { route, method, userAgent, referer } = args;
    const req = new MockReq({ route, method, userAgent, referer });
    return new Context({ req });
  };
}
