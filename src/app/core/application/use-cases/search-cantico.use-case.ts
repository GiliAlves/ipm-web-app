import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CANTICO_REPOSITORY_TOKEN } from '../tokens';
import { ICanticoRepository } from '../../domain/ports';
import { Cantico } from '../../domain/entities';
import { SearchDto } from '../dto';

/**
 * Caso de uso para busca de cânticos por texto ou número.
 */
@Injectable({ providedIn: 'root' })
export class SearchCanticoUseCase {
  constructor(
    @Inject(CANTICO_REPOSITORY_TOKEN) private readonly repository: ICanticoRepository,
  ) {}

  execute({ term }: SearchDto): Observable<Cantico[]> {
    return this.repository.search(term);
  }
}
