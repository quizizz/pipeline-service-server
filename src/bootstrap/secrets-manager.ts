import SecretsVault from '@app/core/secrets-vault';
import { ENV } from '@app/types';

const envFile = (env: string) => `./.env.${env}`;

export default class SecretsManager {
  constructor(private env: ENV, private service: string) {}

  /**
   * loadSecrets method loads secret into environment variables on boot
   */
  async loadSecrets() {
    const vault = new SecretsVault(this.env);
    const secrets: [string, string][] = [];
    if (this.env === 'prod' || this.env == 'dev') {
      const remoteSecrets = await Promise.all([
        vault.get(`/${this.env}/`),
        vault.get(`/${this.env}/${this.service}/`),
      ]);
      remoteSecrets.flat().forEach((secret) => secrets.push(secret));
    } else if (this.env === 'local' || this.env === 'test') {
      const [devFile, localFile] = await Promise.all([
        vault.getEnvFile(envFile(ENV.dev)),
        vault.getEnvFile(envFile(this.env)),
      ]);
      if (devFile.parameters.length == 0 || devFile.stale) {
        // in order of precendence
        const remoteSecrets = await Promise.all([
          // first remote dev parameters
          vault.get(`/${ENV.dev}/`),
          vault.get(`/${ENV.dev}/${this.service}/`),

          // then remote local parameters
          vault.get(`/${this.env}/`),
          vault.get(`/${this.env}/${this.service}/`),
        ]).then((allSecrets) => allSecrets.flat());

        remoteSecrets.forEach((secret) => secrets.push(secret));
        vault.setEnvFile(envFile(ENV.dev), remoteSecrets).catch(console.error); // async op
      } else {
        devFile.parameters.forEach((secret) => secrets.push(secret));
      }
      // Local env gets maximum preference
      localFile.parameters.forEach((parameter) => secrets.push(parameter));
    } else {
      throw new Error(`Invalid env ${this.env}`);
    }

    vault.set(secrets);
  }
}
