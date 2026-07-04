import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NOVO_CANTICO_REPOSITORY_TOKEN } from '../tokens';
import { INovoCanticoRepository } from '../../domain/ports';
import { NovoCantico } from '../../domain/entities';
import { SearchDto } from '../dto';

/**
 * Caso de uso para busca de hinos por texto ou número.
 */
@Injectable({ providedIn: 'root' })
export class SearchNovoCanticoUseCase {
  constructor(
    @Inject(NOVO_CANTICO_REPOSITORY_TOKEN) private readonly repository: INovoCanticoRepository,
  ) {}

  execute({ term }: SearchDto): Observable<NovoCantico[]> {
    return this.repository.search(term);
  }
}
