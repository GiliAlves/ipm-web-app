/**
 * Entidade de domínio que representa um evento do calendário.
 */
export interface Calendario {
  uid?: string;
  dataInicio?: Date;
  dataFim?: Date;
  titulo?: string;
  descricao?: string;
  local?: string;
  endereco?: string;
  cor?: string;
  mes?: number;
  ano?: number;
  day?: string;
}
