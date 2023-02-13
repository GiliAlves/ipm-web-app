import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, doc, docData, DocumentData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Calendario } from '../interfaces/calendario.interface';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  private docCollection!: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.docCollection = collection(this.firestore, 'eventos');
  }

  getAll = () =>
    collectionData(this.docCollection, {idField: 'id'}) as Observable<Calendario[]>;

  get(id: string) {
    const documentReference = doc(this.firestore, `eventos/${id}`);
    return docData(documentReference, { idField: 'id' });
  }
}
