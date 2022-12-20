import Beans from '@app/core/beans';
import { inject, injectable } from 'inversify';
import BaseController, { joiValidationResult } from './base.controller';
import Joi from 'joi';
import { StepSchema } from '@app/domains/step';
import { IStepService } from '@app/services/step.service';

@injectable()
export class StepController {
  constructor(
    @inject(Beans.STEP_SERVICE)
    private stepService: IStepService,
  ) {}

  createCreateStepController(): BaseController {
    return {
      name: 'createCreateStepController',
      validate: ({ body }: { body: StepSchema }) => {
        const validationSchema = Joi.object({
          schemaDefinitionVersion: Joi.string().required(),
          name: Joi.string().required(),
          version: Joi.string().required(),
          key: Joi.string(),
          api: Joi.object({
            name: Joi.string().required(),
          }).required(),
          input: Joi.object({
            map: Joi.string(),
          }),
          output: Joi.object({
            map: Joi.string(),
          }),
          reusable: Joi.boolean().required(),
        });
        return joiValidationResult(validationSchema, body);
      },
      exec: async ({ body }: { body: StepSchema }) => {
        const result = await this.stepService.createStep({ stepSchema: body });

        return {
          data: result,
        };
      },
    };
  }

  createGetStepController(): BaseController {
    return {
      name: 'createGetStepController',
      validate: ({ body }: { body: { name: string; version: string } }) => {
        const validationSchema = Joi.object({
          name: Joi.string().required(),
          version: Joi.number().required(),
        });
        return joiValidationResult(validationSchema, body);
      },
      exec: async ({ body }: { body: { name: string; version: number } }) => {
        const result = await this.stepService.getStep({
          stepName: body.name,
          stepVersion: body.version,
        });

        return {
          data: result,
        };
      },
    };
  }
}
