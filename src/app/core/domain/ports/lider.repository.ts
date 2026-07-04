import { Observable } from 'rxjs';
import { Lider } from '../entities';

/**
 * Porta de repositório para consulta de líderes.
 */
export interface ILiderRepository {
  getByCargo(cargo: string): Observable<Lider[]>;
}
