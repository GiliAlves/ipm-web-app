import { Cantico } from "src/app/interfaces/cantico.interface";

export interface KeyWord {
  name: string;
  active: boolean
}

export interface CanticoStorage {
  searchFilter: KeyWord[],
  recents: Cantico[],
  favorites: Cantico[]
}

export type ArrayName = 'searchFilter' | 'recents' | 'favorites';
export type Key = 'name' | 'numero';
export type Position = 'top' | 'middle' | 'bottom'
