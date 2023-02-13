import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, doc, docData, DocumentData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NovoCantico } from '../interfaces/novo-cantico.interface';

@Injectable({
  providedIn: 'root'
})
export class NovoCanticoService {

  private path = 'hinos';
  private fieldPath = 'indice';

  constructor(private readonly firestore: Firestore) { }

  getAll = () =>
    collectionData(query(collection(this.firestore, this.path), orderBy(this.fieldPath, 'asc')), { idField: 'id' }) as Observable<NovoCantico[]>;

  get = (id: string) =>
    docData(doc(this.firestore, `${this.path}/${id}`), { idField: 'id' });
}
