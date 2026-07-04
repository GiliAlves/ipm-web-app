import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import * as _ from 'lodash';
import { Observable, distinctUntilChanged, first } from 'rxjs';
import { TEMATICAS } from 'src/app/model/shared';
import {
  IonAccordion,
  IonAccordionGroup,
  IonAvatar,
  IonBadge,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonModal,
  IonNav,
  IonNote,
  IonPopover,
  IonProgressBar,
  IonRadio,
  IonRadioGroup,
  IonRange,
  IonRefresher,
  IonRefresherContent,
  IonReorder,
  IonReorderGroup,
  IonRow,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonSkeletonText,
  IonSpinner,
  IonSplitPane,
  IonTabBar,
  IonTabButton,
  IonText,
  IonTitle,
  IonToast,
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { NovoCantico, Tematica } from 'src/app/interfaces/novo-cantico.interface';
import { ArrayName, Font, HStorage, KeyWord, Position } from 'src/app/interfaces/share.interface';
import { UseNovoCanticoStore } from '../../presentation/signals/use-novo-cantico.store';
import {
  BTN_ACTION,
  COLORS,
  COLORS_DARK,
  COLOR_LIGHT,
  DECODE_HTML_CHAR_CODES,
  FILTERS,
  FILTER_IN_ARRAY,
  FIND_IN_ARRAY,
  FONTS,
  MSG_STORAGE_ERROR,
  NORMALIZE_HTML,
  NOT_NUMBER,
  REMOVE_FIRST_FROM_ARRAY,
  REMOVE_ITEM_ARRAY,
  SIZE_ARRAY,
  STORAGE,
  UNIQUE_ARRAY
} from 'src/utils/utils';

@Component({
  selector: 'app-novo-cantico',
  templateUrl: './novo-cantico.component.html',
  styleUrls: ['./novo-cantico.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PdfViewerModule,
    ScrollingModule,
    IonAccordion,
    IonAccordionGroup,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonSearchbar,
    IonItem,
    IonLabel,
    IonNote,
    IonChip,
    IonText,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonFab,
    IonFabButton,
    IonModal,
    IonRange,
    IonList,
    IonListHeader,
    IonRadio,
    IonRadioGroup,
    IonFooter,
    IonProgressBar,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonAvatar,
    IonBadge,
    IonFabList,
    IonToast,
    IonPopover,
    IonToggle,
    IonSegment,
    IonSegmentButton,
    IonReorder,
    IonReorderGroup,
    IonNav,
    IonBackButton,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSkeletonText,
    IonSpinner,
    IonSplitPane,
    IonMenu,
    IonTabBar,
    IonTabButton,
  ],
})
/**
 * Página de Hinos Novos (Novo Cântico).
 *
 * Lista hinos com temática e assunto, permite busca, filtros, favoritos,
 * personalização da letra e exibição de partituras em PDF.
 */
export class NovoCanticoComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('letra') letra!: ElementRef;
  @ViewChild('ionInputEl') ionInputEl!: IonInput;

  private readonly store = inject(UseNovoCanticoStore);
  private readonly actionSheetCtrl = inject(ActionSheetController);
  private readonly toastController = inject(ToastController);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly storage = inject(Storage);

  private messageGetStorageError = MSG_STORAGE_ERROR;

  public hinos$ = this.store.hinos$;
  public hinosSearch$!: Observable<NovoCantico[]>;
  public hino!: NovoCantico;

  public hinosStorage: HStorage = STORAGE;
  public initialSearchFilter: KeyWord[] = FILTERS;
  public arrayFonts: Font[] = FONTS;
  public arrayColors: string[] = COLORS;

  public tematicas: Tematica[] = TEMATICAS;
  public partitura = '';

  public searchBarTerm = '';
  public keyWordsName = '';

  public isOpenDetailsModal = false;
  public isOpenPartituraPDFModal = false;
  public isOpenColorModal = false;

  public indice = false;

  ngOnInit() {
    this.getStorage();

    const paramMap = this.activatedRoute.snapshot.paramMap.get('id');

    if (paramMap) {
      isNaN(Number(paramMap))
        ? this.searchFilterTematicaAndAssunto(paramMap as string)
        : this.getStorageHino();
    }
  }

  private getStorage = async () =>
    await this.storage.get('hinosStorage')
      .then(storage => storage !== null ? this.getInitialSearchFilter(storage) : this.setStorage())
      .catch(err => this.messageErrorStorage(err));

  private getStorageHino = async () =>
    await this.storage.get('inicialStorage')
      .then(storage => this.selected((storage as { hino: NovoCantico }).hino))
      .catch(err => this.messageErrorStorage(err));

  private REDUCE_ARRAY = (arr: string[]) => Object.values(_.reduce(arr, (acc: Record<string, { title: string; quantity: number }>, val: string) => {
    (!acc[val])
      ? acc[val] = { "title": val, "quantity": 1 }
      : acc[val]["quantity"]++;

    return acc;
  }, {}))

  private async getInitialSearchFilter(storage: unknown) {
    this.hinosStorage = storage as HStorage;

    this.initialSearchFilter.forEach(key =>
      this.addInArrayStorage('searchFilter', key, 'name'));

    this.desactiveAllSearchFilter();
  }

  private setStorage = () =>
    this.storage.set('hinosStorage', this.hinosStorage)
      .then(storage => this.hinosStorage = storage)
      .catch(err => this.messageErrorStorage(err));

  private messageErrorStorage = (err: unknown) =>
    this.presentToast(`${this.messageGetStorageError}${err}`);

  private async presentToast(message: string, duration: number = 200, position: Position = 'top') {
    const toast = await this.toastController.create({ message, duration, position });
    await toast.present();
  }

  private toggleActiveSearchFilter(index: number) {
    this.hinosStorage.searchFilter.map((keyword, i) =>
      (i === index)
        ? this.hinosStorage.searchFilter[index].active = !this.hinosStorage.searchFilter[index].active
        : keyword.active = false
    )
    this.setStorage();
  }

  private desactiveAllSearchFilter = () =>
    this.hinosStorage.searchFilter.forEach((KeyWord, i) => this.hinosStorage.searchFilter[i].active = false);

  private search = (term: string, indice: boolean = false) =>
    this.hinos$
      .pipe(
        distinctUntilChanged(),
        first())
      .subscribe((hinos: NovoCantico[]) => {
        this.hinosSearch$ = new Observable<NovoCantico[]>(observer =>
          observer.next(this.filterInArray(term, hinos, indice)));
        })

  private filterInArray(term: string, hinos: NovoCantico[], indice: boolean = false) {
    hinos.forEach((hino, index) => hinos[index].letra = DECODE_HTML_CHAR_CODES(NORMALIZE_HTML(hino.letra)));

    let arr1: NovoCantico[] = [];
    let arr2: NovoCantico[] = [];

    if (!Number.isNaN(Number(term)) && !indice) {
      hinos = hinos.filter(({ numero }) => numero === term);
    } else if (!indice) {
      arr1 = FILTER_IN_ARRAY(hinos, 'letra', term);
      arr2 = FILTER_IN_ARRAY(hinos, 'titulo', term);
      hinos = _.union(arr1, arr2);
    } else {
      arr1 = FILTER_IN_ARRAY(hinos, 'tematica', term);
      arr2 = FILTER_IN_ARRAY(hinos, 'assunto', term);
      hinos = _.union(arr1, arr2);
    }

    return UNIQUE_ARRAY(hinos);
  }

  public searchBar(event: Event) {
    this.desactiveAllSearchFilter();

    const value = (event.target as HTMLInputElement).value.toLowerCase();
    value
      ? this.search(value)
      : this.clearSearch();
  }

  public searchFilter(term: string, index: number) {
    this.searchBarTerm = '';

    !this.hinosStorage.searchFilter[index].active
      ? this.search(term.toLowerCase())
      : this.clearSearch();

    this.toggleActiveSearchFilter(index);
  }

  public searchFilterTematicaAndAssunto(term: string) {
    this.clearSearch();
    this.search(term.toLowerCase(), true);
  }

  public clearSearch = () => {
    this.searchBarTerm = '';
    this.desactiveAllSearchFilter();
    this.hinosSearch$ = new Observable<NovoCantico[]>();
  }

  public onInputSearchFilter(event: CustomEvent) {
    const filteredValue = NOT_NUMBER((event.target as HTMLInputElement).value);
    this.keyWordsName = filteredValue;
    this.ionInputEl.value = filteredValue;
  }

  public addInSearchFilter() {
    if (this.keyWordsName)
      this.addInArrayStorage('searchFilter', { name: this.keyWordsName, active: false }, 'name');

    this.keyWordsName = '';
  }

  public addInArrayStorage(arrayName: ArrayName, item: unknown, key: string, event?: CustomEvent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((arrayName !== 'favorites' || (event?.detail?.ratio ?? 1) === 1) && !FIND_IN_ARRAY(this.hinosStorage[arrayName] as any[], item, key)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.hinosStorage[arrayName].unshift(item as any);
      this.setStorage();
    }
  }

  public removeInArrayStorage(arrayName: ArrayName, item: unknown, key: string, event?: CustomEvent) {
    if (arrayName === 'recents' || (event?.detail?.ratio ?? 1) === 1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.hinosStorage[arrayName] = REMOVE_ITEM_ARRAY(this.hinosStorage[arrayName] as any[], item, key) as any;
      this.setStorage();
    }
  }

  public removeAllInArrayStorage(arrayName: ArrayName) {
    this.hinosStorage[arrayName] = [];
    this.setStorage();
  }

  public toggleDetailsModal = () =>
    this.isOpenDetailsModal = !this.isOpenDetailsModal;

  public selected(hino: NovoCantico) {
    this.hino = hino;
    this.toggleDetailsModal();

    if (SIZE_ARRAY(this.hinosStorage.recents, 15)) {
      REMOVE_FIRST_FROM_ARRAY(this.hinosStorage.recents)
    }

    this.addInArrayStorage('recents', hino, 'numero');
  }

  public clipboard = async (hino: NovoCantico) => await Clipboard
    .write({ string: hino.titulo.toUpperCase() + '\n\n' + this.hino.letra })
    .then(() => this.presentToast(`${hino.titulo} copiado`))

  public share = async (hino: NovoCantico) => await Share
    .share({
      title: hino.titulo,
      text: '*' + hino.numero + ' ・ ' + hino.titulo.toUpperCase() + '*' + '\n\n' + this.hino.letra,
      dialogTitle: hino.titulo
    })

  public zooming(event: CustomEvent) {
    const value = event.detail.value as number;
    this.hinosStorage.formatacao.tamanhoFonte = value;
    this.setProperty('--letra-font-size', `${value}px`);
    this.setProperty('--letra-line-height', `${value * 1.5}px`);
  }

  public changeColor(color: string) {
    this.hinosStorage.formatacao.corFonte = color;
    this.setStorage();
    this.setProperty('--letra-color', color);
    this.checkColors(color);
  }

  public changeBackgroundDarkColor = () => {
    this.hinosStorage.formatacao.backgrond = !this.hinosStorage.formatacao.backgrond;
    this.setStorage();
  }

  public changeFontFamily = (font: string) => {
    this.hinosStorage.formatacao.fonte = font;
    this.setStorage();
    this.setProperty('--letra-font-family', font);
  }

  public changeFontWeight = () => {
    this.hinosStorage.formatacao.weight = !this.hinosStorage.formatacao.weight;
    this.setStorage();
    this.setProperty('--letra-font-weight', this.hinosStorage.formatacao.weight ? 'bold' : 'normal');
  }

  public changeFontStyle = () => {
    this.hinosStorage.formatacao.style = !this.hinosStorage.formatacao.style;
    this.setStorage();
    this.setProperty('--letra-font-style', this.hinosStorage.formatacao.style ? 'italic' : 'normal');
  }

  private setProperty = (property: string, value: string) =>
    document.documentElement.style.setProperty(property, value);

  private checkColors(color: string) {
    if (COLOR_LIGHT.find(c => c === color)) {
      this.hinosStorage.formatacao.backgrond = true;
    }

    if (COLORS_DARK.find(c => c === color)) {
      this.hinosStorage.formatacao.backgrond = false;
    }
    this.setStorage();
  }

  public pinFormatter = (value: number) => `${value}px`;

  public setPartitura = (partitura: string) => {
    this.partitura = partitura;
    this.isOpenPartituraPDFModal = true;
  };

  public async presentActionSheet(hino: NovoCantico) {
    BTN_ACTION[0].handler = () => this.setPartitura(hino.partitura ?? '');
    BTN_ACTION[1].handler = () => {};
    BTN_ACTION[2].handler = () => {
      this.clipboard(hino);
      this.dismissActionSheet()
    }
    BTN_ACTION[3].handler = () => {
      this.share(hino);
      this.dismissActionSheet();
    }
    let buttons = [];

    buttons = hino.partitura
      ? BTN_ACTION
      : BTN_ACTION.filter((a) => a.text !== 'Partitura')

    // buttons = hino.audios
    //   ? buttons
    //   : buttons.filter((a) => a.text !== 'Vozes');

    const actionSheet = await this.actionSheetCtrl.create({
      header: hino.autor,
      subHeader: `${hino.tematica} ・ ${hino.assunto}`,
      translucent: true,
      mode: 'ios',
      buttons
    });

    await actionSheet.present();
  }

  public selectedIndice = () => this.indice = !this.indice;

  public dismissActionSheet = async () => await this.actionSheetCtrl.dismiss();

  public uniqueArray = <T>(arr: T[]) => UNIQUE_ARRAY(arr);
}
