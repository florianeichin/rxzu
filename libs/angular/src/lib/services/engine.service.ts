import { ComponentFactoryResolver, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DiagramEngineCore } from '@ngx-diagrams/core';
import { NgxDiagramsModule } from '../ngx-diagrams.module';
import { PathFinding, ROUTING_SCALING_FACTOR } from '../plugins/smart-routing.plugin';

@Injectable({ providedIn: NgxDiagramsModule })
export class DiagramEngine extends DiagramEngineCore {
  protected _renderer: Renderer2;

  // smart routing related properties
  smartRouting: boolean;
  pathFinding: PathFinding;

  // calculated only when smart routing is active
  canvasMatrix: number[][] = [];
  routingMatrix: number[][] = [];

  // used when at least one element has negative coordinates
  hAdjustmentFactor = 0;
  vAdjustmentFactor = 0;

  constructor(protected resolver: ComponentFactoryResolver, protected rendererFactory: RendererFactory2) {
    super();
    this._renderer = this.rendererFactory.createRenderer(null, null);
  }

  // SMART ROUTING
  setSmartRoutingStatus(status: boolean) {
    if (status && !this.pathFinding) {
      this.pathFinding = new PathFinding(this);
    } else {
      this.pathFinding = null;
    }

    this.smartRouting = status;
  }

  getPathfinding() {
    return this.pathFinding;
  }

  calculateCanvasMatrix() {
    const {
      width: canvasWidth,
      hAdjustmentFactor,
      height: canvasHeight,
      vAdjustmentFactor
    } = this.calculateMatrixDimensions();

    this.hAdjustmentFactor = hAdjustmentFactor;
    this.vAdjustmentFactor = vAdjustmentFactor;

    const matrixWidth = Math.ceil(canvasWidth / ROUTING_SCALING_FACTOR);
    const matrixHeight = Math.ceil(canvasHeight / ROUTING_SCALING_FACTOR);

    this.canvasMatrix = Array.from({ length: matrixHeight }, (_, i) => i + 1).map(() => {
      return new Array(matrixWidth).fill(0);
    });
  }

  /**
   * Despite being a long method, we simply iterate over all three collections (nodes, ports and points)
   * to find the highest X and Y dimensions, so we can build the matrix large enough to contain all elements.
   */
  calculateMatrixDimensions(): {
    width: number;
    hAdjustmentFactor: number;
    height: number;
    vAdjustmentFactor: number;
  } {
    const allNodesCoords = this.diagramModel.getNodesArray().map((item) => ({
      x: item.getCoords().x,
      width: item.getWidth(),
      y: item.getCoords().y,
      height: item.getHeight()
    }));

    const allLinks = this.diagramModel.getLinksArray();

    const allPortsCoords = allLinks
      .flatMap((link) => [link.getSourcePort(), link.getTargetPort()])
      .filter((port) => port !== null)
      .map((item) => ({
        x: item.getX(),
        width: item.getWidth(),
        y: item.getY(),
        height: item.getHeight()
      }));

    const allPointsCoords = allLinks
      .flatMap((link) => link.getPoints())
      .map((item) => ({
        // points don't have width/height, so let's just use 0
        x: item.getCoords().x,
        width: 0,
        y: item.getCoords().y,
        height: 0
      }));

    const canvas = this.canvas$.value as HTMLDivElement;

    const allElements = allNodesCoords.concat(allPortsCoords, allPointsCoords);

    const minX =
      Math.floor(
        Math.min(
          allElements.reduce((a, b) => {
            return a.x <= b.x ? a : b;
          }).x,
          0
        ) / ROUTING_SCALING_FACTOR
      ) * ROUTING_SCALING_FACTOR;

    const maxXElement = allElements.reduce((a, b) => {
      return a.x + a.width >= b.x + b.width ? a : b;
    });

    const maxX = Math.max(maxXElement.x + maxXElement.width, canvas.offsetWidth);

    const minY =
      Math.floor(
        Math.min(
          allElements.reduce((a, b) => {
            return a.y <= b.y ? a : b;
          }).y,
          0
        ) / ROUTING_SCALING_FACTOR
      ) * ROUTING_SCALING_FACTOR;

    const maxYElement = allElements.reduce((a, b) => {
      return a.y + a.height >= b.y + b.height ? a : b;
    });

    const maxY = Math.max(maxYElement.y + maxYElement.height, canvas.offsetWidth);

    const width = Math.ceil(Math.abs(minX) + maxX);
    const height = Math.ceil(Math.abs(minY) + maxY);

    return {
      width,
      hAdjustmentFactor: Math.abs(minX) / ROUTING_SCALING_FACTOR + 1,
      height,
      vAdjustmentFactor: Math.abs(minY) / ROUTING_SCALING_FACTOR + 1
    };
  }

