import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DiagramEngine } from '@rxzu/angular';
import { DiagramModel, DefaultNodeModel, BaseAction } from '@rxzu/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `<ngdx-diagram
    class="demo-diagram"
    [model]="diagramModel"
  ></ngdx-diagram>`,
  styleUrls: ['../demo-diagram.component.scss'],
})
export class EventsExampleStoryComponent implements OnInit {
  diagramModel: DiagramModel;

  @Output() events: EventEmitter<BaseAction> = new EventEmitter();

  constructor(private diagramEngine: DiagramEngine) {}

  ngOnInit() {
    const nodesDefaultDimensions = { height: 200, width: 200 };
    this.diagramEngine.registerDefaultFactories();

    this.diagramModel = this.diagramEngine.createModel();

    const node1 = new DefaultNodeModel();
    node1.setCoords({ x: 500, y: 300 });
    node1.setDimensions(nodesDefaultDimensions);
    const outport1 = node1.addOutPort({ name: 'outport1' });

    const node2 = new DefaultNodeModel();
    node2.setCoords({ x: 1000, y: 0 });
    node2.setDimensions(nodesDefaultDimensions);
    const inport = node2.addInPort({ name: 'inport2' });

    for (let index = 0; index < 2; index++) {
      const nodeLoop = new DefaultNodeModel();
      nodeLoop.setCoords({ x: 1000, y: 300 + index * 300 });
      nodeLoop.setDimensions(nodesDefaultDimensions);
      nodeLoop.addInPort({ name: `inport${index + 3}` });

      this.diagramModel.addNode(nodeLoop);
    }

    const link = outport1.link(inport);
    link.setLocked();

    this.diagramModel.addAll(node1, node2, link);

    this.diagramModel.getDiagramEngine().zoomToFit();

    this.subscribeToDiagramEvents();
  }

  subscribeToDiagramEvents() {
    this.diagramEngine
      .selectAction()
      .pipe(filter(Boolean))
      .subscribe((e: BaseAction) => this.events.emit(e));
  }
}
