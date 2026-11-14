import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { YouTube } from '../interfaces/youTube.interface';

@Injectable({
  providedIn: 'root'
})
/**
 * Serviço de integração com o YouTube Data API v3.
 *
 * Recupera os vídeos mais recentes do canal da Igreja Presbiteriana de Mauá.
 *
 * ⚠️ A chave de API está hard-coded. Em produção, armazene-a em variáveis
 * de ambiente ou em um serviço de secrets.
 */
export class YoutubeService {

  /** URL base da API de busca do YouTube. */
  private url = 'https://www.googleapis.com/youtube/v3/search?part=id,snippet&channelId=';
  /** ID do canal do YouTube da IPM. */
  private chanelID = 'UCDJlBgBNKZ48f08_0T7I-4w';
  /** Chave de API do Google (deve ser protegida em produção). */
  private googleToken = 'AIzaSyDE5ZZgwnqrb4fzpeLUgN5T_u9ASKPOiqc';
  /** Termo de busca aplicado aos vídeos do canal. */
  private searchQuery = 'Igreja Presbiteriana de Mauá';
  /** Quantidade máxima de vídeos retornados. */
  private maxResults = '6';
  /** URL completa da requisição, montada a partir dos parâmetros acima. */
  private urlComplete = `${this.url}${this.chanelID}&q=${this.searchQuery}&type=video&order=date&maxResults=${this.maxResults}&key=${this.googleToken}`;

  constructor(public httpClient: HttpClient) {  }

  /**
   * Busca os vídeos mais recentes do canal configurado.
   * @returns Observable com a resposta tipada do YouTube.
   */
  public getVideosForChanel = (): Observable<YouTube> =>
    this.httpClient.get<YouTube>(this.urlComplete).pipe(map((res: YouTube) => res));
}
