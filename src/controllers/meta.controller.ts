import { Context } from '@app/domains/app';
import BaseController from '@app/controllers/base.controller';
import { injectable } from 'inversify';
import { logger } from '@app/core/logger';
import NotFoundError from '@app/errors/not-found-error';

@injectable()
export class MetaController implements BaseController {
  name: 'MetaController';
  async exec({
    context: {
      container: { config },
    },
  }: {
    context: Context;
  }) {
    logger.info('fetching data %d!', 100);
    return {
      data: {
        service: config.service,
        instanceId: config.instance,
      },
    };
  }
}

@injectable()
export class HealthController implements BaseController {
  name: 'HealthController';

  async exec({}) {
    return {
      data: 'ok',
    };
  }
}
