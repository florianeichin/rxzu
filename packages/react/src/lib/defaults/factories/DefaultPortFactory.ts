import { DefaultPortModel } from '@rxzu/core';
import { DefaultPortWidget } from '../widgets';
import { AbstractReactFactory } from './ReactFactory';

export class DefaultPortFactory extends AbstractReactFactory<DefaultPortModel> {
  constructor() {
    super('default');
  }

  generateWidget({ model }: { model: DefaultPortModel }): JSX.Element {
    return DefaultPortWidget(model);
  }
}
