/**
 * Entidade de domínio que representa uma edição do boletim informativo.
 */
export interface Boletim {
  id: string;
  data: Date;
  mes: string;
  ano: string;
  numeroEdicao: string;
  anoEdicao: string;
  pastoral: BoletimPastoral;
  liturgia: Liturgia;
}

export interface BoletimPastoral {
  imgPastoral: string;
  titulo: string;
  autor: string;
  destaque: string;
  descricao: string;
}

export interface Liturgia {
  titulo: string;
  subtitulo: string;
  descricao: string;
}
