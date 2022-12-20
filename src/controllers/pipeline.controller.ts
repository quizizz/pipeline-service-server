import Beans from '@app/core/beans';
import { inject, injectable } from 'inversify';
import BaseController, { joiValidationResult } from './base.controller';
import Joi from 'joi';
import { IPipelineService } from '@app/services/pipeline.service';
import { PipelineSchema } from '@app/domains/pipeline';

@injectable()
export class PipelineController {
  constructor(
    @inject(Beans.PIPELINE_SERVICE)
    private pipelineService: IPipelineService,
  ) {}

  createCreatePipelineController(): BaseController {
    return {
      name: 'createCreatePipelineController',
      validate: ({ body }: { body: PipelineSchema }) => {
        const validationSchema = Joi.object({
          namespace: Joi.string().required(),
          schemaDefinitionVersion: Joi.string().required(),
          name: Joi.string().required(),
          version: Joi.string().required(),
          resources: Joi.array().items(
            Joi.object({
              name: Joi.string().required(),
              version: Joi.string().required(),
            }),
          ),
          config: Joi.string().required(),
          input: Joi.string(),
          steps: Joi.array().items(
            Joi.object({
              name: Joi.string().required(),
              version: Joi.string().required(),
              key: Joi.string(),
              input: Joi.string(),
              output: Joi.string(),
            }),
          ),
        });
        return joiValidationResult(validationSchema, body);
      },
      exec: async ({ body }: { body: PipelineSchema }) => {
        const result = await this.pipelineService.createPipeline({
          pipelineSchema: body,
        });

        return {
          data: result,
        };
      },
    };
  }

  createGetPipelineController(): BaseController {
    return {
      name: 'createGetPipelineController',
      validate: ({
        body,
      }: {
        body: { name: string; version: string; namespace: string };
      }) => {
        const validationSchema = Joi.object({
          name: Joi.string().required(),
          version: Joi.number().required(),
          namespace: Joi.string().required(),
        });
        return joiValidationResult(validationSchema, body);
      },
      exec: async ({
        body,
      }: {
        body: { name: string; version: number; namespace: string };
      }) => {
        const result = await this.pipelineService.getPipeline({
          pipelineName: body.name,
          pipelineVersion: body.version,
          pipelineNamespace: body.namespace,
        });

        return {
          data: result,
        };
      },
    };
  }

  createStartPipelineController(): BaseController {
    return {
      name: 'createStartPipelineController',
      validate: ({
        body,
      }: {
        body: { name: string; version: number; startedBy: string };
      }) => {
        const validationSchema = Joi.object({
          name: Joi.string().required(),
          version: Joi.string().required(),
          startedBy: Joi.string().required(),
        });
        return joiValidationResult(validationSchema, body);
      },
      exec: async ({
        body,
      }: {
        body: { name: string; version: number; startedBy: string };
      }) => {
        const result = await this.pipelineService.startPipeline({
          pipelineName: body.name,
          pipelineVersion: body.version,
          startedBy: body.startedBy,
        });

        return {
          data: result,
        };
      },
    };
  }

  createStopPipelineController(): BaseController {
    return {
      name: 'createStopPipelineController',
      validate: ({
        body,
      }: {
        body: { pipelineExecutionId: string; stoppedBy: string };
      }) => {
        const validationSchema = Joi.object({
          pipelineExecutionId: Joi.string().required(),
          stoppedBy: Joi.string().required(),
        });
        return joiValidationResult(validationSchema, body);
      },
      exec: async ({
        body,
      }: {
        body: { pipelineExecutionId: string; stoppedBy: string };
      }) => {
        const { pipelineExecutionId, stoppedBy } = body;

        const result = await this.pipelineService.stopPipeline({
          pipelineExecutionId,
          stoppedBy,
        });

        return {
          data: result,
        };
      },
    };
  }
}
