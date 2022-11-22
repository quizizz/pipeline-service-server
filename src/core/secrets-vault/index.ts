import { existsSync, readFile, statSync, writeFile } from 'fs';
import { time } from '@app/utils';
import { promisify } from 'util';
import SSM from '@app/core/secrets-vault/ssm';
import { STS } from '@app/core/secrets-vault/sts';
import { ENV } from '@app/types';
import { isLocal } from '@app/utils/reflections';
import { Credentials } from './common';

/**
 * SecretsVault provices interface to access or set variable from remote vault, local file and
 * process' env variables.
 */
export default class SecretsVault {
  credentialsLoader: Promise<Credentials> = null;
  credentials: Credentials = null;

  constructor(private env: ENV) {}

  async loadCredentials() {
    if (this.credentialsLoader) {
      return this.credentialsLoader;
    }
    // we need a singleton promise
    this.credentialsLoader = (async () => {
      const sts = new STS();
      const credentials = await sts.loadCredentials();
      return credentials;
    })();
    return this.credentialsLoader;
  }

  /**
   * get fetches parameter from remote vault. In case it is local environment, the user might not
   * have access to all credentials - in that case user assumes a role via AWS STS which has bare
   * bones permissions. This is only possible by providing a MFA during boot process.
   * @param path to fetch parameters from
   * @returns Parameter array, where each parameter is array of [key, value]
   */
  async get(path: string) {
    let ssm: SSM = null;
    if (isLocal(this.env)) {
      this.credentials = await this.loadCredentials();
      ssm = new SSM({ credentials: this.credentials });
    } else {
      ssm = new SSM();
    }
    const parameters = await ssm.getParametersByPath({
      Path: path,
    });
    return parameters;
  }

  /**
   * set sets parameters in environment variables
   * @param parameters Receives parameters and sets them in the environment variables
   */
  set(parameters: Record<string, string> | [string, string][]) {
    const arr = Array.isArray(parameters)
      ? parameters
      : Object.entries(parameters as Record<string, string>);
    for (const [key, value] of arr) {
      process.env[key] = value;
    }
  }

  /**
   * Fetches parameters from an env file
   * @param envFile Location of env file to process and return parameters from
   * @returns if the results were stale (older than 24 hours) and array of all parameters
   */
  async getEnvFile(
    envFile: string,
  ): Promise<{ stale: boolean; parameters: [string, string][] }> {
    const result = { stale: false, parameters: [] };

    if (!existsSync(envFile)) {
      return result;
    }

    if (statSync(envFile).mtimeMs < new Date().getTime() - 24 * time.HOUR) {
      result.stale = true;
    }

    const raw = await promisify(readFile)(envFile);
    result.parameters = raw
      .toString()
      .trim()
      .split('\n')
      .reduce((acc: [string, string][], line: string) => {
        const [key, value] = line.trim().split('=');
        // there is a support for ignoring comments beginning with # or --
        if (key && value && key[0] !== '#' && key.slice(0, 2) !== '--') {
          acc.push([key, value]);
        }
        return acc;
      }, [] as [string, string][]);

    return result;
  }

  /**
   * setEnvFile sets parameters in the given env file
   * @param envFile path to the file
   * @param parameters array of parameters as [key, value]
   */
  async setEnvFile(envFile: string, parameters: [string, string][]) {
    if (!parameters) {
      parameters = [];
    }
    const raw = parameters.map(([key, value]) => `${key}=${value}`).join('\n');
    await promisify(writeFile)(envFile, raw);
  }
}
