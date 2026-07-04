import { Provider } from '@angular/core';
import {
  BOLETIM_REPOSITORY_TOKEN,
  CALENDARIO_REPOSITORY_TOKEN,
  CANTICO_REPOSITORY_TOKEN,
  DEVOCIONAL_REPOSITORY_TOKEN,
  LIDER_REPOSITORY_TOKEN,
  LIVRO_REPOSITORY_TOKEN,
  NOVO_CANTICO_REPOSITORY_TOKEN,
  PASTORAL_REPOSITORY_TOKEN,
  STORAGE_SERVICE_TOKEN,
  VIDEO_REPOSITORY_TOKEN,
  YOUTUBE_SERVICE_TOKEN,
} from '../../core/application/tokens';
import {
  FirebaseBoletimRepository,
  FirebaseCalendarioRepository,
  FirebaseCanticoRepository,
  FirebaseDevocionalRepository,
  FirebaseLiderRepository,
  FirebaseLivroRepository,
  FirebaseNovoCanticoRepository,
  FirebasePastoralRepository,
  YoutubeVideoRepository,
} from '../repositories';
import { IonicStorageAdapter, YoutubeAdapter } from '../external';

export const repositoryProviders: Provider[] = [
  { provide: CANTICO_REPOSITORY_TOKEN, useExisting: FirebaseCanticoRepository },
  { provide: NOVO_CANTICO_REPOSITORY_TOKEN, useExisting: FirebaseNovoCanticoRepository },
  { provide: BOLETIM_REPOSITORY_TOKEN, useExisting: FirebaseBoletimRepository },
  { provide: PASTORAL_REPOSITORY_TOKEN, useExisting: FirebasePastoralRepository },
  { provide: DEVOCIONAL_REPOSITORY_TOKEN, useExisting: FirebaseDevocionalRepository },
  { provide: CALENDARIO_REPOSITORY_TOKEN, useExisting: FirebaseCalendarioRepository },
  { provide: LIDER_REPOSITORY_TOKEN, useExisting: FirebaseLiderRepository },
  { provide: LIVRO_REPOSITORY_TOKEN, useExisting: FirebaseLivroRepository },
  { provide: VIDEO_REPOSITORY_TOKEN, useExisting: YoutubeVideoRepository },
  { provide: STORAGE_SERVICE_TOKEN, useExisting: IonicStorageAdapter },
  { provide: YOUTUBE_SERVICE_TOKEN, useExisting: YoutubeAdapter },
];
