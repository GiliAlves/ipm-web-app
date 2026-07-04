import { Injectable, Inject } from '@angular/core';
import { Observable, catchError, forkJoin, of } from 'rxjs';
import { HomeDataDto } from '../dto';
import {
  CALENDARIO_REPOSITORY_TOKEN,
  DEVOCIONAL_REPOSITORY_TOKEN,
  PASTORAL_REPOSITORY_TOKEN,
  YOUTUBE_SERVICE_TOKEN,
} from '../tokens';
import { ICalendarioRepository, IDevocionalRepository, IPastoralRepository, IYoutubeService } from '../../domain/ports';

/**
 * Caso de uso que consolida os dados da página inicial.
 */
@Injectable({ providedIn: 'root' })
export class GetHomeDataUseCase {
  constructor(
    @Inject(PASTORAL_REPOSITORY_TOKEN) private readonly pastoralRepository: IPastoralRepository,
    @Inject(DEVOCIONAL_REPOSITORY_TOKEN) private readonly devocionalRepository: IDevocionalRepository,
    @Inject(CALENDARIO_REPOSITORY_TOKEN) private readonly calendarioRepository: ICalendarioRepository,
    @Inject(YOUTUBE_SERVICE_TOKEN) private readonly youtubeService: IYoutubeService,
  ) {}

  execute(): Observable<HomeDataDto> {
    return forkJoin({
      pastorais: this.pastoralRepository.getLimit(6).pipe(catchError(() => of([]))),
      devocionais: this.devocionalRepository.getLimit(6).pipe(catchError(() => of([]))),
      calendario: this.calendarioRepository.getFromToday().pipe(catchError(() => of([]))),
      videos: this.youtubeService.getRecentVideos().pipe(catchError(() => of([]))),
    });
  }
}
