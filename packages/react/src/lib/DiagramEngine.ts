import { DiagramEngineCore } from '@rxzu/core';

export class DiagramEngine extends DiagramEngineCore {
  constructor() {
    super();
    const factoriesManager = this.getFactoriesManager();
    factoriesManager.registerFactory({
      type: 'nodeFactories',
      factory: new DefaultNodeFactory(this.resolver, this._renderer),
    });

    factoriesManager.registerFactory({
      type: 'linkFactories',
      factory: new DefaultLinkFactory(this.resolver, this._renderer),
    });

    factoriesManager.registerFactory({
      type: 'portFactories',
      factory: new DefaultPortFactory(this.resolver, this._renderer),
    });

    factoriesManager.registerFactory({
      type: 'labelFactories',
      factory: new DefaultLabelFactory(this.resolver, this._renderer),
    });
  }
}
