import { Observable } from 'rxjs';
import { Video } from '../entities';

/**
 * Porta de serviço externo para busca de vídeos no YouTube.
 */
export interface IYoutubeService {
  getRecentVideos(): Observable<Video[]>;
}
