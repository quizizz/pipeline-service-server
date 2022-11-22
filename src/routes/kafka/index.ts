import KafkaResource from '@app/bootstrap/resources/kafka-resource';
import BaseController from '@app/controllers/base.controller';
import { ControllerFactory } from '@app/controllers/factory.controller';
import {
  ExampleKafkaController,
  HealthController,
} from '@app/controllers/meta.controller';
import beans from '@app/core/beans';
import { Router } from 'express';
import { injectable, inject } from 'inversify';

/** Kafka worker actions */
@injectable()
export class KafkaRoutes {
  /** Constructor */
  constructor(
    @inject(beans.CONTROLLER_FACTORY)
    private factory: ControllerFactory,
    @inject(beans.META_CONTROLLER) private metaController: BaseController,
    @inject(beans.HEALTH_CONTROLLER) private healthController: HealthController,
    @inject(beans.EXAMPLE_KAFKA_CONTROLLER)
    private exampleKafkaController: ExampleKafkaController,
    @inject(beans.KAFKA) private kafka: KafkaResource,
  ) {}

  async registerTopic(topic: string, controller: BaseController) {
    const execFn = this.factory.createKafkaController(controller);
    const consumer = await this.kafka.createConsumer(topic);
    consumer.listen(async (msg) => {
      await execFn(msg);
    });
  }

  async registerAllTopics() {
    const topicSubscribers = [
      {
        topicName: 'template.node',
        controller: this.exampleKafkaController,
      },
    ];

    const promises = [
      topicSubscribers.map((topicSubscriber) =>
        this.registerTopic(
          topicSubscriber.topicName,
          topicSubscriber.controller,
        ),
      ),
    ];
    await Promise.all(promises);
  }

  /** V1 */
  v1() {
    return;
  }

  meta() {
    const router = Router();
    router.get('/ab', this.factory.createHttpController(this.metaController));
    router.get(
      '/health',
      this.factory.createHttpController(this.healthController),
    );
    return router;
  }

  initHTTPRoutes(): Router {
    const base = Router();
    base.use('/_meta/', this.meta());
    return base;
  }
}
