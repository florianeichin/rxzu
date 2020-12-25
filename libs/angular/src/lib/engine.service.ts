import { ComponentFactoryResolver, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DiagramEngineCore } from '@ngx-diagrams/core';
import { DefaultLabelFactory, DefaultLinkFactory, DefaultNodeFactory, DefaultPortFactory } from './defaults';
import { NgxDiagramsModule } from './ngx-diagrams.module';

@Injectable({ providedIn: NgxDiagramsModule })
export class DiagramEngine extends DiagramEngineCore {
  protected _renderer: Renderer2;

  constructor(protected resolver: ComponentFactoryResolver, protected rendererFactory: RendererFactory2) {
    super();
    this._renderer = this.rendererFactory.createRenderer(null, null);
  }

  registerDefaultFactories() {
    const factoriesManager = this.getFactoriesManager();
    factoriesManager.registerFactory({
      type: 'nodeFactories',
      factory: new DefaultNodeFactory(this.resolver, this._renderer)
    });

    factoriesManager.registerFactory({
      type: 'linkFactories',
      factory: new DefaultLinkFactory(this.resolver, this._renderer)
    });

    factoriesManager.registerFactory({
      type: 'portFactories',
      factory: new DefaultPortFactory(this.resolver, this._renderer)
    });

    factoriesManager.registerFactory({
      type: 'labelFactories',
      factory: new DefaultLabelFactory(this.resolver, this._renderer)
    });
  }
}
