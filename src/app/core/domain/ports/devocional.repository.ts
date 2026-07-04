import { Observable } from 'rxjs';
import { Devocional } from '../entities';

/**
 * Porta de repositório para consulta de devocionais.
 */
export interface IDevocionalRepository {
  getAll(): Observable<Devocional[]>;
  getLimit(limit: number): Observable<Devocional[]>;
}
