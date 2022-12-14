import Beans from '@app/core/beans';
import { ApiSchema } from '@app/domains/api';
import BaseError from '@app/errors/base-error';
import { IApiRepository } from '@app/repository/api.repository';
import Result from '@app/utils/result';
import { inject, injectable } from 'inversify';

export interface IApiService {
  createApi(args: { apiSchema: ApiSchema }): Promise<Result<ApiSchema>>;
  getApi(args: {
    apiName: string;
    apiVersion: number;
  }): Promise<Result<ApiSchema | null>>;
}

@injectable()
export class ApiService implements IApiService {
  constructor(
    @inject(Beans.API_REPOSITORY)
    private apiRepository: IApiRepository,
  ) {}

  async createApi(args: { apiSchema: ApiSchema }): Promise<Result<ApiSchema>> {
    const { apiSchema } = args;

    const exists = await this.apiRepository.checkIfExists({
      name: apiSchema.name,
      version: apiSchema.version,
    });
    if (exists) {
      throw new BaseError(
        'api.ALREADY_PRESENT',
        400,
        'API with this name already exists',
        {
          apiName: apiSchema.name,
        },
      );
    }

    const currentTimestamp = Date.now();
    apiSchema.createdAt = currentTimestamp;

    console.log('temp', apiSchema);

    const result = await this.apiRepository.createOne(apiSchema);

    return result;
  }

  async getApi(args: {
    apiName: string;
    apiVersion: number;
  }): Promise<Result<ApiSchema>> {
    const { apiName, apiVersion } = args;

    const exists = await this.apiRepository.checkIfExists({
      name: apiName,
      version: apiVersion,
    });
    if (!exists) {
      throw new BaseError(
        'api.DOESNT_EXIST',
        404,
        'API with this name already exists',
        {
          apiName: apiName,
        },
      );
    }

    const result = await this.apiRepository.getApi({
      name: apiName,
      version: apiVersion,
    });

    return result;
  }
}
