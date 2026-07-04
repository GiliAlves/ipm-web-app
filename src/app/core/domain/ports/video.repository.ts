import { Observable } from 'rxjs';
import { Video } from '../entities';

/**
 * Porta de repositório para consulta de vídeos.
 */
export interface IVideoRepository {
  getRecent(): Observable<Video[]>;
}
