export interface NovoCantico {
  uid?: string;
  indice?: number;
  titulo: string;
  numero: string;
  letra: string;
  dtUpdate?: number;
  tituloLowercase?: string;
  autor?: string;
  video?: string;
  tematica?: string;
  assunto?: string;
  partitura?: string;
  audios?: Audio[];
  favorito?: boolean;
}

export interface Audio {
  voz?: string;
  path?: string;
}

export interface KeyWord {
  name: string;
  active: boolean
}

export interface Font {
  title: string;
  value: string;
}

export interface Formatacao {
  fonte: string;
  style: boolean;
  weight: boolean;
  corFonte: string;
  tamanhoFonte: number;
  backgrond: boolean;
}

export interface HinoStorage {
  searchFilter: KeyWord[],
  recents: NovoCantico[],
  favorites: NovoCantico[],
  formatacao: Formatacao,
}

export interface Tematica {
  title: string;
  quantity: number;
  img: string;
  range: string;
  assunto: Assunto[]
}

export interface Assunto {
  title: string;
  quantity: number;
  range: string;
}

export type ArrayName = 'searchFilter' | 'recents' | 'favorites';
export type Key = 'name' | 'numero';
export type Position = 'top' | 'middle' | 'bottom'
