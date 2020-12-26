import { ChangeDetectionStrategy, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { DefaultNodeModel } from '@ngx-diagrams/core';
import { filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'ngdx-default-node',
  templateUrl: './default-node.component.html',
  styleUrls: ['./default-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultNodeComponent extends DefaultNodeModel {
  @ViewChild('portsLayer', { read: ViewContainerRef, static: true })
  portsLayer: ViewContainerRef;

  constructor() {
    super({ type: 'ngdx-default-node' });
    this.generatedChanges()
      .pipe(
        tap(console.log),
        filter((generatedE) => generatedE.isGenerated),
        switchMap(() => this.selectPorts())
      )
      .subscribe((ports) => {
        const factoriesManager = this.getParent().getDiagramEngine().getFactoriesManager();
        console.log(ports);
        for (const port of ports) {
          factoriesManager
            .getFactory({ factoryType: 'portFactories', modelType: port.getType() })
            .generateWidget({ model: port, host: this.portsLayer });
        }
        this.setPainted(true);
      });
  }
}
