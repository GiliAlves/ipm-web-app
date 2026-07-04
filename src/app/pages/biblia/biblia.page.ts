import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonNote,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { groupBy } from 'lodash';
import { Bible, Books } from 'src/app/interfaces/biblia.interface';
import { BOOKS } from 'src/app/model/db-biblia/books';
import { COMMENTARIES } from 'src/app/model/db-biblia/commentaries';
import { STORIES } from 'src/app/model/db-biblia/stories';
import { VERSES } from 'src/app/model/db-biblia/verses';

@Component({
  selector: 'app-biblia',
  templateUrl: './biblia.page.html',
  styleUrls: ['./biblia.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonNote,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
  ],
})
export class BibliaPage {
  public biblia: Bible = {
    livro: BOOKS[0],
    livros: BOOKS,
    titulos: STORIES,
    versos: VERSES,
    comentarios: COMMENTARIES
  }

  public livros!: Record<string, Books[]>;
  public oldTestament!: Record<string, Books[]>;
  public newTestament!: Record<string, Books[]>;

  public oldSubgroupos = ['Pentateuco', 'Históricos', 'Poéticos', 'Profetas Maiores', 'Profetas Menores']
  public newSubgrupos = ['Evangelhos', 'Histórico', 'Epístolas', 'Revelação'];

  public grupos: string[] = [];
  public isOldTestamet = true;

  constructor() {
    this.groupByLivro(this.biblia);
  }

  public groupByLivro = (biblia: Bible) => {
    const grupo = groupBy(biblia.livros, 'testament');
    this.oldTestament = groupBy(grupo['old'], 'group');
    this.newTestament = groupBy(grupo['new'], 'group');

    this.getOldTestament(true);
  };

  public getOldTestament = (oldTestament: boolean) => {
    this.isOldTestamet = oldTestament;
    this.livros = oldTestament ? this.oldTestament : this.newTestament;
    this.grupos = oldTestament ? this.oldSubgroupos : this.newSubgrupos;
  };
}
