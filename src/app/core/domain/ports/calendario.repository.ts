import { Observable } from 'rxjs';
import { Calendario } from '../entities';

/**
 * Porta de repositório para consulta de eventos do calendário.
 */
export interface ICalendarioRepository {
  getAll(): Observable<Calendario[]>;
  getFromToday(): Observable<Calendario[]>;
}
