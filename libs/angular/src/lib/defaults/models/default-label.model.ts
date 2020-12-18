import { LabelModel, createValueState } from '@ngx-diagrams/core';
import { Observable } from 'rxjs';

export class DefaultLabelModel extends LabelModel {
  protected label$ = createValueState<string>('', this.entityPipe('label'));

  constructor(label = 'NO LABEL', type = 'default', id?: string, logPrefix = '[DefaultLabel]') {
    super(type, id, logPrefix);
    this.setLabel(label);
  }

  setLabel(label: string) {
    this.label$.set(label).emit();
  }

  getLabel(): string {
    return this.label$.value;
  }

  selectLabel(): Observable<string> {
    return this.label$.value$;
  }
}
