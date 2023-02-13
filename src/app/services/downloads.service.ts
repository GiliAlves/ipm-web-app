import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, doc, docData, DocumentData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Download } from '../interfaces/download.interface';

@Injectable({
  providedIn: 'root'
})
export class DownloadsService {

  private docCollection!: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.docCollection = collection(this.firestore, 'downloads');
  }

  getAll = () =>
    collectionData(this.docCollection, {idField: 'id'}) as Observable<Download[]>;

  get(id: string) {
    const documentReference = doc(this.firestore, `downloads/${id}`);
    return docData(documentReference, { idField: 'id' });
  }
}
