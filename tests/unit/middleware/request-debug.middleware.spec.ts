import 'reflect-metadata';

import BaseMiddleware from '@app/middlewares/base.middleware';
import { RequestDebugMiddleware } from '@app/middlewares/request-debug.middleware';
import ContextStorageService, {
  AsyncStore,
} from '@app/services/context-storage.service';

describe('[Middleware] Request Level Debug', () => {
  let contextStorageService: ContextStorageService;
  let middleware: BaseMiddleware;
  let asyncStore: AsyncStore = {
    ab: '',
    action: '',
    reqStartTime: 0,
    traceId: '',
    userId: '',
    debug: false,
  };

  beforeEach(() => {
    contextStorageService = new ContextStorageService();
    middleware = new RequestDebugMiddleware(contextStorageService);
    asyncStore = {
      ab: '',
      action: '',
      reqStartTime: 0,
      traceId: '',
      userId: '',
      debug: false,
    };
  });

  it('If the context store already has debug as true, it keeps that value', async () => {
    await contextStorageService.getInstance().run(asyncStore, async () => {
      const store = contextStorageService.getStore();
      store.debug = true;

      await middleware.exec();

      expect(store.debug).toBe(true);
    });
  });

  it('If the debug cookie is passed, it sets the debug value to true', async () => {
    await contextStorageService.getInstance().run(asyncStore, async () => {
      await middleware.exec({
        cookies: {
          'x-q-debug': 'true',
        },
      });

      const store = contextStorageService.getStore();
      expect(store.debug).toBe(true);
    });
  });

  it('If the debug header is passed, it sets the debug value to true', async () => {
    await contextStorageService.getInstance().run(asyncStore, async () => {
      await middleware.exec({
        headers: {
          'x-q-debug': 'true',
        },
      });

      const store = contextStorageService.getStore();
      expect(store.debug).toBe(true);
    });
  });
});
