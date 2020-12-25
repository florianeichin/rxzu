import { delay, filter, take, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { BaseEntity } from './base.entity';
import { FactoriesManager } from './factories';
import { AbstractAngularFactory } from './factories/angular.factory';
import { DiagramModel, PortModel, NodeModel, LinkModel, BaseModel } from './models';
import { createValueState } from './state';
import { BaseAction, EntityMap, SelectingAction } from '..';

export class DiagramEngineCore {
  protected canvas$ = createValueState<Element>(null);
  protected factoriesManager: FactoriesManager<AbstractAngularFactory>;
  diagramModel: DiagramModel;

  protected nodes$: Observable<EntityMap<NodeModel>>;
  protected links$: Observable<EntityMap<LinkModel>>;
  protected nodesRendered$ = new BehaviorSubject<boolean>(false);
  protected action$ = new BehaviorSubject<BaseAction>(null);

  constructor() {
    if (this.factoriesManager) {
      this.factoriesManager.dispose();
    }

    this.factoriesManager = new FactoriesManager();
  }

  createDiagram() {
    if (this.diagramModel) {
      throw new Error('diagram model already exists, please reset model prior to creating new diagram');
    }
    this.diagramModel = new DiagramModel(this);
    return this.diagramModel;
  }

  getFactoriesManager() {
    return this.factoriesManager;
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

  setup({ maxZoomIn, maxZoomOut }: { maxZoomIn: number; maxZoomOut: number }) {
    this.diagramModel.setMaxZoomIn(maxZoomIn);
    this.diagramModel.setMaxZoomOut(maxZoomOut);
  }

  initNodes(host) {
    this.diagramModel.selectNodes();

    this.diagramModel
      .selectNodes()
      .pipe(takeUntil(this.diagramModel.onEntityDestroy()))
      .subscribe((nodes) => {
        this.nodesRendered$.next(false);

        for (const node of nodes.values()) {
          if (!node.getPainted()) {
            this.diagramModel
              .getDiagramEngine()
              .getFactoriesManager()
              .getFactory({ factoryType: 'nodeFactories', modelType: node.getType() })
              .generateWidget({ model: node, host });
          }
        }

        this.nodesRendered$.next(true);
      });
  }

  initLinks(host) {
    this.links$ = this.diagramModel.selectLinks();

    combineLatest([this.nodesRendered$, this.links$])
      .pipe(filter(([nodesRendered]) => !!nodesRendered))
      .subscribe(([, links]) => {
        for (const link of links.values()) {
          if (!link.getPainted() && link.getSourcePort().getPainted()) {
            if (link.getSourcePort() !== null) {
              const portCenter = this.diagramModel.getDiagramEngine().getPortCenter(link.getSourcePort());
              link.getPoints()[0].setCoords(portCenter);

              const portCoords = this.diagramModel.getDiagramEngine().getPortCoords(link.getSourcePort());
              link.getSourcePort().updateCoords(portCoords);
            }

            if (link.getTargetPort() !== null) {
              const portCenter = this.diagramModel.getDiagramEngine().getPortCenter(link.getTargetPort());
              link.getPoints()[link.getPoints().length - 1].setCoords(portCenter);

              const portCoords = this.diagramModel.getDiagramEngine().getPortCoords(link.getTargetPort());
              link.getTargetPort().updateCoords(portCoords);
            }

            this.diagramModel
              .getDiagramEngine()
              .getFactoriesManager()
              .getFactory({ factoryType: 'linkFactories', modelType: link.getType() })
              .generateWidget({ model: link, host });
          }
        }
      });
  }

  /**
   * fire the action registered and notify subscribers
   */
  fireAction() {
    if (this.action$.value) {
      return this.action$.getValue();
    }
  }

  /**
   * Unregister the action, post firing and notify subscribers
   */
  stopFiringAction() {
    const stoppedAction = this.action$.getValue();
    this.action$.next(null);
    return stoppedAction;
  }

  /**
   * Register the new action, pre firing and notify subscribers
   */
  startFiringAction(action: BaseAction) {
    this.action$.next(action);
    return action;
  }

  selectAction() {
    return this.action$ as BehaviorSubject<BaseAction>;
  }

  setAction(action: BaseAction) {
    this.action$.next(action);
  }

  shouldDrawSelectionBox() {
    const action = this.action$.getValue();
    if (action instanceof SelectingAction) {
      action.getBoxDimensions();
      return true;
    }
    return false;
  }

  getMouseElement(event: MouseEvent): { model: BaseModel; element: Element } {
    const target = event.target as Element;

    // is it a port?
    let element = target.closest('[data-portid]');
    if (element) {
      // get the relevant node and return the port.
      const nodeEl = target.closest('[data-nodeid]');
      return {
        model: this.diagramModel
          .getNode(nodeEl.getAttribute('data-nodeid'))
          .getPort(element.getAttribute('data-portid')),
        element
      };
    }

    // look for a point
    element = target.closest('[data-pointid]');
    if (element) {
      return {
        model: this.diagramModel
          .getLink(element.getAttribute('data-linkid'))
          .getPointModel(element.getAttribute('data-pointid')),
        element
      };
    }

    // look for a link
    element = target.closest('[data-linkid]');
    if (element) {
      return {
        model: this.diagramModel.getLink(element.getAttribute('data-linkid')),
        element
      };
    }

    // a node maybe
    element = target.closest('[data-nodeid]');
    if (element) {
      return {
        model: this.diagramModel.getNode(element.getAttribute('data-nodeid')),
        element
      };
    }

    // just the canvas
    return null;
  }
}
