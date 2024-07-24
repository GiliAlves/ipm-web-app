export interface Bible {
    livro: Books;
    livros: Books[];
    titulos: Stories[];
    versos: Verses[];
    comentarios: Commentaries[];
}

export interface Books {
    book_number: number;
    name: string;
    testament: string;
    group: string;
    short_name: string;
    long_name: string;
    book_color: string;
    resume: string;
    chapters: number;
}

export interface Stories {
    book_number: number;
    chapter: number;
    verse: number;
    order_if_several: number;
    title: string;
}

export interface Verses {
    book_number: number;
    chapter: number;
    verse: number;
    text: string;
}

export interface Commentaries {
    book_number: number;
    chapter_number_from: number;
    verse_number_from: number;
    chapter_number_to: number;
    verse_number_to: number;
    marker: string;
    text: string;
}