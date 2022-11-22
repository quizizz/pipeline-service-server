import { randomUUID } from 'crypto';
import Emitter, { EmittedError, EmitterEvents } from '../emitter';
import Event from './event';

export type EventCallback = (args: {
  eventName: string;
  data: any;
}) => Promise<any>;

/**
 * Consumer base class. Use by subscribers to react to an event by registering this in an event.
 * For every consumer type, extend this class and make that injectable.
 **/
export default class Consumer {
  id: string;
  watching: Event[];

  /** constructor */
  constructor(
    private emitter: Emitter,
    private name: string,
    private cb: EventCallback,
  ) {
    this.id = randomUUID();
    this.watching = [];
  }

  /** Subscribe to the given event */
  subscribedTo({ event }: { event: Event }) {
    this.watching.push(event);
  }

  /** Delete this consumer */
  delete() {
    this.watching.forEach((event) => {
      event.unsubscribe(this);
    });
    this.watching = [];
  }

  /** Utility method called by Event to notify this consumer of the occurrence */
  async notify<T>({
    eventName,
    data,
    context: { route, throws = true },
  }: {
    eventName: string;
    data: T;
    context: { route: string; throws?: boolean };
  }) {
    try {
      const response = await this.cb({ eventName, data });
      return { consumerName: this.name, consumerId: this.id, response };
    } catch (ex) {
      if (throws) {
        this.emitter.getEmitter().emit(EmitterEvents.handleError, {
          message: ex?.message,
          details: {
            route,
            error: ex,
          },
        } as EmittedError);
      }
      throw ex;
    }
  }
}
