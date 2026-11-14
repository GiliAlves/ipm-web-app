import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cantico } from '../../core/domain/entities';
import { ICanticoRepository } from '../../core/domain/ports';

/**
 * Adapter Firebase para repositório de cânticos.
 */
@Injectable({ providedIn: 'root' })
export class FirebaseCanticoRepository implements ICanticoRepository {
  private readonly path = 'canticos';

  constructor(private readonly firestore: Firestore) {}

  getAll(): Observable<Cantico[]> {
    return collectionData(
      query(collection(this.firestore, this.path), orderBy('numero', 'asc')),
      { idField: 'uid' }
    ) as Observable<Cantico[]>;
  }

  getById(id: string): Observable<Cantico | undefined> {
    return docData(doc(this.firestore, `${this.path}/${id}`), { idField: 'uid' }) as Observable<Cantico | undefined>;
  }

  search(term: string): Observable<Cantico[]> {
    const lower = term.toLowerCase();
    return this.getAll().pipe(
      map(items => items.filter(c =>
        c.titulo.toLowerCase().includes(lower) || c.numero.includes(lower)
      ))
    );
  }
}
