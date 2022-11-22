import { ENV } from '@app/types';

/**
 * Checks if env is local
 */
export function isLocal(env: ENV) {
  return env === 'local';
}
