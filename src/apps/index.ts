import { AppFactory } from '@app/apps/factory.app';
import { injectable, inject } from 'inversify';
import Beans from '@app/core/beans';

/**
 * Main function to start the application
 */
@injectable()
export class Main {
  constructor(@inject(Beans.APP_FACTORY) private appFactory: AppFactory) {}

  async run() {
    const app = this.appFactory.getApp();
    await app.start();
  }
}
