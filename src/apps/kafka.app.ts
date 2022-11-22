import App from '@app/apps/app';
import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import beans from '@app/core/beans';
import { ProcessEnv } from '@app/core/process.env';
import Config from '@app/config';
import BootStrap from '@app/bootstrap/bootstrap';
import KafkaResource from '@app/bootstrap/resources/kafka-resource';
import { KafkaRoutes } from '@app/routes/kafka';
import { ILogger } from '@app/core/logger';

@injectable()
export default class KafkaWorker implements App {
  app: Express;

  constructor(
    @inject(beans.ENV) private processEnv: ProcessEnv,
    @inject(beans.CONFIG) private config: Config,
    @inject(beans.BOOTSTRAP) private bootstrap: BootStrap,
    @inject(beans.KAFKA) private kafkaResource: KafkaResource,
    @inject(beans.KAFKA_ROUTES) private kafkaRoutes: KafkaRoutes,
    @inject(beans.LOGGER) private logger: ILogger,
  ) {
    this.app = express();
  }

  async boot() {
    await this.bootstrap.withResource(this.kafkaResource).load();
  }

  start(): Promise<void> {
    return new Promise(async (res) => {
      await this.boot();

      await this.kafkaRoutes.registerAllTopics();

      const httpRouter = this.kafkaRoutes.initHTTPRoutes();
      const experiment = this.config.apiver;
      const componenType = this.config.componentType;
      this.app.use(httpRouter);
      this.app.use(`/_${componenType}/${experiment}`, httpRouter);

      this.app.listen(this.config?.server.port, () => {
        this.logger.info(
          `Started server on port: %s pid: %d`,
          this.config?.server.port,
          process.pid,
        );
        res();
      });
    });
  }
}
