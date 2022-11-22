import { inject, injectable } from 'inversify';

import beans from '@app/core/beans';
import { Request, Locals } from '@app/domains/app';
import BaseMiddleware from '@app/middlewares/base.middleware';
import ContextStorageService from '@app/services/context-storage.service';

const DEBUG_COOKIE_NAME = 'x-q-debug';
const DEBUG_HEADER_NAME = 'x-q-debug';

@injectable()
export class RequestDebugMiddleware implements BaseMiddleware {
  constructor(
    @inject(beans.CONTEXT_STORAGE_SERVICE)
    private contextStorage: ContextStorageService,
  ) {}

  private shouldEnableDebugViaCookie(
    req: Request<unknown, unknown, unknown>,
  ): boolean {
    if (req.cookies) {
      if (req.cookies[DEBUG_COOKIE_NAME] === 'true') {
        return true;
      }
    }

    return false;
  }

  private shouldEnableDebugViaHeaders(
    req: Request<unknown, unknown, unknown>,
  ): boolean {
    if (req.headers) {
      if (req.headers[DEBUG_HEADER_NAME] === 'true') {
        return true;
      }
    }

    return false;
  }

  async exec(
    req?: Request<unknown, unknown, unknown>,
  ): Promise<void | Partial<Locals>> {
    const store = this.contextStorage?.getStore();

    if (!store) {
      return;
    }
    // already enabled
    if (store.debug === true) {
      return;
    }

    if (
      this.shouldEnableDebugViaCookie(req) ||
      this.shouldEnableDebugViaHeaders(req)
    ) {
      store.debug = true;
    }
  }
}
