import { ViewContainerRef, ComponentRef } from '@angular/core';
import { NodeModel, AbstractFactory } from '@ngx-diagrams/core';

export abstract class AbstractNodeFactory<T extends NodeModel = NodeModel> extends AbstractFactory<T> {
  abstract generateWidget(node: NodeModel, nodeHost: ViewContainerRef): ComponentRef<T>;
}
