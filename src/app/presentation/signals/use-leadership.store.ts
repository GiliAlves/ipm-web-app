import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { GetLeadershipUseCase } from '../../core/application/use-cases';
import { Lider } from '../../core/domain/entities';

interface LeadershipState {
  pastores: Lider[];
  presbiteros: Lider[];
  diaconos: Lider[];
}

/**
 * Store signal-based para a página de liderança.
 */
@Injectable({ providedIn: 'root' })
export class UseLeadershipStore {
  private readonly leadership$ = forkJoin({
    pastores: this.getLeadershipUseCase.execute({ cargo: 'Pastor' }),
    presbiteros: this.getLeadershipUseCase.execute({ cargo: 'Presbítero' }),
    diaconos: this.getLeadershipUseCase.execute({ cargo: 'Diácono' }),
  });

  readonly leadership = toSignal(this.leadership$, { initialValue: { pastores: [], presbiteros: [], diaconos: [] } as LeadershipState });

  constructor(private readonly getLeadershipUseCase: GetLeadershipUseCase) {}
}
