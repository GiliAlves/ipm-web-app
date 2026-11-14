import { Observable } from 'rxjs';
import { Pastoral } from '../entities';

/**
 * Porta de repositório para consulta de mensagens pastorais.
 */
export interface IPastoralRepository {
  getAll(): Observable<Pastoral[]>;
  getLimit(limit: number): Observable<Pastoral[]>;
}
