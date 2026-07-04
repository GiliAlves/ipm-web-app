/**
 * Entidade de domínio que representa um cântico do hinário (Cancioneiro).
 */
export interface Cantico {
  uid?: string;
  id?: number;
  dtUpdate?: number;
  titulo: string;
  numero: string;
  letra: string;
  tituloLowercase?: string;
  numeroAntigo?: string;
  favorito?: boolean;
}
