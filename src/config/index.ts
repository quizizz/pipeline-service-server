import { parse, types } from 'mapofenv';
const { string, number, boolean, json } = types;
import safeJSON from 'safely-parse-json';
import { ENV } from '@app/types';
import { randomUUID } from 'crypto';
import { injectable, inject } from 'inversify';
import beans from '@app/core/beans';
import { ProcessEnv } from '@app/core/process.env';
import ObjectID from 'bson-objectid';

@injectable()
export default class Config {
  id: string = ObjectID().toHexString();
  env: string = null;
  type: string = null;
  service: string = null;
  instance: string = string(randomUUID());
  commitId: string = string('local');
  runversion: string = string('local');
  apiver: string = string('main');
  componentType: string = string('template');
  server: { port: number } = {
    port: number(8080),
  };
  app: { kind: string; debug: { use: boolean; level: number } } = {
    kind: string('server'),
    debug: {
      use: boolean(false),
      level: number(5),
    },
  };
  aws?: { region?: string } = json({
    region: 'us-east-1',
  });
  kafka?: {
    enableConsumer: boolean;
    groupId?: string;
    brokers: [];
    topics?: {
      [topicName: string]: {
        groupId: string;
      };
    };
  } = {
    enableConsumer: boolean(false),
    groupId: string('template-service'),
    brokers: json([
      '54.163.209.78:9092',
      '52.201.103.122:9092',
      '34.234.67.78:9092',
    ]),
  };

  constructor(@inject(beans.ENV) private processEnv: ProcessEnv) {
    this.env = string(processEnv.env);
    this.service = string(this.processEnv.service);
    this.type = string(this.processEnv.appType);
    this.kafka.groupId = string(this.processEnv.getServiceType());
  }

  private select<T>(env: ENV, forProd: T, forDev: T): T {
    return env === 'prod' ? forProd : forDev;
  }

  /**
   * Creates a certificate format string from key stored in the secret vault
   * @returns Final formatted certificate string
   */
  private privateKey() {
    return (val?: string) => {
      if (!val) {
        return null;
      }
      const content = val.split(':').join('\n');
      return `-----BEGIN PRIVATE KEY-----\n${content}\n-----END PRIVATE KEY-----\n`;
    };
  }

  /**
   * Safely parse input or default to the given value in case original is undefined
   * @param def Default value to return
   * @returns Safely parsed json of the input or the default value
   */
  private safeJSONOrDefault<T>(def?: T): () => T {
    return (val?: T) => {
      if (val === undefined) {
        return def;
      }
      return safeJSON(val) as T;
    };
  }

  /**
   *
   * @param service
   * @param env
   * @returns
   */
  public async load(): Promise<void> {
    const config: Record<keyof Config, any> = parse(this, {
      prefix: [
        'NODE',
        'N',
        `Q_${this.processEnv.service.toUpperCase()}`,
        'Q',
        'QUIZIZZ',
      ], // decreasing precendence of namespace
    });
    Object.keys(config).forEach((k) => {
      this[k] = config[k];
    });
  }
}
