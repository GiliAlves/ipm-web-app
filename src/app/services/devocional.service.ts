import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, doc, docData, DocumentData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Devocional } from '../interfaces/devocional.interface';

@Injectable({
  providedIn: 'root'
})
export class DevocionalService {

  private docCollection!: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.docCollection = collection(this.firestore, 'devocionais');
  }

  getAll = () =>
    collectionData(this.docCollection, {idField: 'id'}) as Observable<Devocional[]>;

  get(id: string) {
    const documentReference = doc(this.firestore, `devocionais/${id}`);
    return docData(documentReference, { idField: 'id' });
  }
}
