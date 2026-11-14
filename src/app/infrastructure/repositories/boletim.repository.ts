import { Injectable } from '@angular/core';
import { Firestore, Timestamp, collection, collectionData, doc, docData, orderBy, query } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Boletim } from '../../core/domain/entities';
import { IBoletimRepository } from '../../core/domain/ports';

/**
 * Adapter Firebase para repositório de boletins.
 */
@Injectable({ providedIn: 'root' })
export class FirebaseBoletimRepository implements IBoletimRepository {
  private readonly path = 'boletins';

  constructor(private readonly firestore: Firestore) {}

  getAll(): Observable<Boletim[]> {
    return collectionData(
      query(collection(this.firestore, this.path), orderBy('data', 'desc')),
      { idField: 'id' }
    ).pipe(
      map(boletins => (boletins as Boletim[]).map(boletim => this.normalizeBoletim(boletim)))
    );
  }

  getById(id: string): Observable<Boletim | undefined> {
    return docData(doc(this.firestore, `${this.path}/${id}`), { idField: 'id' }).pipe(
      map(boletim => boletim ? this.normalizeBoletim(boletim as Boletim) : undefined)
    );
  }

  private normalizeBoletim(boletim: Boletim): Boletim {
    return {
      ...boletim,
      data: this.toDate(boletim.data),
    };
  }

  private toDate(value: Date | Timestamp | unknown): Date {
    if (value instanceof Date) {
      return value;
    }
    if (value && typeof value === 'object' && 'toDate' in value && typeof (value as Timestamp).toDate === 'function') {
      return (value as Timestamp).toDate();
    }
    return new Date(value as string | number | Date);
  }
}
