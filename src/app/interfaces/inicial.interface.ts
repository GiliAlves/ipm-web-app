import { Hino } from '../../../../dashboard-ipm/src/app/interface/hino.interface';
import { Cantico } from './../../../../dashboard-ipm/src/app/interface/cantico.interface';
import { Membro } from "./membros.interface";
import { YouTube } from "./youTube.interface";

export interface InicialStorage {
  videosStorage: YouTube,
  pastores: Membro[],
  presbiteros: Membro[],
  diaconos: Membro[],
  hino: Hino,
  cantico: Cantico
}

export interface Biblia {
  livro: string,
  capitulos: Array<{ versiculos: string[] }>,
}

export type Cargo = 'Diácono' | 'Pastor' | 'Presbítero';
export type Cargos = 'diaconos' | 'pastores' | 'presbiteros'
