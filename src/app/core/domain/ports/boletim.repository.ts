import { Observable } from 'rxjs';
import { Boletim } from '../entities';

/**
 * Porta de repositório para consulta de boletins.
 */
export interface IBoletimRepository {
  getAll(): Observable<Boletim[]>;
  getById(id: string): Observable<Boletim | undefined>;
}
