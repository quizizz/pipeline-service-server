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

  createAPIController(): BaseController {
    return {
      name: 'createAPIController',
      validate: ({ body }: { body: ApiSchema }) => {
        const validationSchema = Joi.object({
          schemaDefinitionVersion: Joi.string().required(),
          name: Joi.string().required(),
          type: Joi.string().required(),
          method: Joi.string().required(),
          url: Joi.string().required(),
          owner: Joi.object({
            email: Joi.string().required(),
          }).requried(),
          retry: Joi.object({
            count: Joi.number.required(),
            delay: Joi.number.required(),
          }),
        });
        return joiValidationResult(validationSchema, body);
      },
      exec: async ({ body }: { body: ApiSchema }) => {
        const result = await this.apiService.createApi({ apiSchema: body });

        return {
          data: result,
        };
      },
    };
  }

  createGetAPIController(): BaseController {
    return {
      name: 'createGetAPIController',
      validate: ({ body }: { body: { name: string } }) => {
        const validationSchema = Joi.object({
          name: Joi.string().required(),
        });
        return joiValidationResult(validationSchema, body);
      },
      exec: async ({ body }: { body: { name: string } }) => {
        const result = await this.apiService.getApi({
          apiName: body.name,
        });

        return {
          data: result,
        };
      },
    };
  }
}
