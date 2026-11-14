import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NovoCantico } from '../../domain/entities';
import { INovoCanticoRepository } from '../../domain/ports/novo-cantico.repository';
import { NOVO_CANTICO_REPOSITORY_TOKEN } from '../tokens';

/**
 * Caso de uso para listar todos os hinos novos.
 */
@Injectable({ providedIn: 'root' })
export class GetAllNovoCanticoUseCase {
  private readonly repository = inject<INovoCanticoRepository>(NOVO_CANTICO_REPOSITORY_TOKEN);

  execute(): Observable<NovoCantico[]> {
    return this.repository.getAll();
  }
}
