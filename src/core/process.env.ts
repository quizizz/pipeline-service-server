import { APP_TYPE } from '@app/apps/factory.app';
import { injectable } from 'inversify';

/**
 * ProcessEnv loads relevant env variables on boot
 */
@injectable()
export class ProcessEnv {
  env: string;
  service: string;
  appType: APP_TYPE;
  componentType: string;
  constructor() {
    this.env = process.env.NODE_ENV;
    this.service = process.env.SERVICE;
    this.appType = process.env.APP_TYPE as APP_TYPE;
    this.componentType = process.env.NODE_COMPONENT_TYPE;
  }

  getServiceType() {
    return `${this.service}_${this.appType}`;
  }
}
