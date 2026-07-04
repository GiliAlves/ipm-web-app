import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BOOKS } from '../model/db-biblia/books';
import { COMMENTARIES } from '../model/db-biblia/commentaries';
import { STORIES } from '../model/db-biblia/stories';
import { VERSES } from '../model/db-biblia/verses';
import { Bible } from '../interfaces/biblia.interface';

/** Estrutura completa da Bíblia com todos os livros, títulos, versos e comentários. */
const biblia: Bible = {
  livro: BOOKS[0],
  livros: BOOKS,
  titulos: STORIES,
  versos: VERSES,
  comentarios: COMMENTARIES,
};

/**
 * Resolver que monta o objeto de um livro bíblico específico antes de ativar a rota.
 */
export const livroResolver: ResolveFn<Bible> = (
  route: ActivatedRouteSnapshot
): Observable<Bible> => {
  const bookNumber = route.paramMap.get('livro');

  const bible = bookNumber
    ? {
        livro: biblia.livros.filter(book => book.book_number === +bookNumber)[0],
        livros: biblia.livros,
        titulos: biblia.titulos.filter(story => story.book_number === +bookNumber),
        versos: biblia.versos.filter(verso => verso.book_number === +bookNumber),
        comentarios: biblia.comentarios.filter(comentario => comentario.book_number === +bookNumber),
      }
    : biblia;

  return of(bible as Bible);
};