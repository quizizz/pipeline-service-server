import ServiceLocator from '@app/core/service-locator';
import BaseController from '@app/controllers/base.controller';
import HttpController from '@app/controllers/http.controller';
import KafkaController from '@app/controllers/kafka.controller';
import { injectable, inject } from 'inversify';
import beans from '@app/core/beans';
import { ErrorHandler } from '@app/errors/error-handler';
import ContextStorageService from '@app/services/context-storage.service';

@injectable()
export class ControllerFactory {
  constructor(
    @inject(beans.SERVICE_LOCATOR) private container: ServiceLocator,
    @inject(beans.ERROR_HANDLER) private errorHandler: ErrorHandler,
    @inject(beans.CONTEXT_STORAGE_SERVICE)
    private contextStorage: ContextStorageService,
  ) {}

  createHttpController(controller: BaseController) {
    const httpController = new HttpController(
      controller,
      this.container,
      this.errorHandler,
      this.contextStorage,
    );
    return httpController.exec.bind(httpController);
  }

  createKafkaController(controller: BaseController) {
    const kafkaController = new KafkaController(
      controller,
      this.errorHandler,
      this.contextStorage,
    );
    return kafkaController.exec.bind(kafkaController);
  }
}
