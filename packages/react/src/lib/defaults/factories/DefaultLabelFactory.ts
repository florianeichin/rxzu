import { DefaultLabelModel } from '@rxzu/core';
import { DefaultLabelWidget } from '../widgets';
import { AbstractReactFactory } from './ReactFactory';

export class DefaultLabelFactory extends AbstractReactFactory<
  DefaultLabelModel
> {
  constructor() {
    super('default');
  }

  generateWidget({ model }: { model: DefaultLabelModel }): JSX.Element {
    return DefaultLabelWidget(model);
  }
}
