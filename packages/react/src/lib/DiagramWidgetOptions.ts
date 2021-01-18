import { DiagramModel } from '@rxzu/core';

export interface DiagramWidgetOptions {
  diagramModel: DiagramModel;
  allowCanvasZoom: boolean;
  allowCanvasTranslation: boolean;
  inverseZoom: boolean;
  allowLooseLinks: boolean;
  maxZoomOut: number;
  maxZoomIn: number;
  portMagneticRadius: number;
}
