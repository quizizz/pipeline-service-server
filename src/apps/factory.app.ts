import beans from '@app/core/beans';
import { ProcessEnv } from '@app/core/process.env';
import { injectable, inject, interfaces } from 'inversify';
import HttpServer from '@app/apps/http.app';
import KafkaWorker from './kafka.app';

export interface App {
  start(): Promise<void>;
}

export enum APP_TYPE {
  server = 'server',
  kafka = 'kafka',
}

/**
 * appFactory method generates app of given type
 */
@injectable()
export class AppFactory {
  constructor(
    @inject(beans.HTTP_FACTORY)
    private httpFactory: interfaces.Factory<HttpServer>,
    @inject(beans.KAFKA_FACTORY)
    private kafkaFactory: interfaces.Factory<KafkaWorker>,
    @inject(beans.ENV) private processEnv: ProcessEnv,
  ) {}

  getApp(): App {
    switch (this.processEnv.appType) {
      case APP_TYPE.server:
        return this.httpFactory() as HttpServer;
      case APP_TYPE.kafka:
        return this.kafkaFactory() as KafkaWorker;
      default:
        throw new Error('Invalid App Type');
    }
  }
}
