import { Observable } from 'rxjs';
import { NovoCantico } from '../entities';

/**
 * Porta de repositório para consulta e persistência de hinos.
 */
export interface INovoCanticoRepository {
  getAll(): Observable<NovoCantico[]>;
  getById(id: string): Observable<NovoCantico | undefined>;
  search(term: string): Observable<NovoCantico[]>;
}