  /**
   * A representation of the canvas in the following format:
   *
   * +-----------------+
   * | 0 0 0 0 0 0 0 0 |
   * | 0 0 0 0 0 0 0 0 |
   * | 0 0 0 0 0 0 0 0 |
   * | 0 0 0 0 0 0 0 0 |
   * | 0 0 0 0 0 0 0 0 |
   * +-----------------+
   *
   * In which all walkable points are marked by zeros.
   * It uses @link{#ROUTING_SCALING_FACTOR} to reduce the matrix dimensions and improve performance.
   */
  getCanvasMatrix(): number[][] {
    if (this.canvasMatrix.length === 0) {
      this.calculateCanvasMatrix();
    }

    return this.canvasMatrix;
  }

  /**
   * The routing matrix does not have negative indexes, but elements could be negatively positioned.
   * We use the functions below to translate back and forth between these coordinates, relying on the
   * calculated values of hAdjustmentFactor and vAdjustmentFactor.
   */
  translateRoutingX(x: number, reverse = false) {
    return x + this.hAdjustmentFactor * (reverse ? -1 : 1);
  }
  translateRoutingY(y: number, reverse = false) {
    return y + this.vAdjustmentFactor * (reverse ? -1 : 1);
  }

  /**
   * A representation of the canvas in the following format:
   *
   * +-----------------+
   * | 0 0 1 1 0 0 0 0 |
   * | 0 0 1 1 0 0 1 1 |
   * | 0 0 0 0 0 0 1 1 |
   * | 1 1 0 0 0 0 0 0 |
   * | 1 1 0 0 0 0 0 0 |
   * +-----------------+
   *
   * In which all points blocked by a node (and its ports) are
   * marked as 1; points were there is nothing (ie, free) receive 0.
   */
  getRoutingMatrix(): number[][] {
    if (this.routingMatrix.length === 0) {
      this.calculateRoutingMatrix();
    }

    return this.routingMatrix;
  }

  calculateRoutingMatrix(): void {
    const matrix = this.getCanvasMatrix().map((item) => item.slice(0));

    // nodes need to be marked as blocked points
    this.markNodes(matrix);

    // same thing for ports
    this.markPorts(matrix);

    this.routingMatrix = matrix;
  }

  getSmartRouting() {
    return !!this.smartRouting;
  }

  /**
   * Updates (by reference) where nodes will be drawn on the matrix passed in.
   */
  markNodes(matrix: number[][]): void {
    this.diagramModel.getNodes().forEach((node) => {
      const startX = Math.floor(node.getCoords().x / ROUTING_SCALING_FACTOR);
      const endX = Math.ceil((node.getCoords().x + node.getWidth()) / ROUTING_SCALING_FACTOR);
      const startY = Math.floor(node.getCoords().y / ROUTING_SCALING_FACTOR);
      const endY = Math.ceil((node.getCoords().y + node.getHeight()) / ROUTING_SCALING_FACTOR);

      for (let x = startX - 1; x <= endX + 1; x++) {
        for (let y = startY - 1; y < endY + 1; y++) {
          this.markMatrixPoint(matrix, this.translateRoutingX(x), this.translateRoutingY(y));
        }
      }
    });
  }

  /**
   * Updates (by reference) where ports will be drawn on the matrix passed in.
   */
  markPorts(matrix: number[][]): void {
    const allElements = this.diagramModel
      .getLinksArray()
      .flatMap((link) => [link.getSourcePort(), link.getTargetPort()]);

    allElements
      .filter((port) => port !== null)
      .forEach((port) => {
        const startX = Math.floor(port.getX() / ROUTING_SCALING_FACTOR);
        const endX = Math.ceil((port.getX() + port.getWidth()) / ROUTING_SCALING_FACTOR);
        const startY = Math.floor(port.getY() / ROUTING_SCALING_FACTOR);
        const endY = Math.ceil((port.getY() + port.getHeight()) / ROUTING_SCALING_FACTOR);

        for (let x = startX - 1; x <= endX + 1; x++) {
          for (let y = startY - 1; y < endY + 1; y++) {
            this.markMatrixPoint(matrix, this.translateRoutingX(x), this.translateRoutingY(y));
          }
        }
      });
  }

  markMatrixPoint = (matrix: number[][], x: number, y: number) => {
    if (matrix[y] !== undefined && matrix[y][x] !== undefined) {
      matrix[y][x] = 1;
    }
  };
}
