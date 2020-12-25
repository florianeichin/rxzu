import { Component } from '@angular/core';
import { DefaultPortModel } from '@ngx-diagrams/core';

@Component({
  selector: 'custom-port',
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.scss']
})
export class CustomPortComponent extends DefaultPortModel {
  constructor() {
    super();
  }
}
