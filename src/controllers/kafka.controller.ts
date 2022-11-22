import BaseController from '@app/controllers/base.controller';
import ValidationError from '@app/errors/validation-error';
import { ErrorHandler } from '@app/errors/error-handler';
import ContextStorageService from '@app/services/context-storage.service';
import { randomUUID } from 'crypto';
import safeJSON from 'safely-parse-json';
import { logging } from '@app/utils';
import BaseError from '@app/errors/base-error';
import { logger } from '@app/core/logger';
import { Request } from '@app/domains/app';

export default class KafkaController {
  constructor(
    private controller: BaseController,
    private errorHandler: ErrorHandler,
    private contextStorage: ContextStorageService,
  ) {}

  parseRequest(req: Request<unknown, unknown, unknown>) {
    return {
      method: 'KAFKA',
      topic: req.context.topic,
      time: Date.now(),
      protocol: 'KAFKA',
    };
  }

  parseResponse() {
    const store = this.contextStorage.getStore();
    return {
      statusCode: 200,
      timeTaken: Number((performance.now() - store.reqStartTime).toFixed(2)),
    };
  }

  parseError(err: BaseError) {
    return logging.parseError(err);
  }

  logRequest(request: Request<unknown, unknown, unknown>) {
    logger.infoj({
      type: 'kafka-request',
      data: {
        req: this.parseRequest(request),
      },
    });
    logger.debugj({
      type: 'kafka-request-payload',
      data: {
        req: this.parseRequest(request),
        payload: {
          body: request.body,
        },
      },
    });
  }

  logResponse(err: BaseError | null, req: Request<unknown, unknown, unknown>) {
    const toPrint = {
      type: 'kafka-response',
      data: {
        req: this.parseRequest(req),
        res: this.parseResponse(),
        err: err ? this.parseError(err) : undefined,
      },
    };

    if (err) {
      logger.errorj(toPrint);
    } else {
      logger.infoj(toPrint);
    }
  }

  parseValue(value: Buffer | string | unknown) {
    if (value instanceof Buffer) {
      return safeJSON(value.toString());
    }

    return safeJSON(value);
  }

  async exec(msg: { value: Buffer; topic: string }) {
    const { value, topic } = msg;
    const reqContext = {
      traceId: randomUUID(),
      userId: null,
      ab: null,
    };
    const asyncStore = {
      ...reqContext,
      reqStartTime: performance.now(),
      action: this.controller.name,
    };

    await this.contextStorage.getInstance().run(asyncStore, async () => {
      const req = {
        body: this.parseValue(value),
        context: {
          topic,
        },
      };
      try {
        this.logRequest(req);
        // First sanitize the request
        if (this.controller.sanitize) {
          this.controller.sanitize(req);
        }

        // Second validate the request
        if (this.controller.validate) {
          const validation = this.controller?.validate(req);
          // If there is a validation error, aggregate and throw it
          if (validation) {
            if (validation.error) {
              throw new ValidationError(
                validation.value ?? 'Validation failed',
                validation.error.details.map((d) => d.message),
              );
            }
          }
        }

        // Execute the request
        await this.controller.exec(req);
        this.logResponse(null, req);
      } catch (err) {
        this.logResponse(err, req);
        this.errorHandler.handleKafkaError(err, req, topic);
      }
    });
  }
}
