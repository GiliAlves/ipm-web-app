import { Cantico } from "./cantico.interface";
import { NovoCantico } from "./novo-cantico.interface";

export type ArrayName = 'searchFilter' | 'recents' | 'favorites';
export type Key = 'name' | 'numero';
export type Position = 'top' | 'middle' | 'bottom'

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

export interface HStorage {
  searchFilter: KeyWord[],
  recents: NovoCantico[],
  favorites: NovoCantico[],
  formatacao: Formatacao,
}

export interface CStorage {
  searchFilter: KeyWord[],
  recents: Cantico[],
  favorites: Cantico[],
  formatacao: Formatacao,
}
