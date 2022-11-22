import 'reflect-metadata';

import Config from '@app/config';
import { ProcessEnv } from '@app/core/process.env';
import ServiceLocator from '@app/core/service-locator';

describe('core/service-locator', function () {
  const penv = new ProcessEnv();
  const config = new Config(penv);
  const sl = new ServiceLocator(config);

  it('should be able to set and get a value', function () {
    sl.addResource('key', 'value');
    expect(sl.getResource('key')).toBe('value');
  });
});
