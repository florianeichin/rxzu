import { delay, filter, take } from 'rxjs/operators';
import { BaseEntity } from './base.entity';
import { DiagramModel, PortModel, NodeModel } from './models';
import { createValueState } from './state';

export class DiagramEngineCore {
  protected canvas$ = createValueState<Element>(null);
  diagramModel: DiagramModel;

  createDiagram() {
    this.diagramModel = new DiagramModel(this);
    return this.diagramModel;
  }

  getNodeElement(node: NodeModel): HTMLElement {
    const selector = this.canvas$.value.querySelector(`[data-nodeid="${node.id}"]`);
    if (selector === null) {
      throw new Error('Cannot find Node element with node id: [' + node.id + ']');
    }
    return selector as HTMLElement;
  }

  getNodePortElement(port: PortModel): HTMLElement {
    const selector = this.canvas$.value.querySelector(
      `[data-nodeid="${port.getParent().id}"] [data-portid="${port.id}"]`
    );
    if (selector === null) {
      throw new Error(
        'Cannot find Node Port element with node id: [' + port.getParent().id + '] and port id: [' + port.id + ']'
      );
    }
    return selector as HTMLElement;
  }

  getPortCenter(port: PortModel) {
    const sourceElement = this.getNodePortElement(port);
    const sourceRect = sourceElement.getBoundingClientRect();
    const rel = this.getRelativePoint(sourceRect.left, sourceRect.top);

    return {
      x:
        sourceElement.offsetWidth / 2 +
        (rel.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0),
      y:
        sourceElement.offsetHeight / 2 +
        (rel.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0)
    };
  }

  /**
   * Calculate rectangular coordinates of the port passed in.
   */
  getPortCoords(
    port: PortModel
  ): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    const sourceElement = this.getNodePortElement(port);
    const sourceRect = sourceElement.getBoundingClientRect() as DOMRect;
    const canvasRect = this.canvas$.value.getBoundingClientRect() as ClientRect;

    return {
      x: (sourceRect.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0) - canvasRect.left,
      y: (sourceRect.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0) - canvasRect.top,
      width: sourceRect.width,
      height: sourceRect.height
    };
  }

  /**
   * Determine the width and height of the node passed in.
   * It currently assumes nodes have a rectangular shape, can be overriden for customised shapes.
   */
  getNodeDimensions(node: NodeModel): { width: number; height: number } {
    if (!this.canvas$.value) {
      return {
        width: 0,
        height: 0
      };
    }

    const nodeElement = this.getNodeElement(node);
    const nodeRect = nodeElement.getBoundingClientRect();

    return {
      width: nodeRect.width,
      height: nodeRect.height
    };
  }

  setCanvas(canvas: Element) {
    this.canvas$.set(canvas).emit();
  }

  getRelativeMousePoint(event: MouseEvent): { x: number; y: number } {
    const point = this.getRelativePoint(event.clientX, event.clientY);
    return {
      x: (point.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0),
      y: (point.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0)
    };
  }

  getRelativePoint(x: number, y: number) {
    const canvasRect = this.canvas$.value.getBoundingClientRect();
    return { x: x - canvasRect.left, y: y - canvasRect.top };
  }

  getDiagramModel() {
    return this.diagramModel;
  }

  isModelLocked(model: BaseEntity) {
    if (this.diagramModel.getLocked()) {
      return true;
    }

    return model.getLocked();
  }

  /**
   * fit the canvas zoom levels to the elements contained.
   * @param additionalZoomFactor allow for further zooming out to make sure edges doesn't cut
   */
  zoomToFit(additionalZoomFactor = 0.005) {
    this.canvas$.value$.pipe(filter(Boolean), take(1), delay(0)).subscribe((canvas: HTMLElement) => {
      const xFactor = canvas.clientWidth / canvas.scrollWidth;
      const yFactor = canvas.clientHeight / canvas.scrollHeight;
      const zoomFactor = xFactor < yFactor ? xFactor : yFactor;

      let newZoomLvl = this.diagramModel.getZoomLevel() * (zoomFactor - additionalZoomFactor);
      const maxZoomOut = this.diagramModel.getMaxZoomOut();

      if (maxZoomOut && newZoomLvl < maxZoomOut) {
        newZoomLvl = maxZoomOut;
      }

      this.diagramModel.setZoomLevel(newZoomLvl);

      // TODO: either block the canvas movement on 0,0 or detect the top left furthest element and set the offest to its edges
      this.diagramModel.setOffset(0, 0);
    });
  }
}
