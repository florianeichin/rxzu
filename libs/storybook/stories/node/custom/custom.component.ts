import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DefaultNodeModel } from '@ngx-diagrams/core';

@Component({
  selector: 'custom-node',
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CustomNodeComponent extends DefaultNodeModel implements OnInit {
  nodeContent = 'Pick me!';

  constructor() {
    super({ type: 'custom-node' });
  }

  ngOnInit() {
    this.selectSelected().subscribe((selected) => {
      this.nodeContent = selected ? 'Thank you 🙏' : 'Pick me!';
    });
  }
}
