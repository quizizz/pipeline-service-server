import Config from '@app/config';
import type BaseController from '@app/controllers/base.controller';
import type { ControllerFactory } from '@app/controllers/factory.controller';
import beans from '@app/core/beans';
import { ILogger } from '@app/core/logger';
import { Router } from 'express';
import { injectable, inject } from 'inversify';

/**
 *
 * @param route string
 * @param apiver string
 * @param type strinig
 * @returns string
 */
function getComponentRoute(
  route: string,
  apiver: string,
  type: string,
): string {
  return `/_${type}/${apiver}${route}`;
}

/**
 * Init routes
 */
@injectable()
export class HttpRoutes {
  constructor(
    @inject(beans.CONTROLLER_FACTORY) private factory: ControllerFactory,
    @inject(beans.META_CONTROLLER) private metaController: BaseController,
    @inject(beans.HEALTH_CONTROLLER) private healthController: BaseController,
    @inject(beans.NOT_FOUND_CONTROLLER)
    private notFoundController: BaseController,
    @inject(beans.CONFIG) private config: Config,
    @inject(beans.LOGGER) private logger: ILogger,
  ) {}

  /**
   * Create v1 apis
   * @returns Express Router
   */
  v1() {
    const router = Router();
    return router;
  }

  /**
   * Create health check and diagnosis routes
   * @returns Express Router
   */
  meta() {
    const router = Router();
    router.get('/ab', this.factory.createHttpController(this.metaController));
    router.get(
      '/health',
      this.factory.createHttpController(this.healthController),
    );
    return router;
  }

  /** init */
  init(): Router {
    const base = Router();
    this.addRouteController('/_meta/', this.meta(), base);
    this.addRouteController('/v1/', this.v1(), base);
    base.use('*', this.factory.createHttpController(this.notFoundController));
    return base;
  }

  addRouteController(route: string, controller: Router, base: Router): void {
    base.use(route, controller);
    const componentRoute = getComponentRoute(
      route,
      this.config.apiver,
      this.config.componentType,
    );
    this.logger.info('Mount route for : %s', componentRoute);
    base.use(componentRoute, controller);
  }
}
