import { Observable } from 'rxjs';
import { Cantico } from '../entities';

/**
 * Porta de repositório para consulta e persistência de cânticos.
 */
export interface ICanticoRepository {
  getAll(): Observable<Cantico[]>;
  getById(id: string): Observable<Cantico | undefined>;
  search(term: string): Observable<Cantico[]>;
}
