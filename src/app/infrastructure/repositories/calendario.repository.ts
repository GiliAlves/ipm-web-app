import { Injectable } from '@angular/core';
import { Firestore, Timestamp, collection, collectionData, orderBy, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Calendario } from '../../core/domain/entities';
import { ICalendarioRepository } from '../../core/domain/ports';

/**
 * Adapter Firebase para repositório de eventos do calendário.
 */
@Injectable({ providedIn: 'root' })
export class FirebaseCalendarioRepository implements ICalendarioRepository {
  private readonly path = 'calendario';

  constructor(private readonly firestore: Firestore) {}

  getAll(): Observable<Calendario[]> {
    return collectionData(
      query(collection(this.firestore, this.path), orderBy('dataInicio', 'asc')),
      { idField: 'uid' }
    ) as Observable<Calendario[]>;
  }

  getFromToday(): Observable<Calendario[]> {
    const today = Timestamp.fromDate(new Date());
    return collectionData(
      query(collection(this.firestore, this.path), where('dataInicio', '>=', today), orderBy('dataInicio', 'asc')),
      { idField: 'uid' }
    ) as Observable<Calendario[]>;
  }
}
