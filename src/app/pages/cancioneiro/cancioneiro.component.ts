import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Observable, distinctUntilChanged, first } from 'rxjs';
import { Cantico } from 'src/app/interfaces/cantico.interface';
import { CStorage, Font } from 'src/app/interfaces/share.interface';
import { UseCancioneiroStore } from '../../presentation/signals/use-cancioneiro.store';
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
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { SanitizedHtmlPipe } from 'src/app/pipes/sanitized-html.pipe';
import { BTN_ACTION, COLORS, COLORS_DARK, COLOR_LIGHT, DECODE_HTML_CHAR_CODES, FILTERS, FIND_IN_ARRAY, FONTS, MSG_STORAGE_ERROR, NORMALIZE_HTML, NOT_NUMBER, REMOVE_FIRST_FROM_ARRAY, REMOVE_ITEM_ARRAY, SIZE_ARRAY, STORAGE, UNIQUE_ARRAY } from 'src/utils/utils';
import { ArrayName, KeyWord, Position } from './cancioneiro';

@Component({
  selector: 'app-cancioneiro',
  templateUrl: './cancioneiro.component.html',
  styleUrls: ['./cancioneiro.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SanitizedHtmlPipe,
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
 * Página do Cancioneiro.
 *
 * Lista cânticos do hinário, permite busca por número ou texto, filtros temáticos,
 * favoritos, histórico e personalização da exibição da letra.
 */
export class CancioneiroComponent implements OnInit, OnDestroy {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('letra') letra!: ElementRef;
  @ViewChild('ionInputEl') ionInputEl!: IonInput;

  private readonly store = inject(UseCancioneiroStore);
  private readonly actionSheetCtrl = inject(ActionSheetController);
  private readonly toastController = inject(ToastController);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly storage = inject(Storage);

  private messageGetStorageError = MSG_STORAGE_ERROR;

  public canticos$ = this.store.canticos$;
  public canticosSearch$!: Observable<Cantico[]>;
  public cantico!: Cantico;

  public canticosStorage: CStorage = STORAGE;
  public initialSearchFilter: KeyWord[] = FILTERS;
  public arrayFonts: Font[] = FONTS;
  public arrayColors: string[] = COLORS;

  public searchBarTerm = '';
  public keyWordsName = '';

  public isOpenDetailsModal = false;
  public isOpenColorModal = false;
  public indice = false;

  ngOnInit() {
    this.getStorage();

    const paramMap = this.activatedRoute.snapshot.paramMap.get('id');

    if (paramMap) {
      this.getStorageCantico();
    }
  }

  ngOnDestroy() {
    this.desactiveAllSearchFilter();
    this.canticos$.subscribe().unsubscribe();
  }

  private getStorage = async () =>
    await this.storage.get('canticosStorage')
      .then(storage => storage !== null ? this.getInitialSearchFilter(storage) : this.setStorage())
      .catch(err => this.messageErrorStorage(err));

  private getStorageCantico = async () =>
    await this.storage.get('inicialStorage')
      .then(storage => this.selected((storage as { cantico: Cantico }).cantico))
      .catch(err => this.messageErrorStorage(err));

  private getInitialSearchFilter(storage: unknown) {
    this.canticosStorage = storage as CStorage;

    this.initialSearchFilter.forEach(key =>
      this.addInArrayStorage('searchFilter', key, 'name'));

    this.desactiveAllSearchFilter();
  }

  private setStorage = () =>
    this.storage.set('canticosStorage', this.canticosStorage)
      .then(storage => this.canticosStorage = storage as CStorage)
      .catch(err => this.messageErrorStorage(err));

  private messageErrorStorage = (err: unknown) =>
    this.presentToast(`${this.messageGetStorageError}${err}`);

  private async presentToast(message: string, duration: number = 200, position: Position = 'top') {
    const toast = await this.toastController.create({ message, duration, position });
    await toast.present();
  }

  private toggleActiveSearchFilter(index: number) {
    this.canticosStorage.searchFilter.map((keyword, i) =>
      (i === index)
        ? this.canticosStorage.searchFilter[index].active = !this.canticosStorage.searchFilter[index].active
        : keyword.active = false
    )
    this.setStorage();
  }

  private desactiveAllSearchFilter = () =>
    this.canticosStorage.searchFilter.forEach((KeyWord, i) => this.canticosStorage.searchFilter[i].active = false);


  private search = (term: string) =>
    this.canticos$
      .pipe(
        distinctUntilChanged(),
        first())
      .subscribe(cantico =>
          this.canticosSearch$ = new Observable<Cantico[]>(observer =>
            observer.next(this.filterInArray(term, cantico))));

  private filterInArray(term: string, cantico: Cantico[]) {
    if (!Number.isNaN(Number(term))) {
      cantico = cantico.filter(({ numero }) => numero === term)
    } else {
      cantico = cantico.filter(({ letra }) => letra.toLowerCase().indexOf(term) > -1);
      cantico = cantico.concat(cantico.filter(({ titulo }) => titulo.toLowerCase().indexOf(term) > -1));
    }
    return UNIQUE_ARRAY(cantico);
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

    !this.canticosStorage.searchFilter[index].active
      ? this.search(term.toLowerCase())
      : this.canticosSearch$ = new Observable<Cantico[]>();

    this.toggleActiveSearchFilter(index);
  }

  public clearSearch = () => {
    this.searchBarTerm = '';
    this.desactiveAllSearchFilter();
    this.canticosSearch$ = new Observable<Cantico[]>();
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
    if ((arrayName !== 'favorites' || (event?.detail?.ratio ?? 1) === 1) && !FIND_IN_ARRAY(this.canticosStorage[arrayName] as any[], item, key)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.canticosStorage[arrayName].unshift(item as any);
      this.setStorage();
    }
  }

  public removeInArrayStorage(arrayName: ArrayName, item: unknown, key: string, event?: CustomEvent) {
    if (arrayName === 'recents' || (event?.detail?.ratio ?? 1) === 1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.canticosStorage[arrayName] = REMOVE_ITEM_ARRAY(this.canticosStorage[arrayName] as any[], item, key) as any;
      this.setStorage();
    }
  }

  public removeAllInArrayStorage(arrayName: ArrayName) {
    this.canticosStorage[arrayName] = [];
    this.setStorage();
  }

  public toggleDetailsModal = () =>
    this.isOpenDetailsModal = !this.isOpenDetailsModal;

  public selected(cantico: Cantico) {
    cantico.letra = DECODE_HTML_CHAR_CODES(NORMALIZE_HTML(cantico.letra));
    this.cantico = cantico;
    this.toggleDetailsModal();

    if (SIZE_ARRAY(this.canticosStorage.recents, 15)) {
      REMOVE_FIRST_FROM_ARRAY(this.canticosStorage.recents)
    }

    this.addInArrayStorage('recents', cantico, 'numero');
  }

  public clipboard = async (cantico: Cantico) => await Clipboard
    .write({ string: cantico.titulo.toUpperCase() + '\n\n' + this.cantico.letra })
    .then(() => this.presentToast(`${cantico.titulo} copiado`))

  public share = async (cantico: Cantico) => await Share
    .share({
      title: cantico.titulo,
      text: '*' + cantico.numero + ' ・ ' + cantico.titulo.toUpperCase() + '*' + '\n\n' + this.cantico.letra,
      dialogTitle: cantico.titulo
    })

  public zooming(event: CustomEvent) {
    const value = event.detail.value as number;
    this.canticosStorage.formatacao.tamanhoFonte = value;
    this.setProperty('--letra-font-size', `${value}px`);
    this.setProperty('--letra-line-height', `${value * 1.5}px`);
  }

  public changeColor(color: string) {
    this.canticosStorage.formatacao.corFonte = color;
    this.setStorage();
    this.setProperty('--letra-color', color);
    this.checkColors(color);
  }

  public changeBackgroundDarkColor = () => {
    this.canticosStorage.formatacao.backgrond = !this.canticosStorage.formatacao.backgrond;
    this.setStorage();
  }

  public changeFontFamily = (font: string) => {
    this.canticosStorage.formatacao.fonte = font;
    this.setStorage();
    this.setProperty('--letra-font-family', font);
  }

  public changeFontWeight = () => {
    this.canticosStorage.formatacao.weight = !this.canticosStorage.formatacao.weight;
    this.setStorage();
    this.setProperty('--letra-font-weight', this.canticosStorage.formatacao.weight ? 'bold' : 'normal');
  }

  public changeFontStyle = () => {
    this.canticosStorage.formatacao.style = !this.canticosStorage.formatacao.style;
    this.setStorage();
    this.setProperty('--letra-font-style', this.canticosStorage.formatacao.style ? 'italic' : 'normal');
  }

  private setProperty = (property: string, value: string) =>
    document.documentElement.style.setProperty(property, value);

  private checkColors(color: string) {
    if (COLOR_LIGHT.find(c => c === color)) {
      this.canticosStorage.formatacao.backgrond = true;
    }

    if (COLORS_DARK.find(c => c === color)) {
      this.canticosStorage.formatacao.backgrond = false;
    }
    this.setStorage();
  }

  public pinFormatter = (value: number) => `${value}px`;

  public async presentActionSheet(cantico: Cantico) {
    BTN_ACTION[1].handler = () => {};
    BTN_ACTION[2].handler = () => {
      this.clipboard(cantico);
      this.dismissActionSheet()
    }
    BTN_ACTION[3].handler = () => {
      this.share(cantico);
      this.dismissActionSheet();
    }
    let buttons = [];

    buttons = BTN_ACTION.filter((a) => a.text !== 'Partitura');

    const actionSheet = await this.actionSheetCtrl.create({
      header: cantico.titulo,
      subHeader: cantico.numero,
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
