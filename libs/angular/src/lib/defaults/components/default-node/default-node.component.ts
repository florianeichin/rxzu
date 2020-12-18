import { ChangeDetectionStrategy, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { DefaultNodeModel } from '../../models/default-node.model';

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
  }
}
