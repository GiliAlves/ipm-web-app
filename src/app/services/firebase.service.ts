import { Injectable } from '@angular/core';
import {
  FieldPath,
  Firestore,
  OrderByDirection,
  WhereFilterOp,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  limit,
  orderBy,
  query,
  where
} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  public fieldPath!: string;
  public orderByDirection!: OrderByDirection;
  public path!: string;

  constructor(private readonly firestore: Firestore) { }

  getAll = () =>
    collectionData(query(collection(this.firestore, this.path), orderBy(this.fieldPath, this.orderByDirection)), { idField: 'id' });

  getLimit = (value: any) =>
    collectionData(query(collection(this.firestore, this.path), orderBy(this.fieldPath, this.orderByDirection), limit(value)), { idField: 'id' })

  getWhere = (fieldPath: string | FieldPath, opStr: WhereFilterOp, value: any) =>
    collectionData(query(collection(this.firestore, this.path), orderBy(this.fieldPath, this.orderByDirection), where(fieldPath, opStr, value)), { idField: 'id' })

  get = (id: string) =>
    docData(doc(this.firestore, `${this.path}/${id}`), { idField: 'id' });

  create = (biblia: any) =>
    addDoc(collection(this.firestore, '/biblia'), biblia);
}
