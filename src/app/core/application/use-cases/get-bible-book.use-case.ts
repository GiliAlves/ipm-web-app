import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LIVRO_REPOSITORY_TOKEN } from '../tokens';
import { ILivroRepository } from '../../domain/ports';
import { Livro } from '../../domain/entities';
import { BibleBookDto } from '../dto';

/**
 * Caso de uso para obter um livro bíblico pelo número.
 */
@Injectable({ providedIn: 'root' })
export class GetBibleBookUseCase {
  constructor(
    @Inject(LIVRO_REPOSITORY_TOKEN) private readonly repository: ILivroRepository,
  ) {}

  execute({ bookNumber }: BibleBookDto): Observable<Livro | undefined> {
    return this.repository.getByBookNumber(bookNumber);
  }
}
