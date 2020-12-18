import { ViewContainerRef, ComponentRef } from '@angular/core';
import { PortModel, AbstractFactory } from '@ngx-diagrams/core';

export abstract class AbstractPortFactory<T extends PortModel = PortModel> extends AbstractFactory<T> {
  abstract generateWidget(port: PortModel, portHost: ViewContainerRef): ComponentRef<T>;
}
