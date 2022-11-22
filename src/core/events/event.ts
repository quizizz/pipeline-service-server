import Consumer from './consumer';

/** Event context - used for error handling */
export interface EventContext {
  route: string;
  throws?: boolean;
}

/**
 * Base Event class. It is used by producers to fire a particular type of event. This in turn
 * invokes `notify` on all registered consumers.
 * For every event type, extend this class and make it injectable
 **/
export default class Event {
  name: string;
  consumers: { [_: string]: Consumer };

  /** constructor */
  constructor(name: string) {
    this.name = name;
    this.consumers = {};
  }

  /**
   * This method publishes event data for all consumers
   * It uses default context. It throws error concurrently in case of error.
   */
  publish<T>(data: T) {
    this.publishWithContext({
      context: {
        route: `events-broker/${this.name}`,
      },
      data,
    });
  }

  /** Publish, but with custom context */
  publishWithContext<T>({ context, data }: { context: EventContext; data: T }) {
    Object.values(this.consumers).map((consumer) => {
      consumer.notify({ eventName: this.name, data, context });
    });
  }

  /**
   * This method publishes event data for all consumers, wraps them in a promise and returns.
   * It uses a default context. It throws error if any of the promises fail.
   */
  async publishAwait<T>({ data }: { data: T }) {
    return this.publishAwaitWithContext({
      context: {
        route: `events-broker/${this.name}`,
      },
      data,
    });
  }

  /** Publish and return a promise, but with a custom context */
  async publishAwaitWithContext<T>({
    context,
    data,
  }: {
    context: EventContext;
    data: T;
  }) {
    return Promise.all(
      Object.values(this.consumers).map((consumer) => {
        return consumer.notify({ context, eventName: this.name, data });
      }),
    );
  }

  /**
   * This method publishes event data for all consumers, wraps them in a promise and returns.
   * It uses a default context. It doesn't throw an error, instead it returns response from
   * Promise.allSettled invocation.
   */
  async publishAwaitAllSettled<T>({ data }: { data: T }) {
    return this.publishAwaitAllSettledWithContext({
      context: {
        route: `event-broker/${this.name}`,
      },
      data,
    });
  }

  /** Publish with all settled and custom context */
  async publishAwaitAllSettledWithContext<T>({
    context,
    data,
  }: {
    context: EventContext;
    data: T;
  }) {
    return Promise.allSettled(
      Object.values(this.consumers).map((consumer) => {
        return consumer.notify({ context, eventName: this.name, data });
      }),
    );
  }

  /**
   * This function takes in either a Consumer instance or a callback function
   * and attaches it to the listeners list for this event
   */
  subscribe(consumer: Consumer) {
    this.consumers[consumer.id] = consumer;
    consumer.subscribedTo({ event: this });
    return consumer.id;
  }

  /** This consumer wants to unsubscribe */
  unsubscribe(consumer: Consumer) {
    delete this.consumers[consumer.id];
  }
}
