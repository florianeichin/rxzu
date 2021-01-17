import { DefaultNodeModel } from '@rxzu/core';
import { DefaultNodeWidget } from '../widgets';
import { AbstractReactFactory } from './ReactFactory';

export class DefaultNodeFactory extends AbstractReactFactory<DefaultNodeModel> {
  constructor() {
    super('default');
  }

  generateWidget({ model }: { model: DefaultNodeModel }): JSX.Element {
    return DefaultNodeWidget(model);
  }
}
