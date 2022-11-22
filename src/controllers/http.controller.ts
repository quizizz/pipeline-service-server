import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import BaseController from '@app/controllers/base.controller';
import { ErrorHandler } from '@app/errors/error-handler';
import ValidationError from '@app/errors/validation-error';
import type ServiceLocator from '@app/core/service-locator';
import { Locals, Request } from '@app/domains/app';
import { ErrorMessageGenerator } from '@app/controllers/helpers';
import BaseError from '@app/errors/base-error';
import { logging, url } from '@app/utils';
import { HttpCommunication } from '@quizizz/service-communication';
import ContextStorageService from '@app/services/context-storage.service';
import { performance } from 'perf_hooks';
import { logger } from '@app/core/logger';

export default class HttpController {
  constructor(
    private controller: BaseController,
    private container: ServiceLocator,
    private errorHandler: ErrorHandler,
    private contextStorage: ContextStorageService,
  ) {}

  parseRequest(req: ExpressRequest) {
    return {
      method: req.method,
      route: req.originalUrl,
      ip: req.ip,
      ips: req.ips,
      time: Date.now(),
      protocol: req.protocol,
      referer: req.get('Referer'),
      userAgent: req.get('User-Agent'),
    };
  }

  parseResponse(res: ExpressResponse) {
    const store = this.contextStorage.getStore();
    return {
      size: Number(res.get('Content-Length')) || 0,
      statusCode: res.statusCode,
      timeTaken: Number((performance.now() - store.reqStartTime).toFixed(2)),
    };
  }

  parseError(err: BaseError) {
    return logging.parseError(err);
  }

  logRequest(req: ExpressRequest) {
    logger.infoj({
      type: 'http-request',
      data: {
        req: this.parseRequest(req),
      },
    });
  }

  logResponse(
    err: BaseError | null,
    req: ExpressRequest,
    res: ExpressResponse,
  ) {
    const toPrint = {
      type: 'http-response',
      data: {
        req: this.parseRequest(req),
        res: this.parseResponse(res),
        err: err ? this.parseError(err) : undefined,
      },
    };

    if (err) {
      logger.errorj(toPrint);
    } else {
      logger.infoj(toPrint);
    }
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const reqContext = HttpCommunication.getRequestContext(req);
    const asyncStore = {
      ...reqContext,
      action: this.controller.name,
    };

    await this.contextStorage.getInstance().run(asyncStore, async () => {
      try {
        this.logRequest(req);

        const { locals = {} } = res as { locals: Locals };
        const { body, query, params, headers: reqHeaders, cookies } = req;
        const request: Request<any, any, any> = {
          body,
          query,
          params,
          context: Object.assign(locals, {
            container: this.container,
          }),
          headers: reqHeaders,
          cookies,
        };

        // First sanitize the request
        if (this.controller.sanitize) {
          this.controller.sanitize(request);
        }

        // Second validate the request
        if (this.controller.validate) {
          const validation = this.controller?.validate(request);
          // If there is a validation error, aggregate and throw it
          if (validation) {
            if (validation.error) {
              throw new ValidationError(
                'Validation failed',
                validation.error.details.map((d) => d.message),
              );
            }
          }
        }
        // Execute the request
        const { data = {}, headers = [] } =
          (await this.controller.exec(request)) || {};

        // Prepare the response
        headers.map((header) => {
          const key = Object.keys(header)[0];
          const value = header[key];
          res.set(key, value);
        });
        res.status(200).send({ success: true, data, time: new Date() });
        this.logResponse(null, req, res);
      } catch (err) {
        this.logResponse(err, req, res);
        this.errorHandler.handleHttpError(err, req, res);
        res
          .status(err.code || 500)
          .send(ErrorMessageGenerator.httpErrorMessage(err));
      }
    });
  }
}
