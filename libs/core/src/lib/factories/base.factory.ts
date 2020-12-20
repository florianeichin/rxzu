import { BaseModel } from '../models';

export abstract class AbstractFactory<T extends BaseModel, R, Y> {
  protected _type: string;

  constructor(type: string) {
    this._type = type;
  }

  get type(): string {
    return this._type;
  }

  abstract generateWidget({ model, host }: { model: T; host?: R }): Y;
}
