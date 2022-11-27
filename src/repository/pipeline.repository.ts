import CassandraResource from '@app/bootstrap/resources/cassandra-resource';
import Beans from '@app/core/beans';
import { PipelineExecutionSchema, PipelineSchema } from '@app/domains/pipeline';
import Result from '@app/utils/result';
import { inject, injectable } from 'inversify';

export interface IPipelineRepository {
  createOne(args: PipelineSchema): Promise<Result<PipelineSchema>>;
  getPipeline(args: {
    name: string;
    version: string;
  }): Promise<Result<PipelineSchema>>;
  checkIfPipelineExists(args: {
    name: string;
    version: string;
  }): Promise<Result<boolean>>;
  checkIfPipelineExecutionExists(args: {
    pipelineExecutionId: string;
  }): Promise<Result<boolean>>;
  startPipeline(args: {
    name: string;
    version: string;
    startedBy: string;
  }): Promise<Result<PipelineExecutionSchema>>;
  stopPipelineExecution(args: {
    pipelineExecutionId: string;
    stoppedBy: string;
  }): Promise<Result<PipelineExecutionSchema>>;
}

@injectable()
export class PipelineRepository implements IPipelineRepository {
  constructor(@inject(Beans.CASSANDRA) private cassandra: CassandraResource) {}

  async checkIfPipelineExecutionExists(args: {
    pipelineExecutionId: string;
  }): Promise<Result<boolean>> {
    throw new Error('Method not implemented.');
  }

  async startPipeline(args: {
    name: string;
    version: string;
    startedBy: string;
  }): Promise<Result<PipelineExecutionSchema>> {
    throw new Error('Method not implemented.');
  }

  async stopPipelineExecution(args: {
    pipelineExecutionId: string;
    stoppedBy: string;
  }): Promise<Result<PipelineExecutionSchema>> {
    throw new Error('Method not implemented.');
  }

  async createOne(args: PipelineSchema): Promise<Result<PipelineSchema>> {
    throw new Error('Method not implemented.');
  }

  async getPipeline(args: {
    name: string;
    version: string;
  }): Promise<Result<PipelineSchema>> {
    throw new Error('Method not implemented.');
  }

  async checkIfPipelineExists(args: {
    name: string;
    version: string;
  }): Promise<Result<boolean>> {
    throw new Error('Method not implemented.');
  }
}
