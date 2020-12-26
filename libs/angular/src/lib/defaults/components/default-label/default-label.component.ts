import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DefaultLabelModel } from '@ngx-diagrams/core';

@Component({
  selector: 'ngdx-default-label',
  templateUrl: './default-label.component.html',
  styleUrls: ['./default-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultLabelComponent extends DefaultLabelModel implements OnInit {
  constructor() {
    super('ngdx-default-label');
  }

  ngOnInit() {
    this.setPainted(true);
  }
}
