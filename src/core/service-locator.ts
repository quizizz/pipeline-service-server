import type Config from '@app/config';
import beans from '@app/core/beans';
import { injectable, inject } from 'inversify';

/**
 * Service Locator is a class which can be used a global key value store.
 */
@injectable()
export default class ServiceLocator {
  resource: Record<string, any> = {};

  constructor(@inject(beans.CONFIG) public config: Config) {}

  getConfig(): Config {
    return this.config;
  }

  /** typeless resources can go here, all typed resources must have proper getter and setter */
  addResource<T>(key: string, value: T) {
    this.resource[key] = value;
  }

  getResource<T>(key: string): T {
    return this.resource[key];
  }
}
