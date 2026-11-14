import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, orderBy, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Lider } from '../../core/domain/entities';
import { ILiderRepository } from '../../core/domain/ports';

/**
 * Adapter Firebase para repositório de líderes.
 */
@Injectable({ providedIn: 'root' })
export class FirebaseLiderRepository implements ILiderRepository {
  private readonly path = 'membros';

  constructor(private readonly firestore: Firestore) {}

  getByCargo(cargo: string): Observable<Lider[]> {
    return collectionData(
      query(collection(this.firestore, this.path), where('cargo', '==', cargo), orderBy('nome', 'asc')),
      { idField: 'uid' }
    ) as Observable<Lider[]>;
  }
}
