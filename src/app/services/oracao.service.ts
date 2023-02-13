import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Oracao } from '../interfaces/oracao.interface';

@Injectable({
  providedIn: 'root'
})
export class OracaoService {

  private docCollection!: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.docCollection = collection(this.firestore, 'pedidos');
  }

  getAll = () =>
    collectionData(this.docCollection, {idField: 'id'}) as Observable<Oracao[]>;

  get(id: string) {
    const documentReference = doc(this.firestore, `pedidos/${id}`);
    return docData(documentReference, { idField: 'id' });
  }
}
