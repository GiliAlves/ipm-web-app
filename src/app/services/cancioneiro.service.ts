import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Cantico } from '../interfaces/cantico.interface';

@Injectable({
  providedIn: 'root'
})
export class CancioneiroService {

  private path = 'canticos';
  private fieldPath = 'id';

  constructor(private readonly firestore: Firestore) { }

  getAll = () =>
    collectionData(query(collection(this.firestore, this.path), orderBy(this.fieldPath, 'asc')), { idField: 'id' }) as Observable<Cantico[]>;

  get = (id: string) =>
    docData(doc(this.firestore, `${this.path}/${id}`), { idField: 'id' });
}
