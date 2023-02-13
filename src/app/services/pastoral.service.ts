import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Pastoral } from '../interfaces/pastoral.interface';

@Injectable({
  providedIn: 'root'
})
export class PastoralService {

  private path = 'pastorais';
  private fieldPath = 'data';

  constructor(private readonly firestore: Firestore) { }

  getAll = () =>
    collectionData(query(collection(this.firestore, this.path), orderBy(this.fieldPath, 'desc')), { idField: 'id' }) as Observable<Pastoral[]>;

  get = (id: string) =>
    docData(doc(this.firestore, `${this.path}/${id}`), { idField: 'id' });
}
