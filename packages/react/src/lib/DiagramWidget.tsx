/**
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
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
  console.log(options);
  const canvas = useRef(null);
  const engine = model.getDiagramEngine();
  engine.setup(options);
  engine.setCanvas(canvas.current);

  const mouseManager = engine.getMouseManager();

  (engine.paintNodes() as Observable<boolean>)
    .pipe(switchMap(() => engine.paintLinks()))
    .subscribe(() => {
      console.log('PAINTING!');
    });

  const [defaultOptions, setOptions] = useState({
    allowCanvasTranslation: true,
    allowCanvasZoom: true,
    portMagneticRadius: 30,
    inverseZoom: true,
    allowLooseLinks: true,
  });

  useEffect(() => {
    setOptions({ ...defaultOptions, ...options });
  }, [options, defaultOptions]);

  return (
    <S.Diagram
      ref={canvas}
      onMouseDown={(e) => mouseManager.onMouseDown(e.nativeEvent)}
      onMouseUp={(e) => mouseManager.onMouseUp(e.nativeEvent)}
      onMouseMove={(e) => mouseManager.onMouseMove(e.nativeEvent)}
      onWheel={(e) => mouseManager.onMouseWheel(e.nativeEvent)}
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
