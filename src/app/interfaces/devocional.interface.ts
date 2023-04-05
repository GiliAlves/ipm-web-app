export interface Devocional {
  uid?: string;
  autor: string;
  data: string;
  titulo: string;
  destaque: string;
  descricao: string;
  imgURL?: string;
  pathURL?: string;
  publicado?: boolean;
}

export type Position = 'top' | 'middle' | 'bottom'
