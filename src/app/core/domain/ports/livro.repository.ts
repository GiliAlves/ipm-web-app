import { Observable } from 'rxjs';
import { Livro } from '../entities';

/**
 * Porta de repositório para consulta de livros bíblicos.
 */
export interface ILivroRepository {
  getAll(): Observable<Livro[]>;
  getByBookNumber(bookNumber: number): Observable<Livro | undefined>;
}
