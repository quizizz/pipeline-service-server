import KafkaResource from '@app/bootstrap/resources/kafka-resource';
import { RequestMethod } from '@app/types';
import BaseError from '@app/errors/base-error';
import { injectable, inject } from 'inversify';
import beans from '@app/core/beans';
import Config from '@app/config';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { Context, Request } from '@app/domains/app';
import Emitter, { EmittedError, EmitterEvents } from '@app/core/emitter';
import { ProcessEnv } from '@app/core/process.env';
import { ILogger } from '@app/core/logger';
import {
  CaptureAndParseStackReturnValue,
  DefaultFramesType,
  parseStackTrace,
} from '@quizizz/stacktrace-utils';
import ContextStorageService from '@app/services/context-storage.service';

/** Error handler interface. All type of handlers must implement this interface */
export interface ErrorHandler {
  handle(ex: BaseError | Error, opts: ErrorHandlerOpts): Promise<void>;
  handleHttpError(
    ex: BaseError | Error,
    req?: ExpressRequest,
    res?: ExpressResponse,
    ctx?: Context,
  ): Promise<void>;
  handleKafkaError(
    ex: BaseError | Error,
    req?: Request<any, any, any>,
    topic?: string,
  ): Promise<void>;
}

interface ErrorHandlerOpts {
  method?: RequestMethod;
  route?: string;
  details?: Record<string, any>;
  request?: Record<string, any>;
  headers?: Record<string, any>;
  topic?: string;
}

/**
 * Sentry based error handler
 * It can handle errors passed to "handle" method or emitted to "handleError" topic in event emitter
 **/
@injectable()
export class ErrorHandlerSentry implements ErrorHandler {
  /** Constructor */
  constructor(
    @inject(beans.ENV) private processEnv: ProcessEnv,
    @inject(beans.CONFIG) private config: Config,
    @inject(beans.KAFKA) private kafka: KafkaResource,
    @inject(beans.EMITTER) private emitter: Emitter,
    @inject(beans.LOGGER) private logger: ILogger,
    @inject(beans.CONTEXT_STORAGE_SERVICE)
    private contextStorage: ContextStorageService,
  ) {
    this.emitter
      .getEmitter()
      .on(EmitterEvents.handleError, (payload: EmittedError) => {
        this.handle(payload?.details?.error ?? new Error(payload.message), {
          route: this.processEnv.getServiceType(),
          details: Object.assign(payload.details ?? {}, {
            message: payload.message,
          }),
        });
      });
  }

  /** Prepares message for sentry */
  genMsg(error: BaseError, opts: ErrorHandlerOpts) {
    const frames = error?.parsedStack?.frames;
    const store = this.contextStorage?.getStore();
    const samplingDecision = 1; // include span
    const errorTags = this.contextStorage?.getErrorTags() || {};

    frames.reverse();

    return {
      exception: {
        frames: this.rewriteFrames(frames),
        error_type: error.desc,
        error_message: error.message,
      },
      component_name: this.config.apiver,
      service_name: this.config.service,
      environment: this.config.env,
      commitId: this.config.commitId,
      tags: errorTags,
      request: opts.request,
      headers: opts.headers,
      transaction: `${opts.method} ${opts.route}`,
      traceId: store.traceId,
      stack: error.stack,
      instance: this.config.instance,
      createdAt: new Date(),
      severity: 'error',
      method: opts.method,
      route: opts.route,
      oTelTraceId: `${store?.traceId}-${store?.spanId}-${samplingDecision}`,
    };
  }

  rewriteFrames(frames: DefaultFramesType[]): DefaultFramesType[] {
    const rewrittenFrames = frames.map((frame) => {
      if (frame.in_app) {
        const splitFileName = frame.file_name.split(/(dist|src)/);
        frame.file_name = splitFileName[splitFileName.length - 1];
      }
      return frame;
    });

    return rewrittenFrames;
  }

  /** Handle this error. It can be a known error of type base error, or an unhandled error */
  async handle(ex: BaseError | Error, opts?: ErrorHandlerOpts): Promise<void> {
    if (!(ex instanceof BaseError)) {
      ex = this.wrapUnhandledError(ex);
    }

    const formattedError = this.genMsg(ex as BaseError, opts);

    if (this.config.env === 'prod') {
      this.kafka.getProducer().produce({
        topic: `errors.${this.processEnv.componentType}`,
        message: formattedError,
      });
    }

    // @ts-expect-error We're wrapping the Error class if an unhandled error is found
    if (ex.parsedStack) {
      // @ts-expect-error We're wrapping the Error class if an unhandled error is found
      delete ex.parsedStack;
    }

    this.logger.errorj(ex);
  }

  /** Helper method for http transport */
  async handleHttpError(
    ex: BaseError | Error,
    req?: ExpressRequest,
    res?: ExpressResponse,
    ctx?: Context,
  ) {
    await this.handle(ex, {
      method: req?.method as RequestMethod,
      route: req?.route?.path,
      request: {
        data: {
          body: req?.body,
          query: req?.query,
          params: req?.params,
          requestId: ctx?.requestId,
          url: req?.url,
        },
        headers: req?.headers as Record<string, any>,
        method: req?.method,
      } as Record<string, any>,
      details: (ex as BaseError)?.details,
    });
  }

  async handleKafkaError(
    ex: BaseError | Error,
    req?: Request<any, any, any>,
    topic?: string,
  ) {
    await this.handle(ex, {
      request: {
        body: req?.body,
        data: {
          topic,
          body: req?.body,
        },
      } as Record<string, any>,
      topic,
      details: (ex as BaseError)?.details,
      method: 'KAFKA',
      route: topic,
    });
  }

  wrapUnhandledError(err: Error): Error {
    const parsedStack: CaptureAndParseStackReturnValue = err.stack
      ? parseStackTrace({
          currentTrace: err.stack,
          cwd: process.cwd(),
        })
      : {
          frames: [],
        };

    Object.assign(err, {
      msg: err.message ?? `Unhandled Exception :: ${err?.toString()}`,
      code: 500,
      desc: 'unknown.Error',
      details: err.cause,
      data: {},
      parsedStack,
    });

    return err;
  }
}
