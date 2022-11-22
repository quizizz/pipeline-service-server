import { injectable } from 'inversify';
import BaseController from './base.controller';
import NotFoundError from '@app/errors/not-found-error';

@injectable()
export class NotFoundController implements BaseController {
  name: 'NotFoundController';

  async exec() {
    throw new NotFoundError('No route matching this path found');
  }
}
