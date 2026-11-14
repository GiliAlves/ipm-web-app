import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Livro } from '../../core/domain/entities';
import { ILivroRepository } from '../../core/domain/ports';

/**
 * Adapter Firebase para repositório de livros bíblicos.
 */
@Injectable({ providedIn: 'root' })
export class FirebaseLivroRepository implements ILivroRepository {
  private readonly path = 'biblia';

  constructor(private readonly firestore: Firestore) {}

  getAll(): Observable<Livro[]> {
    return collectionData(
      query(collection(this.firestore, this.path), orderBy('book_number', 'asc')),
      { idField: 'id' }
    ) as Observable<Livro[]>;
  }

  getByBookNumber(bookNumber: number): Observable<Livro | undefined> {
    return (collectionData(
      query(collection(this.firestore, this.path), orderBy('book_number', 'asc')),
      { idField: 'id' }
    ) as Observable<Livro[]>).pipe(
      map(livros => livros.find(l => l.bookNumber === bookNumber))
    );
  }
}
