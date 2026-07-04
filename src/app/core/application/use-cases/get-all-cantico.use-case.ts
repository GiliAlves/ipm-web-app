import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cantico } from '../../domain/entities';
import { ICanticoRepository } from '../../domain/ports/cantico.repository';
import { CANTICO_REPOSITORY_TOKEN } from '../tokens';

/**
 * Caso de uso para listar todos os cânticos.
 */
@Injectable({ providedIn: 'root' })
export class GetAllCanticoUseCase {
  private readonly repository = inject<ICanticoRepository>(CANTICO_REPOSITORY_TOKEN);

  execute(): Observable<Cantico[]> {
    return this.repository.getAll();
  }
}
