import * as firestore from 'firebase/firestore';

export interface Download {
  uid?: string;
  dtUpload?: firestore.Timestamp;
  extensao?: string;
  path: string;
  storage: string;
  tipo: string;
  titulo: string;
  extensaoImg?: string;
}
