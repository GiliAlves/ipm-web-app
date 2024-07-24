import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable, of } from 'rxjs';
import { BOOKS } from "../model/db-biblia/books";
import { COMMENTARIES } from "../model/db-biblia/commentaries";
import { STORIES } from "../model/db-biblia/stories";
import { VERSES } from "../model/db-biblia/verses";
import { Bible } from './../interfaces/biblia.interface';

@Injectable({
    providedIn: 'root'
})
export class LivroResolver implements Resolve<Bible> {

    private biblia: Bible = {
        livro: BOOKS[0],
        livros: BOOKS,
        titulos: STORIES,
        versos: VERSES,
        comentarios: COMMENTARIES
    }

    constructor() { }

    resolve = (route: ActivatedRouteSnapshot): Observable<Bible> => {
        let bible: Bible = this.biblia;
        const book_number = route.paramMap.get('livro');
        
        if (book_number) {
            bible = {
                livro: this.biblia.livros.filter(book => book.book_number === +book_number)[0],
                livros: this.biblia.livros,
                titulos: this.biblia.titulos.filter(story => story.book_number === +book_number),
                versos: this.biblia.versos.filter(verso => verso.book_number === +book_number),
                comentarios: this.biblia.comentarios.filter(comentario => comentario.book_number === +book_number),
            }
        }
        return of(bible);
    }
}