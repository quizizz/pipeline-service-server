import {
  AssumeRoleCommand,
  GetCallerIdentityCommand,
  STSClient,
  STSClientConfig,
} from '@aws-sdk/client-sts';
import { REGION } from '@app/core/secrets-vault/common';
import readline from 'readline';
import { randomUUID } from 'crypto';
import { logger } from '@app/core/logger';

const LOCAL_ROLE = 'arn:aws:iam::399771530480:role/run-local';

const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export class STS {
  private client: STSClient;

  constructor(opts?: STSClientConfig) {
    this.client = new STSClient(Object.assign({ region: REGION }, opts));
  }

  async loadCredentials(): Promise<{
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
  }> {
    const { Arn } = await this.client.send(new GetCallerIdentityCommand({}));

    const mfa: string = await new Promise((res, rej) => {
      read.question(
        '-----------------------------------------\nFetching Credentials from remote vault.\nEnter MFA: ',
        (_mfa) => {
          if (!_mfa) {
            rej('No MFA provided');
          } else {
            res(_mfa.trim());
          }
          read.close();
        },
      );
    });
    console.log('-----------------------------------------'); // eslint-disable-line

    const { Credentials: credentials } = await this.client.send(
      new AssumeRoleCommand({
        RoleArn: LOCAL_ROLE,
        RoleSessionName: `local-session-${randomUUID()}`,
        DurationSeconds: 60 * 60 * 1,
        SerialNumber: Arn.replace('user', 'mfa'),
        TokenCode: mfa,
      }),
    );

    const {
      AccessKeyId: accessKeyId,
      SecretAccessKey: secretAccessKey,
      SessionToken: sessionToken,
    } = credentials;

    return { accessKeyId, secretAccessKey, sessionToken };
  }
}
