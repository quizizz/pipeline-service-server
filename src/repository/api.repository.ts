import CassandraResource from '@app/bootstrap/resources/cassandra-resource';
import Beans from '@app/core/beans';
import { ApiSchema } from '@app/domains/api';
import Result from '@app/utils/result';
import { inject, injectable } from 'inversify';

export interface IApiRepository {
  createOne(args: ApiSchema): Promise<Result<ApiSchema>>;
  getApi(args: { name: string }): Promise<Result<ApiSchema>>;
  checkIfExists(args: { name: string }): Promise<boolean>;
}

@injectable()
export class ApiRepository implements IApiRepository {
  constructor(@inject(Beans.CASSANDRA) private cassandra: CassandraResource) {}

  async createOne(args: ApiSchema): Promise<Result<ApiSchema>> {
    throw new Error('Method not implemented.');
  }

  async getApi(args: { name: string }): Promise<Result<ApiSchema>> {
    throw new Error('Method not implemented.');
  }

  async checkIfExists(args: { name: string }): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
