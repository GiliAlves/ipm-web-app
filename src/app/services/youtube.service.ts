import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { YouTube } from '../interfaces/youTube.interface';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  private url: string = 'https://www.googleapis.com/youtube/v3/search?part=id,snippet&channelId=';
  private chanelID: string = 'UCDJlBgBNKZ48f08_0T7I-4w';
  private googleToken: string = 'AIzaSyDE5ZZgwnqrb4fzpeLUgN5T_u9ASKPOiqc';
  private searchQuery: string = 'Igreja Presbiteriana de Mauá';
  private maxResults: string = '6';
  private urlComplete: string = `${this.url}${this.chanelID}&q=${this.searchQuery}&type=video&order=date&maxResults=${this.maxResults}&key=${this.googleToken}`;

  constructor(public httpClient: HttpClient) {  }

  public getVideosForChanel = (): Observable<YouTube> =>
    this.httpClient.get<YouTube>(this.urlComplete).pipe(map((res: YouTube) => res));
}
