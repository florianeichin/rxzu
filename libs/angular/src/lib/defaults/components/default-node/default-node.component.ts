import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DefaultNodeModel } from '@ngx-diagrams/core';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'ngdx-default-node',
  templateUrl: './default-node.component.html',
  styleUrls: ['./default-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultNodeComponent extends DefaultNodeModel implements OnInit {
  @ViewChild('portsLayer', { read: ViewContainerRef, static: true })
  portsLayer: ViewContainerRef;

  constructor() {
    super({ type: 'ngdx-default-node' });
  }

  ngOnInit() {
    const factoriesManager = this.getParent().getDiagramEngine().getFactoriesManager();
    this.paintChanges()
      .pipe(
        filter((paintedE) => paintedE.isPainted),
        switchMap(() => this.selectPorts())
      )
      .subscribe((ports) => {
        for (const port of ports) {
          factoriesManager
            .getFactory({ factoryType: 'portFactories', modelType: port.getType() })
            .generateWidget({ model: port, host: this.portsLayer });
        }
      });
  }
}
