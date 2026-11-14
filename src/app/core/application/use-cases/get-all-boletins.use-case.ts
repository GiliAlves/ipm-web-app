import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Boletim } from '../../domain/entities';
import { IBoletimRepository } from '../../domain/ports/boletim.repository';
import { BOLETIM_REPOSITORY_TOKEN } from '../tokens';

/**
 * Caso de uso para listar todos os boletins.
 */
@Injectable({ providedIn: 'root' })
export class GetAllBoletinsUseCase {
  private readonly repository = inject<IBoletimRepository>(BOLETIM_REPOSITORY_TOKEN);

  execute(): Observable<Boletim[]> {
    return this.repository.getAll();
  }
}
