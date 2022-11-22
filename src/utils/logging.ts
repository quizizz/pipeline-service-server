import BaseError from '@app/errors/base-error';

/**
 * Parse error for logging
 * @param err
 * @returns
 */
export function parseError(err: BaseError) {
  return {
    type: err.desc || 'unknown.ERROR',
    details: err.details,
  };
}

/**
 * Meta info about running service
 * @returns
 */
export function parseMeta() {
  return {
    version: process.env.NODE_RUNVERSION || 'local',
    componentName: process.env.NODE_APIVER || 'local',
  };
}
