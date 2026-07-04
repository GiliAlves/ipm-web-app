import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Video } from '../../core/domain/entities';
import { IVideoRepository } from '../../core/domain/ports';
import { YoutubeService } from '../../services/youtube.service';
import { map } from 'rxjs/operators';

/**
 * Adapter que expõe vídeos do YouTube como repositório de domínio.
 */
@Injectable({ providedIn: 'root' })
export class YoutubeVideoRepository implements IVideoRepository {
  constructor(private readonly youtubeService: YoutubeService) {}

  getRecent(): Observable<Video[]> {
    return this.youtubeService.getVideosForChanel().pipe(
      map(response => response.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        liveBroadcastContent: item.snippet.liveBroadcastContent,
      })))
    );
  }
}
