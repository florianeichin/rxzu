import { ComponentFactoryResolver, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DiagramEngineCore } from '@ngx-diagrams/core';
import { NgxDiagramsModule } from './ngx-diagrams.module';

@Injectable({ providedIn: NgxDiagramsModule })
export class DiagramEngine extends DiagramEngineCore {
  protected _renderer: Renderer2;

  constructor(protected resolver: ComponentFactoryResolver, protected rendererFactory: RendererFactory2) {
    super();
    this._renderer = this.rendererFactory.createRenderer(null, null);
  }
}
