import Beans from '@app/core/beans';
import { PipelineExecutionSchema, PipelineSchema } from '@app/domains/pipeline';
import BaseError from '@app/errors/base-error';
import { IPipelineRepository } from '@app/repository/pipeline.repository';
import Result from '@app/utils/result';
import { inject, injectable } from 'inversify';

export interface IPipelineService {
  createPipeline(args: {
    pipelineSchema: PipelineSchema;
  }): Promise<Result<PipelineSchema>>;
  getPipeline(args: {
    pipelineName: string;
    pipelineVersion: string;
    pipelineNamespace: string;
  }): Promise<Result<PipelineSchema | null>>;
  startPipeline(args: {
    pipelineName: string;
    pipelineVersion: string;
    startedBy: string;
  }): Promise<Result<PipelineExecutionSchema | null>>;
  stopPipeline(args: {
    pipelineExecutionId: string;
    stoppedBy: string;
  }): Promise<Result<PipelineExecutionSchema | null>>;
}

@injectable()
export class PipelineService implements IPipelineService {
  constructor(
    @inject(Beans.PIPELINE_REPOSITORY)
    private pipelineRepository: IPipelineRepository,
  ) {}

  async startPipeline(args: {
    pipelineName: string;
    pipelineVersion: string;
    startedBy: string;
    pipelineNamespace: string;
  }): Promise<Result<PipelineExecutionSchema>> {
    const { pipelineName, pipelineVersion, startedBy, pipelineNamespace } =
      args;

    const exists = await this.pipelineRepository.checkIfPipelineExists({
      name: pipelineName,
      version: pipelineVersion,
      namespace: pipelineNamespace,
    });
    if (exists) {
      throw new BaseError(
        'pipeline.DOESNT_EXIST',
        404,
        'Pipeline with this name and version doesnt exists',
        {
          pipelineName: pipelineName,
          pipelineversion: pipelineVersion,
        },
      );
    }

    const result = await this.pipelineRepository.startPipeline({
      name: pipelineName,
      version: pipelineVersion,
      startedBy: startedBy,
      namespace: pipelineNamespace,
    });

    return result;
  }

  async stopPipeline(args: {
    pipelineExecutionId: string;
    stoppedBy: string;
  }): Promise<Result<PipelineExecutionSchema>> {
    const { pipelineExecutionId, stoppedBy } = args;

    const exists = await this.pipelineRepository.checkIfPipelineExecutionExists(
      {
        pipelineExecutionId,
      },
    );
    if (exists) {
      throw new BaseError(
        'pipelineExecution.DOESNT_EXIST',
        404,
        'Pipeline execution with this pipelineExecutionId doesnt exists',
        {
          pipelineExecutionId,
        },
      );
    }

    const result = await this.pipelineRepository.stopPipelineExecution({
      pipelineExecutionId,
      stoppedBy,
    });

    return result;
  }

  async createPipeline(args: {
    pipelineSchema: PipelineSchema;
  }): Promise<Result<PipelineSchema>> {
    const { pipelineSchema } = args;

    const exists = await this.pipelineRepository.checkIfPipelineExists({
      name: pipelineSchema.name,
      version: pipelineSchema.version,
      namespace: pipelineSchema.namespace,
    });
    if (exists) {
      throw new BaseError(
        'pipeline.ALREADY_PRESENT',
        400,
        'Pipeline with this name and version already exists',
        {
          pipelineName: pipelineSchema.name,
          pipelineversion: pipelineSchema.version,
        },
      );
    }

    const result = await this.pipelineRepository.createOne(pipelineSchema);

    return result;
  }

  async getPipeline(args: {
    pipelineName: string;
    pipelineVersion: string;
    pipelineNamespace: string;
  }): Promise<Result<PipelineSchema>> {
    const { pipelineName, pipelineVersion, pipelineNamespace } = args;

    const exists = await this.pipelineRepository.checkIfPipelineExists({
      name: pipelineName,
      version: pipelineVersion,
      namespace: pipelineNamespace,
    });
    if (!exists) {
      throw new BaseError(
        'pipeline.DOESNT_EXIST',
        404,
        'Pipeline with this name and version doesnt exists',
        {
          pipelineName: pipelineName,
          pipelineVersion: pipelineVersion,
          pipelineNamespace: pipelineNamespace,
        },
      );
    }

    const result = await this.pipelineRepository.getPipeline({
      name: pipelineName,
      version: pipelineVersion,
    });

    return result;
  }
}
