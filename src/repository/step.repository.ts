import CassandraResource from '@app/bootstrap/resources/cassandra-resource';
import Beans from '@app/core/beans';
import { StepSchema } from '@app/domains/step';
import Result from '@app/utils/result';
import { inject, injectable } from 'inversify';

export interface IStepRepository {
  createOne(args: StepSchema): Promise<Result<StepSchema>>;
  getStep(args: { name: string; version: number }): Promise<Result<StepSchema>>;
  checkIfPipelineExists(args: {
    name: string;
    version: number;
  }): Promise<boolean>;
}

@injectable()
export class StepRepository implements IStepRepository {
  constructor(@inject(Beans.CASSANDRA) private cassandra: CassandraResource) {}

  async createOne(args: StepSchema): Promise<Result<StepSchema>> {
    throw new Error('Method not implemented.');
  }

  async getStep(args: {
    name: string;
    version: number;
  }): Promise<Result<StepSchema>> {
    throw new Error('Method not implemented.');
  }

  async checkIfPipelineExists(args: {
    name: string;
    version: number;
  }): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
