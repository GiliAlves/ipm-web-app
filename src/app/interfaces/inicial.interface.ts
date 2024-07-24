import { Cantico } from './cantico.interface';
import { Membro } from "./membro.interface";
import { NovoCantico } from './novo-cantico.interface';
import { YouTube } from "./youTube.interface";

export interface InicialStorage {
  videosStorage: YouTube,
  pastores: Membro[],
  presbiteros: Membro[],
  diaconos: Membro[],
  hino: NovoCantico,
  cantico: Cantico
}

export interface Biblia {
  livro: string,
  capitulos: Array<{ versiculos: string[] }>,
}

export type Cargo = 'Diácono' | 'Pastor' | 'Presbítero';
export type Cargos = 'diaconos' | 'pastores' | 'presbiteros'
