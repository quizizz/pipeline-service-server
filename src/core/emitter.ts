import beans from '@app/core/beans';
import { ILogger } from '@app/core/logger';
import { EventEmitter } from 'events';
import { injectable, inject } from 'inversify';

export enum EmitterEvents {
  log = 'log',
  success = 'success',
  error = 'error',
  handleError = 'handleError',
}
export interface EmittedError {
  message: string;
  details?: {
    error?: Error;
  };
}

/**
 * Event emitter for the application. It's primary use cases is capture any events from any resource
 * and to relay global errors to event handler.
 **/
@injectable()
export default class Emitter {
  emitter: EventEmitter;
  constructor(@inject(beans.LOGGER) logger: ILogger) {
    const emitter = new EventEmitter();
    emitter.on(EmitterEvents.log, (payload: any) =>
      logger.infoj({ type: 'resource-event', data: payload }),
    );
    emitter.on(EmitterEvents.success, (payload: any) =>
      logger.infoj({ type: 'resource-event', data: payload }),
    );
    emitter.on(EmitterEvents.error, (payload: EmittedError) => {
      logger.errorj({ type: 'resource-event', data: payload });
      emitter.emit(EmitterEvents.handleError, payload);
    });
    this.emitter = emitter;
  }

  getEmitter(): EventEmitter {
    return this.emitter;
  }
}
