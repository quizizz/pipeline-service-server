import {
  SSMClient,
  GetParametersByPathCommand,
  GetParametersByPathCommandInput,
  SSMClientConfig,
} from '@aws-sdk/client-ssm';
import { REGION } from '@app/core/secrets-vault/common';

export default class SSM {
  private client: SSMClient;
  constructor(opts?: SSMClientConfig) {
    this.client = new SSMClient(Object.assign({ region: REGION }, opts));
  }
  async getParametersByPath(
    params: GetParametersByPathCommandInput,
  ): Promise<[string, string][]> {
    const results: [string, string][] = [];
    let token = null;
    do {
      const command = new GetParametersByPathCommand(params);
      const data = await this.client.send(command);
      data.Parameters.forEach((parameter) => {
        results.push([
          parameter.Name.replace(params.Path, ''),
          parameter.Value,
        ]);
      });
      token = data.NextToken;
      if (token) {
        params = Object.assign({}, params, {
          NextToken: token,
        });
      }
    } while (token);
    return results;
  }
}
