import { Timestamp } from 'firebase/firestore';

export interface Calendario {
  uid?: string;
  dataInicio?: Timestamp;
  dataFim?: Timestamp;
  titulo?: string;
  descricao?: string;
  local?: string;
  endereco?: string;
  cor?: string;
  mes?: number;
  ano?: number;
  day?: string;
}
