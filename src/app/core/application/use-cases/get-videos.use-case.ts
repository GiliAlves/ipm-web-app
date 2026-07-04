import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { YOUTUBE_SERVICE_TOKEN } from '../tokens';
import { IYoutubeService } from '../../domain/ports';
import { Video } from '../../domain/entities';

/**
 * Caso de uso para obter os vídeos mais recentes do YouTube.
 */
@Injectable({ providedIn: 'root' })
export class GetVideosUseCase {
  constructor(
    @Inject(YOUTUBE_SERVICE_TOKEN) private readonly youtubeService: IYoutubeService,
  ) {}

  execute(): Observable<Video[]> {
    return this.youtubeService.getRecentVideos();
  }
}
