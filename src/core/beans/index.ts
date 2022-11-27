/** Identifiers for all dependencies */
export default {
  MAIN: Symbol.for('main'),
  ENV: Symbol.for('process_env'),
  LOGGER: Symbol.for('logger'),
  SERVICE_LOCATOR: Symbol.for('service_locator'),
  BOOTSTRAP: Symbol.for('bootstrap'),
  APP_FACTORY: Symbol.for('factory<app>'),
  HTTP_SERVER: Symbol.for('http_server'),
  HTTP_FACTORY: Symbol.for('factory<http_server>'),
  CONTROLLER_FACTORY: Symbol.for('factory<controller>'),
  HTTP_ROUTES: Symbol.for('http_routes'),
  ERROR_HANDLER: Symbol.for('error_handler'),
  CONFIG: Symbol.for('config'),
  MIDDLEWARE_FACTORY: Symbol.for('middleware_factory'),
  EMITTER: Symbol.for('emitter'),

  // resources
  EXAMPLE: Symbol.for('example'),
  KAFKA: Symbol.for('kafka_resource'),
  CASSANDRA: Symbol.for('cassandra'),
  TEMPORAL: Symbol.for('temporal'),

  // controllers
  META_CONTROLLER: Symbol.for('meta_controller'),
  HEALTH_CONTROLLER: Symbol.for('health_controller'),
  NOT_FOUND_CONTROLLER: Symbol.for('not_found_controller'),
  API_CONTROLLER: Symbol.for('api_controller'),
  PIPELINE_CONTROLLER: Symbol.for('pipeline_controller'),
  STEP_CONTROLLER: Symbol.for('step_controller'),

  // services
  CONTEXT_STORAGE_SERVICE: Symbol.for('context_storage_service'),
  API_SERVICE: Symbol.for('api_service'),
  PIPELINE_SERVICE: Symbol.for('pipeline_service'),
  STEP_SERVICE: Symbol.for('step_service'),

  // repositories
  API_REPOSITORY: Symbol.for('api_repository'),
  PIPELINE_REPOSITORY: Symbol.for('pipeline_repository'),
  STEP_REPOSITORY: Symbol.for('step_repository'),
};
