import { DefaultLinkModel } from '@rxzu/core';
import { DefaultLinkWidget } from '../widgets';
import { AbstractReactFactory } from './ReactFactory';

export class DefaultLinkFactory extends AbstractReactFactory<DefaultLinkModel> {
  constructor() {
    super('default');
  }

  generateWidget({ model }: { model: DefaultLinkModel }): JSX.Element {
    return DefaultLinkWidget(model);
  }
}
