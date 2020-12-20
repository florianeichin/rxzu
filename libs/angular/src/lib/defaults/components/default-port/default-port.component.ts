import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DefaultPortModel } from '@ngx-diagrams/core';

@Component({
  selector: 'ngdx-default-port',
  templateUrl: './default-port.component.html',
  styleUrls: ['./default-port.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultPortComponent extends DefaultPortModel {
  constructor() {
    super({ type: 'ngdx-default-port' });
  }
}
