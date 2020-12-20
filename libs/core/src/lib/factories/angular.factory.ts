import { ComponentRef, ViewContainerRef } from '@angular/core';
import { AbstractFactory } from './base.factory';
import { BaseModel } from '../models';

export abstract class AbstractAngularFactory<
  T extends BaseModel = BaseModel,
  R = ViewContainerRef,
  Y = ComponentRef<T>
> extends AbstractFactory<T, R, Y> {
  abstract generateWidget({ model, host }: { model: T; host: R }): Y;
}
