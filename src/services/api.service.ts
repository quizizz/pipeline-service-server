import Beans from '@app/core/beans';
import { ApiSchema } from '@app/domains/api';
import BaseError from '@app/errors/base-error';
import { IApiRepository } from '@app/repository/api.repository';
import Result from '@app/utils/result';
import { inject, injectable } from 'inversify';

export interface IApiService {
  createApi(args: { apiSchema: ApiSchema }): Promise<Result<ApiSchema>>;
  getApi(args: { apiName: string }): Promise<Result<ApiSchema | null>>;
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

    const result = await this.apiRepository.createOne(apiSchema);

    return result;
  }

  async getApi(args: { apiName: string }): Promise<Result<ApiSchema>> {
    const { apiName } = args;

    const exists = await this.apiRepository.checkIfExists({
      name: apiName,
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
    });

    return result;
  }
}
