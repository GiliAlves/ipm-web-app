import { InjectionToken } from '@angular/core';
import {
  IBoletimRepository,
  ICalendarioRepository,
  ICanticoRepository,
  IDevocionalRepository,
  ILiderRepository,
  ILivroRepository,
  INovoCanticoRepository,
  IPastoralRepository,
  IStorageService,
  IVideoRepository,
  IYoutubeService,
} from '../../domain/ports';

export const CANTICO_REPOSITORY_TOKEN = new InjectionToken<ICanticoRepository>('CanticoRepository');
export const NOVO_CANTICO_REPOSITORY_TOKEN = new InjectionToken<INovoCanticoRepository>('NovoCanticoRepository');
export const BOLETIM_REPOSITORY_TOKEN = new InjectionToken<IBoletimRepository>('BoletimRepository');
export const PASTORAL_REPOSITORY_TOKEN = new InjectionToken<IPastoralRepository>('PastoralRepository');
export const DEVOCIONAL_REPOSITORY_TOKEN = new InjectionToken<IDevocionalRepository>('DevocionalRepository');
export const CALENDARIO_REPOSITORY_TOKEN = new InjectionToken<ICalendarioRepository>('CalendarioRepository');
export const LIDER_REPOSITORY_TOKEN = new InjectionToken<ILiderRepository>('LiderRepository');
export const LIVRO_REPOSITORY_TOKEN = new InjectionToken<ILivroRepository>('LivroRepository');
export const VIDEO_REPOSITORY_TOKEN = new InjectionToken<IVideoRepository>('VideoRepository');
export const STORAGE_SERVICE_TOKEN = new InjectionToken<IStorageService>('StorageService');
export const YOUTUBE_SERVICE_TOKEN = new InjectionToken<IYoutubeService>('YoutubeService');
