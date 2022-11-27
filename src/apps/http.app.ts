import type Config from '@app/config';
import { HttpRoutes } from '@app/routes/http';
import { injectable, inject } from 'inversify';
import BootStrap from '@app/bootstrap/bootstrap';
import ExampleResource from '@app/bootstrap/resources/example-resource';
import express, {
  Express,
  NextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse,
  Router,
} from 'express';
import KafkaResource from '@app/bootstrap/resources/kafka-resource';
import { ILogger } from '@app/core/logger';
import beans from '@app/core/beans';
import { ProcessEnv } from '@app/core/process.env';
import { ErrorHandler } from '@app/errors/error-handler';
import { ErrorMessageGenerator } from '@app/controllers/helpers';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import TemporalResource from '@app/bootstrap/resources/temporal-resource';
import CassandraResource from '@app/bootstrap/resources/cassandra-resource';

@injectable()
export default class HttpServer {
  app: Express;

  constructor(
    @inject(beans.ENV) private processEnv: ProcessEnv,
    @inject(beans.CONFIG) private config: Config,
    @inject(beans.BOOTSTRAP) private bootstrap: BootStrap,
    @inject(beans.HTTP_ROUTES) private httpRoutes: HttpRoutes,
    @inject(beans.LOGGER) private logger: ILogger,
    @inject(beans.ERROR_HANDLER) private errorHandler: ErrorHandler,

    // Resources
    @inject(beans.TEMPORAL) private temporalResource: TemporalResource,
    @inject(beans.CASSANDRA) private cassandraResource: CassandraResource,
    @inject(beans.KAFKA) private kafkaResource: KafkaResource,
  ) {
    this.app = express();
  }

  async boot() {
    await this.bootstrap
      .withResource(this.temporalResource)
      .withResource(this.cassandraResource)
      .withResource(this.kafkaResource)
      .load();

    this.app.use(bodyParser.json({ limit: '10mb' }));
    this.app.use(cookieParser());
  }

  attach(path: string, router: Router) {
    this.app.use(path, router);
  }

  start(): Promise<void> {
    // common middleware: error handler for uncaught exceptions
    const errorHandler = this.errorHandler;
    this.app.use(function (
      err: Error,
      req: ExpressRequest,
      res: ExpressResponse,
      next: NextFunction,
    ) {
      if (err) {
        errorHandler.handleHttpError(err, req, res);
        res.status(500).send(ErrorMessageGenerator.httpErrorMessage(err));
        next(err);
      } else {
        next();
      }
    });

    return new Promise(async (res) => {
      await this.boot();
      this.app.use('/', this.httpRoutes.init());
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
