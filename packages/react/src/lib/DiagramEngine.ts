import { DiagramEngineCore } from '@rxzu/core';
import {
  DefaultLabelFactory,
  DefaultLinkFactory,
  DefaultNodeFactory,
  DefaultPortFactory,
} from './defaults/factories';

export class DiagramEngine extends DiagramEngineCore {
  registerDefaultFactories() {
    const factoriesManager = this.getFactoriesManager();
    factoriesManager.registerFactory({
      type: 'nodeFactories',
      factory: new DefaultNodeFactory(),
    });

    factoriesManager.registerFactory({
      type: 'linkFactories',
      factory: new DefaultLinkFactory(),
    });

    factoriesManager.registerFactory({
      type: 'portFactories',
      factory: new DefaultPortFactory(),
    });

    factoriesManager.registerFactory({
      type: 'labelFactories',
      factory: new DefaultLabelFactory(),
    });
  }
}
