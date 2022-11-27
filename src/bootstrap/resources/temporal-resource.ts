import type { Resource } from '@app/bootstrap/bootstrap';
import Config from '@app/config';
import beans from '@app/core/beans';
import Emitter from '@app/core/emitter';
import { injectable, inject } from 'inversify';

@injectable()
export default class TemporalResource implements Resource {
  constructor(
    @inject(beans.CONFIG) private config: Config,
    @inject(beans.EMITTER) private emitter: Emitter,
  ) {}

  async load() {
    this.emitter.getEmitter().emit('log', {
      service: 'pipeline-server-service',
      message: 'loading up temporal',
      data: {
        time: new Date(),
      },
    });

    this.emitter.getEmitter().emit('success', {
      service: 'pipeline-server-service',
      message: 'loaded up temporal',
    });
    return;
  }
}
