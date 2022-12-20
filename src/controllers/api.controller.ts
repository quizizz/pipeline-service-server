import Beans from '@app/core/beans';
import { inject, injectable } from 'inversify';
import BaseController, { joiValidationResult } from './base.controller';
import Joi from 'joi';
import { ApiSchema } from '@app/domains/api';
import { IApiService } from '@app/services/api.service';

@injectable()
export class ApiController {
  constructor(
    @inject(Beans.API_SERVICE)
    private apiService: IApiService,
  ) {}

  createCreateAPIController(): BaseController {
    return {
      name: 'createCreateAPIController',
      validate: ({ body }: { body: ApiSchema }) => {
        const validationSchema = Joi.object({
          schemaDefinitionVersion: Joi.string().required(),
          name: Joi.string().required(),
          version: Joi.number().required(),
          data: Joi.object({
            type: Joi.string().required(),
            functionName: Joi.string().required(),
            owner: Joi.object({
              service: Joi.string().required(),
            }).required(),
          }),
        });
        return joiValidationResult(validationSchema, body);
      },
      exec: async ({ body }: { body: ApiSchema }) => {
        const result = await this.apiService.createApi({ apiSchema: body });

        return {
          data: result.ok(),
        };
      },
    };
  }

  createGetAPIController(): BaseController {
    return {
      name: 'createGetAPIController',
      validate: ({ params }: { params: { name: string; version: number } }) => {
        const validationSchema = Joi.object({
          name: Joi.string().required(),
          version: Joi.number().required(),
        });
        return joiValidationResult(validationSchema, params);
      },
      exec: async ({
        params,
      }: {
        params: { name: string; version: number };
      }) => {
        const result = await this.apiService.getApi({
          apiName: params.name,
          apiVersion: params.version,
        });

        return {
          data: result,
        };
      },
    };
  }
}
