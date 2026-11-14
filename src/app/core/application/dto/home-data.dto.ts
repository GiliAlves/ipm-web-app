import { Calendario, Devocional, Pastoral, Video } from '../../domain/entities';

export interface HomeDataDto {
  pastorais: Pastoral[];
  devocionais: Devocional[];
  calendario: Calendario[];
  videos: Video[];
}
