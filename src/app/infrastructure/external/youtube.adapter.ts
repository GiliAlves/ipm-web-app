import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IYoutubeService } from '../../core/domain/ports';
import { Video } from '../../core/domain/entities';
import { YoutubeService } from '../../services/youtube.service';

/**
 * Adapter do YouTube Data API para a port IYoutubeService.
 */
@Injectable({ providedIn: 'root' })
export class YoutubeAdapter implements IYoutubeService {
  constructor(private readonly youtubeService: YoutubeService) {}

  getRecentVideos(): Observable<Video[]> {
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
