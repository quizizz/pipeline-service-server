import 'module-alias/register';

import 'reflect-metadata';
import { Main } from '@app/apps';
import BeansContainer from '@app/core/beans/container';
import Beans from '@app/core/beans';

/** Loads the process */
async function main() {
  const container = BeansContainer();
  const main = container.get<Main>(Beans.MAIN);
  await main.run();
}

main().catch(console.error);
