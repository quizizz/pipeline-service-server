import Beans from '@app/core/beans';
import { StepSchema } from '@app/domains/step';
import BaseError from '@app/errors/base-error';
import { IStepRepository } from '@app/repository/step.repository';
import Result from '@app/utils/result';
import { inject, injectable } from 'inversify';

export interface IStepService {
  createStep(args: { stepSchema: StepSchema }): Promise<Result<StepSchema>>;
  getStep(args: {
    stepName: string;
    stepVersion: string;
  }): Promise<Result<StepSchema | null>>;
}

@injectable()
export class StepService implements IStepService {
  constructor(
    @inject(Beans.STEP_REPOSITORY)
    private stepRepository: IStepRepository,
  ) {}

  async createStep(args: {
    stepSchema: StepSchema;
  }): Promise<Result<StepSchema>> {
    const { stepSchema } = args;

    const exists = await this.stepRepository.checkIfPipelineExists({
      name: stepSchema.name,
      version: stepSchema.version,
    });
    if (exists) {
      throw new BaseError(
        'step.ALREADY_PRESENT',
        400,
        'Step with this name and version already exists',
        {
          stepName: stepSchema.name,
          stepVersion: stepSchema.version,
        },
      );
    }

    const result = await this.stepRepository.createOne(stepSchema);

    return result;
  }

  async getStep(args: {
    stepName: string;
    stepVersion: string;
  }): Promise<Result<StepSchema>> {
    const { stepName, stepVersion } = args;

    const exists = await this.stepRepository.checkIfPipelineExists({
      name: stepName,
      version: stepVersion,
    });
    if (!exists) {
      throw new BaseError(
        'step.DOESNT_EXIST',
        404,
        'Step with this name and version already exists',
        {
          stepName: stepName,
          stepVersion: stepVersion,
        },
      );
    }

    const result = await this.stepRepository.getStep({
      name: stepName,
      version: stepVersion,
    });

    return result;
  }
}
