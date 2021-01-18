/**
export class RxZuDiagramComponent
  implements AfterViewInit, OnDestroy, ZonedClass {
  @Input('model') diagramModel: DiagramModel;
  @Input() allowCanvasZoom = true;
  @Input() allowCanvasTranslation = true;
  @Input() inverseZoom = true;
  @Input() allowLooseLinks = true;
  @Input() maxZoomOut: number = null;
  @Input() maxZoomIn: number = null;
  @Input() portMagneticRadius = 30;

  @ViewChild('nodesLayer', { read: ViewContainerRef })
  nodesLayer: ViewContainerRef;

  @ViewChild('linksLayer', { read: ViewContainerRef })
  linksLayer: ViewContainerRef;

  @ViewChild('canvas', { read: ElementRef })
  canvas: ElementRef;

  diagramEngine: DiagramEngineCore;
  mouseManager: MouseManager;
  protected destroyed$ = new ReplaySubject<boolean>(1);
  protected selectionBox$: Observable<SelectingAction>;

  get host(): HTMLElement {
    return this.elRef.nativeElement;
  }

  constructor(
    public ngZone: NgZone,
    protected renderer: Renderer2,
    protected cdRef: ChangeDetectorRef,
    protected elRef: ElementRef<HTMLElement>
  ) {}

  ngAfterViewInit() {
    if (this.diagramModel) {
      this.diagramEngine = this.diagramModel.getDiagramEngine();
      this.mouseManager = this.diagramEngine.getMouseManager();
      this.diagramEngine.setCanvas(this.canvas.nativeElement);

      this.diagramEngine.setup({
        ...this,
      });

      (this.diagramEngine.paintNodes(this.nodesLayer) as Observable<boolean>)
        .pipe(
          switchMap(
            () =>
              this.diagramEngine.paintLinks(this.linksLayer) as Observable<void>
          )
        )
        .subscribe(() => {
          this.initSubs();
          this.initSelectionBox();
          this.cdRef.detectChanges();
        });
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  initSelectionBox() {
    this.selectionBox$ = this.diagramEngine.selectAction().pipe(
      map((a) => {
        if (
          !isNil(a) &&
          a.action instanceof SelectingAction &&
          a.state === 'firing'
        ) {
          return a.action;
        }

        return null;
      }),
      tap(() => this.cdRef.detectChanges())
    ) as Observable<SelectingAction>;
  }
}

 */

import { DiagramModel } from '@rxzu/core';
import { useEffect, useState, useRef } from 'react';
import * as React from 'react';
import styled from 'styled-components';
import { DiagramWidgetOptions } from './DiagramWidgetOptions';

const S = {
  Diagram: styled.div`
     {
      position: relative;
      flex-grow: 1;
      display: flex;
      cursor: move;
      overflow: hidden;
    }
  `,
  Selector: styled.div`
     {
      position: absolute;
      background-color: rgba(0, 192, 255, 0.2);
      border: solid 2px rgb(0, 192, 255);
    }
  `,
  NodesLayer: styled.div<{ x: number; y: number; zoom: number }>`
     {
      position: absolute;
      height: 100%;
      width: 100%;
      transform-origin: 0 0;
      overflow: visible !important;
      pointer-events: none;
      z-index: 150;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      transform: translate(${(p) => p.x}px, ${(p) => p.y}px)
        scale(${(p) => p.zoom / 100.0});
    }
  `,
  LinksLayer: styled.div<{ x: number; y: number; zoom: number }>`
     {
      position: absolute;
      height: 100%;
      width: 100%;
      transform-origin: 0 0;
      overflow: visible !important;
      pointer-events: none;
      z-index: 100;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      transform: translate(${(p) => p.x}px, ${(p) => p.y}px)
        scale(${(p) => p.zoom / 100.0});
    }
  `,
};

export const RxZuDiagramWidget = (
  model: DiagramModel,
  options?: DiagramWidgetOptions
) => {
  const engine = useRef(model.getDiagramEngine());
  const mouseManager = useRef(engine.current.getMouseManager());
  const [defaultOptions, setOptions] = useState({
    allowCanvasTranslation: true,
    allowCanvasZoom: true,
    portMagneticRadius: 30,
    inverseZoom: true,
    allowLooseLinks: true,
  });

  useEffect(() => {
    setOptions(options);
  }, [options]);

  return (
    <S.Diagram
      onMouseDown={(e) => mouseManager.current.onMouseDown(e.nativeEvent)}
      onMouseUp={(e) => mouseManager.current.onMouseUp(e.nativeEvent)}
      onMouseMove={(e) => mouseManager.current.onMouseMove(e.nativeEvent)}
      onWheel={(e) => mouseManager.current.onMouseWheel(e.nativeEvent)}
    >
      <S.NodesLayer
        x={model.getOffsetX()}
        y={model.getOffsetY()}
        zoom={model.getZoomLevel()}
      ></S.NodesLayer>
      <S.LinksLayer
        x={model.getOffsetX()}
        y={model.getOffsetY()}
        zoom={model.getZoomLevel()}
      ></S.LinksLayer>
      <S.Selector></S.Selector>
    </S.Diagram>
  );
};
