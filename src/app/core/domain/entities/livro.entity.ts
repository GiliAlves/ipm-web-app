/**
 * Entidade de domínio que representa um livro bíblico.
 */
export interface Livro {
  id?: string;
  bookNumber: number;
  name: string;
  testament: string;
  group: string;
  shortName: string;
  longName: string;
  bookColor: string;
  resume: string;
  chapters: number;
}
