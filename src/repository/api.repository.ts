import CassandraResource from '@app/bootstrap/resources/cassandra-resource';
import Beans from '@app/core/beans';
import { ApiSchema } from '@app/domains/api';
import Result from '@app/utils/result';
import { inject, injectable } from 'inversify';

export interface IApiRepository {
  createOne(args: ApiSchema): Promise<Result<ApiSchema>>;
  getApi(args: { name: string; version: number }): Promise<Result<ApiSchema>>;
  checkIfExists(args: { name: string; version: number }): Promise<boolean>;
}

@injectable()
export class ApiRepository implements IApiRepository {
  table: string;

  constructor(@inject(Beans.CASSANDRA) private cassandra: CassandraResource) {
    this.table = 'api';
  }

  async createOne(args: ApiSchema): Promise<Result<ApiSchema>> {
    const columns = [
      'name',
      'version',
      'schemaDefinitionVersion',
      'data',
      'createdAt',
    ];

    const query = `INSERT INTO "${this.table}" (${columns.join(
      ', ',
    )}) VALUES (?, ?, ?, ?, ?)`;
    const params = [
      args.name,
      args.version,
      args.schemaDefinitionVersion,
      JSON.stringify(args.data),
      args.createdAt,
    ];
    await this.cassandra.executeQuery(query, params);
    return;
  }

  async getApi(args: {
    name: string;
    version: number;
  }): Promise<Result<ApiSchema>> {
    const { name, version } = args;

    const query = `SELECT * FROM "${this.table}" WHERE "name" = ? AND "version" = ?`;
    const params = [name, version];
    const response = await this.cassandra.executeQuery(query, params);

    if (Array.isArray(response.rows)) {
      return Result.ok(response.rows[0]);
    }

    return Result.err(
      `API with the name ${name} and version ${version} doesn't exist`,
    );
  }

  async checkIfExists(args: {
    name: string;
    version: number;
  }): Promise<boolean> {
    const { name, version } = args;

    const query = `SELECT * FROM "${this.table}" WHERE "name" = ? AND "version" = ?`;
    const params = [name, version];
    const response = await this.cassandra.executeQuery(query, params);

    if (Array.isArray(response.rows)) {
      return response.rowLength > 0;
    }

    return false;
  }
}
