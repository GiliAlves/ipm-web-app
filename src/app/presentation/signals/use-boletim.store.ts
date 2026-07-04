import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GetAllBoletinsUseCase } from '../../core/application/use-cases';

/**
 * Store signal-based para a lista de boletins.
 */
@Injectable({ providedIn: 'root' })
export class UseBoletimStore {
  private readonly boletins$ = this.getAllBoletinsUseCase.execute();

  readonly boletins = toSignal(this.boletins$, { initialValue: [] });

  constructor(private readonly getAllBoletinsUseCase: GetAllBoletinsUseCase) {}
}
