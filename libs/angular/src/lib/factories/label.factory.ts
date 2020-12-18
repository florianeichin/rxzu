import { ViewContainerRef, ComponentRef } from '@angular/core';
import { LabelModel, AbstractFactory } from '@ngx-diagrams/core';

export abstract class AbstractLabelFactory<T extends LabelModel = LabelModel> extends AbstractFactory<T> {
  abstract generateWidget(label: LabelModel, labelsHost: ViewContainerRef): ComponentRef<T>;
}
