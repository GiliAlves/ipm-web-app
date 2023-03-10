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
