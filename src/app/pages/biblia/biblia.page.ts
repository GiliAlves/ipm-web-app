import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Bible, Books } from 'src/app/interfaces/biblia.interface';
import { BOOKS } from 'src/app/model/db-biblia/books';
import { COMMENTARIES } from 'src/app/model/db-biblia/commentaries';
import { STORIES } from 'src/app/model/db-biblia/stories';
import { VERSES } from 'src/app/model/db-biblia/verses';
import { LivroPage } from './livro/livro.page';

@Component({
  selector: 'app-biblia',
  templateUrl: './biblia.page.html',
  styleUrls: ['./biblia.page.scss'],
})
export class BibliaPage implements OnInit {
  component = {LivroPage};
  
  public biblia: Bible = {
    livro: BOOKS[0],
    livros: BOOKS,
    titulos: STORIES,
    versos: VERSES,
    comentarios: COMMENTARIES
  }

  public livros!: _.Dictionary<Books[]>;
  public oldTestament!: _.Dictionary<Books[]>;
  public newTestament!: _.Dictionary<Books[]>;

  public oldSubgroupos = ['Pentateuco', 'Históricos', 'Poéticos', 'Profetas Maiores', 'Profetas Menores']
  public newSubgrupos = ['Evangelhos', 'Histórico', 'Epístolas', 'Revelação'];

  public grupos: string[] = [];
  public isOldTestamet = true;
  
  constructor() { }

  async ngOnInit() {
    this.groupByLivro(this.biblia);
  }

  public groupByLivro = (biblia: Bible) => {
    const grupo = _.groupBy(biblia.livros, 'testament');
    this.oldTestament = _.groupBy(grupo['old'], 'group');
    this.newTestament = _.groupBy(grupo['new'], 'group');

    this.getOldTestament(true);
  };

  public getOldTestament = (oldTestament: boolean) => {
    this.isOldTestamet = oldTestament;
    this.livros = oldTestament ? this.oldTestament : this.newTestament;
    this.grupos = oldTestament ? this.oldSubgroupos : this.newSubgrupos;
  };
}
