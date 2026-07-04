import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, limit, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Devocional } from '../../core/domain/entities';
import { IDevocionalRepository } from '../../core/domain/ports';

/**
 * Adapter Firebase para repositório de devocionais.
 */
@Injectable({ providedIn: 'root' })
export class FirebaseDevocionalRepository implements IDevocionalRepository {
  private readonly path = 'devocional';

  constructor(private readonly firestore: Firestore) {}

  getAll(): Observable<Devocional[]> {
    return collectionData(
      query(collection(this.firestore, this.path), orderBy('data', 'desc')),
      { idField: 'uid' }
    ) as Observable<Devocional[]>;
  }

  getLimit(value: number): Observable<Devocional[]> {
    return collectionData(
      query(collection(this.firestore, this.path), orderBy('data', 'desc'), limit(value)),
      { idField: 'uid' }
    ) as Observable<Devocional[]>;
  }
}
