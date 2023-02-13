import * as firestore from 'firebase/firestore';

export interface Oracao {
  uid?: string;
  data: firestore.Timestamp;
  autor: string;
  descricao: string;
  telefone?: string;
  tipo: {
    name: string;
  };
  status: {
    name: string;
  };
}
