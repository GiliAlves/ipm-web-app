import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LIDER_REPOSITORY_TOKEN } from '../tokens';
import { ILiderRepository } from '../../domain/ports';
import { Lider } from '../../domain/entities';
import { LeadershipDto } from '../dto';

/**
 * Caso de uso para obter líderes por cargo.
 */
@Injectable({ providedIn: 'root' })
export class GetLeadershipUseCase {
  constructor(
    @Inject(LIDER_REPOSITORY_TOKEN) private readonly repository: ILiderRepository,
  ) {}

  execute({ cargo }: LeadershipDto): Observable<Lider[]> {
    return this.repository.getByCargo(cargo);
  }
}
