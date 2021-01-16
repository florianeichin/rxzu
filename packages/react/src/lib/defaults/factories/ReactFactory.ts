import { BaseModel, AbstractFactory, DiagramModel } from '@rxzu/core';

export abstract class AbstractReactFactory<
  T extends BaseModel = BaseModel
> extends AbstractFactory<T, null, JSX.Element> {
  abstract generateWidget({
    model,
    diagramModel,
  }: {
    model: T;
    diagramModel?: DiagramModel;
  }): JSX.Element;
}
