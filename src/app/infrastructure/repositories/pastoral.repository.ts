import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, limit, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Pastoral } from '../../core/domain/entities';
import { IPastoralRepository } from '../../core/domain/ports';

/**
 * Adapter Firebase para repositório de mensagens pastorais.
 */
@Injectable({ providedIn: 'root' })
export class FirebasePastoralRepository implements IPastoralRepository {
  private readonly path = 'pastoral';

  constructor(private readonly firestore: Firestore) {}

  getAll(): Observable<Pastoral[]> {
    return collectionData(
      query(collection(this.firestore, this.path), orderBy('data', 'desc')),
      { idField: 'uid' }
    ) as Observable<Pastoral[]>;
  }

  getLimit(value: number): Observable<Pastoral[]> {
    return collectionData(
      query(collection(this.firestore, this.path), orderBy('data', 'desc'), limit(value)),
      { idField: 'uid' }
    ) as Observable<Pastoral[]>;
  }
}
