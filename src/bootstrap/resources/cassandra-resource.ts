import type { Resource } from '@app/bootstrap/bootstrap';
import Config from '@app/config';
import beans from '@app/core/beans';
import { injectable, inject } from 'inversify';
import Emitter from '@app/core/emitter';
import { Client as CassandraClient } from '@quizizz/cassandra';

export interface ICassandraResource extends Resource {
  load(): Promise<void>;
  executeQuery(
    query: string,
    params: Array<any>,
    queryOptions?: object,
  ): Promise<unknown>;
}

@injectable()
export default class CassandraResource implements ICassandraResource {
  private _client: CassandraClient = null;
  constructor(
    @inject(beans.CONFIG) private config: Config,
    @inject(beans.EMITTER) private emitter: Emitter,
  ) {}

  async load() {
    const { clientName = 'pipeline-server-service', clientOptions } =
      this.config.cassandra;

    this._client = new CassandraClient(
      clientName,
      this.emitter.getEmitter(),
      clientOptions,
    );
    await this._client.connect();

    // shutdown cassandra connection(s) when process is killed or dies.
    process.on('SIGTERM', () => this._client.shutdown());
  }

  async executeQuery(
    query: string,
    params: Array<any>,
    queryOptions?: object,
  ): Promise<unknown> {
    const result = await this._client.execute(query, params, queryOptions);
    return result;
  }
}
