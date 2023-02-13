import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Sobre } from '../interfaces/sobre.interface';

@Injectable({
  providedIn: 'root'
})
export class SobreService {

  private docCollection!: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.docCollection = collection(this.firestore, 'parametrizacao');
  }

  getAll = () =>
    collectionData(this.docCollection, {idField: 'id'}) as Observable<Sobre[]>;

  get(id: string) {
    const documentReference = doc(this.firestore, `parametrizacao/${id}`);
    return docData(documentReference, { idField: 'id' });
  }
}
