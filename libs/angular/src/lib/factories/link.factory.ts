import { ViewContainerRef, ComponentRef } from '@angular/core';
import { LinkModel, AbstractFactory } from '@ngx-diagrams/core';

export abstract class AbstractLinkFactory<T extends LinkModel = LinkModel> extends AbstractFactory<T> {
  abstract generateWidget(link: LinkModel, linksHost: ViewContainerRef): ComponentRef<T>;
}
