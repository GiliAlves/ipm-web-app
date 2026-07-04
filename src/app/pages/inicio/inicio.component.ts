import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonMenuButton,
  IonMenuToggle,
  IonNote,
  IonRow,
  IonTabButton,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  IonButtons
} from '@ionic/angular/standalone';
import { InicialStorage } from 'src/app/interfaces/inicial.interface';
import { Tematica } from 'src/app/interfaces/novo-cantico.interface';
import { BIBLIA, HORARIOS, INICIAL_STORAGE, LINKS, SOCIAL, TEMATICAS } from 'src/app/model/shared';
import { UseHomeStore } from '../../presentation/signals/use-home.store';

/**
 * Página inicial do aplicativo em standalone component.
 */
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [
    CommonModule,
    DatePipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonText,
    IonNote,
    IonImg,
    IonThumbnail,
    IonIcon,
    IonLabel,
    IonMenuToggle,
    IonTabButton,
  ],
})
export class InicioComponent {
  private readonly router = inject(Router);
  private readonly store = inject(UseHomeStore);
  private readonly datePipe = inject(DatePipe);

  readonly homeData = this.store.homeData;
  readonly searchBarTerm = this.store.searchBarTerm;
  readonly isSpinner = this.store.isSpinner;
  readonly isSubmmit = this.store.isSubmmit;
  readonly scrollTop = this.store.scrollTop;

  public biblia = BIBLIA;
  public tematicas: Tematica[] = TEMATICAS;
  public inicialStorage: InicialStorage = INICIAL_STORAGE;
  public social = SOCIAL;
  public horarios = HORARIOS;
  public links = LINKS;

  public date = new Date();
  public calendarDates: string[] = [];
  public valueDay: string | undefined = '';
  public isSelected = false;

  public trasformerText = (text: string) => text.replace('|', "\n").replace(/&quot;/g, '"');

  public handleScroll = ($event: CustomEvent) =>
    this.store.handleScroll($event.detail.scrollTop === 0);

  public resetSearch = () => this.store.updateSearchBarTerm('');

  public searchBar(item: string, path: string, fieldPath: string) {
    // TODO: reimplementar busca com SearchCanticoUseCase / SearchNovoCanticoUseCase
    void item;
    void path;
    void fieldPath;
  }
}


