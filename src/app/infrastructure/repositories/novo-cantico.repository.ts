import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NovoCantico } from '../../core/domain/entities';
import { INovoCanticoRepository } from '../../core/domain/ports';

/**
 * Adapter Firebase para repositório de hinos.
 */
@Injectable({ providedIn: 'root' })
export class FirebaseNovoCanticoRepository implements INovoCanticoRepository {
  private readonly path = 'hinos';

  constructor(private readonly firestore: Firestore) {}

  getAll(): Observable<NovoCantico[]> {
    return collectionData(
      query(collection(this.firestore, this.path), orderBy('numero', 'asc')),
      { idField: 'uid' }
    ) as Observable<NovoCantico[]>;
  }

  getById(id: string): Observable<NovoCantico | undefined> {
    return docData(doc(this.firestore, `${this.path}/${id}`), { idField: 'uid' }) as Observable<NovoCantico | undefined>;
  }

  search(term: string): Observable<NovoCantico[]> {
    const lower = term.toLowerCase();
    return this.getAll().pipe(
      map(items => items.filter(h =>
        h.titulo.toLowerCase().includes(lower) || h.numero.includes(lower)
      ))
    );
  }
}
