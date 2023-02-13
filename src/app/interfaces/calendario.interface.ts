import * as firestore from 'firebase/firestore';

export interface Calendario {
  uid?: string;
  dataInicio?: firestore.Timestamp;
  dataFim?: firestore.Timestamp;
  titulo?: string;
  descricao?: string;
  local?: string;
  endereco?: string;
  cor?: string;
  mes?: number;
  ano?: number;
}
