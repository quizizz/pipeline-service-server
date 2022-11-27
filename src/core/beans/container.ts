import { Main } from '@app/apps';
import ServiceLocator from '@app/core/service-locator';
import { Container, interfaces } from 'inversify';
import { logger, ILogger } from '@app/core/logger';
import BeanTypes from '.';
import BootStrap from '@app/bootstrap/bootstrap';
import HttpServer from '@app/apps/http.app';
import { AppFactory } from '@app/apps/factory.app';
import { ControllerFactory } from '@app/controllers/factory.controller';
import { HttpRoutes } from '@app/routes/http';
import { ErrorHandler, ErrorHandlerSentry } from '@app/errors/error-handler';
import Config from '@app/config';
import KafkaResource from '@app/bootstrap/resources/kafka-resource';
import ExampleResource from '@app/bootstrap/resources/example-resource';
import { ProcessEnv } from '@app/core/process.env';
import Emitter from '@app/core/emitter';
import { MetaController } from '@app/controllers';
import { NotFoundController } from '@app/controllers/404.controller';
import { HealthController } from '@app/controllers/meta.controller';
import ContextStorageService from '@app/services/context-storage.service';
import CassandraResource from '@app/bootstrap/resources/cassandra-resource';
import TemporalResource from '@app/bootstrap/resources/temporal-resource';

/**
 * Inits DI container
 */
function createDependencyContainer() {
  const container = new Container();

  /** -------------------------------- Core  -------------------------------- */
  container.bind<ProcessEnv>(BeanTypes.ENV).to(ProcessEnv).inSingletonScope();
  container.bind<Config>(BeanTypes.CONFIG).to(Config).inSingletonScope();
  container.bind<ILogger>(BeanTypes.LOGGER).toConstantValue(logger);
  container
    .bind<ServiceLocator>(BeanTypes.SERVICE_LOCATOR)
    .to(ServiceLocator)
    .inSingletonScope();
  container
    .bind<BootStrap>(BeanTypes.BOOTSTRAP)
    .to(BootStrap)
    .inSingletonScope();
  container
    .bind<ErrorHandler>(BeanTypes.ERROR_HANDLER)
    .to(ErrorHandlerSentry)
    .inSingletonScope();
  container.bind<Emitter>(BeanTypes.EMITTER).to(Emitter).inSingletonScope();

  /** -------------------------------- App -------------------------------- */

  container
    .bind<AppFactory>(BeanTypes.APP_FACTORY)
    .to(AppFactory)
    .inSingletonScope();
  container.bind<HttpServer>(BeanTypes.HTTP_SERVER).to(HttpServer);
  container
    .bind<interfaces.Factory<HttpServer>>(BeanTypes.HTTP_FACTORY)
    .toAutoFactory<HttpServer>(BeanTypes.HTTP_SERVER);
  /** -------------------------------- Routes -------------------------------- */
  container
    .bind<HttpRoutes>(BeanTypes.HTTP_ROUTES)
    .to(HttpRoutes)
    .inSingletonScope();

  /** -------------------------------- Resources  -------------------------------- */

  container
    .bind<KafkaResource>(BeanTypes.KAFKA)
    .to(KafkaResource)
    .inSingletonScope();
  container
    .bind<CassandraResource>(BeanTypes.CASSANDRA)
    .to(CassandraResource)
    .inSingletonScope();
  container
    .bind<TemporalResource>(BeanTypes.TEMPORAL)
    .to(TemporalResource)
    .inSingletonScope();
  container
    .bind<ExampleResource>(BeanTypes.EXAMPLE)
    .to(ExampleResource)
    .inSingletonScope();

  /** -------------------------------- Controllers -------------------------------- */

  container
    .bind<ControllerFactory>(BeanTypes.CONTROLLER_FACTORY)
    .to(ControllerFactory)
    .inSingletonScope();

  container
    .bind<MetaController>(BeanTypes.META_CONTROLLER)
    .to(MetaController)
    .inSingletonScope();

  container
    .bind<HealthController>(BeanTypes.HEALTH_CONTROLLER)
    .to(HealthController)
    .inSingletonScope();

  container
    .bind<NotFoundController>(BeanTypes.NOT_FOUND_CONTROLLER)
    .to(NotFoundController)
    .inSingletonScope();

  /** -------------------------------- Services -------------------------------- */
  container
    .bind<ContextStorageService>(BeanTypes.CONTEXT_STORAGE_SERVICE)
    .to(ContextStorageService)
    .inSingletonScope();

  /** -------------------------------- Main app -------------------------------- */
  container.bind<Main>(BeanTypes.MAIN).to(Main).inSingletonScope();

  return () => {
    return container;
  };
}

export default createDependencyContainer();
