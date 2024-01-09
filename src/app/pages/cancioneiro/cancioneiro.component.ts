import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { ActionSheetController, IonInput, IonModal, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Observable, distinctUntilChanged, first } from 'rxjs';
import { Cantico } from 'src/app/interfaces/cantico.interface';
import { CStorage, Font } from 'src/app/interfaces/share.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import { BTN_ACTION, COLORS, COLORS_DARK, COLOR_LIGHT, DECODE_HTML_CHAR_CODES, FILTERS, FIND_IN_ARRAY, FONTS, MSG_STORAGE_ERROR, NORMALIZE_HTML, NOT_NUMBER, REMOVE_FIRST_FROM_ARRAY, REMOVE_ITEM_ARRAY, SIZE_ARRAY, STORAGE, UNIQUE_ARRAY } from 'src/utils/utils';
import { ArrayName, Key, KeyWord, Position } from './cancioneiro';

@Component({
  selector: 'app-cancioneiro',
  templateUrl: './cancioneiro.component.html',
  styleUrls: ['./cancioneiro.component.scss'],
})
export class CancioneiroComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('letra') letra!: ElementRef;
  @ViewChild('ionInputEl') ionInputEl!: IonInput;

  private messageGetStorageError: string = MSG_STORAGE_ERROR;

  public canticos$: Observable<Cantico[]> = new Observable<Cantico[]>;
  public canticosSearch$!: Observable<Cantico[]>;
  public cantico!: Cantico;

  public canticosStorage: CStorage = STORAGE;
  public initialSearchFilter: KeyWord[] = FILTERS;
  public arrayFonts: Font[] = FONTS;
  public arrayColors: string[] = COLORS;

  public searchBarTerm: string = '';
  public keyWordsName: string = '';

  public isOpenDetailsModal: boolean = false;
  public isOpenColorModal: boolean = false;
  public indice: boolean = false;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private toastController: ToastController,
    private firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private storage: Storage,
  ) {
    this.firebaseService.fieldPath = 'id';
    this.firebaseService.path = 'canticos';
    this.firebaseService.orderByDirection = 'asc';
  }

  ngOnInit() {
    this.getAll();
    this.getStorage();

    let paramMap = this.activatedRoute.snapshot.paramMap.get('id');

    if (paramMap) {
      this.getStorageCantico();
    }
  }

  ngOnDestroy() {
    this.desactiveAllSearchFilter();
    this.canticos$.subscribe().unsubscribe();
  }

  private getAll = () =>
    this.canticos$ = this.firebaseService.getAll() as Observable<Cantico[]>;

  private getStorage = async () =>
    await this.storage.get('canticosStorage')
      .then(storage => storage !== null ? this.getInitialSearchFilter(storage) : this.setStorage())
      .catch(err => this.messageErrorStorage(err));

  private getStorageCantico = async () =>
    await this.storage.get('inicialStorage')
      .then(storage => this.selected(storage.cantico))
      .catch(err => this.messageErrorStorage(err));

  private getInitialSearchFilter(storage: any) {
    this.canticosStorage = storage;

    this.initialSearchFilter.forEach(key =>
      this.addInArrayStorage('searchFilter', key, 'name'));

    this.desactiveAllSearchFilter();
  }

  private setStorage = () =>
    this.storage.set('canticosStorage', this.canticosStorage)
      .then(storage => this.canticosStorage = storage)
      .catch(err => this.messageErrorStorage(err));

  private messageErrorStorage = (err: any) =>
    this.presentToast(this.messageGetStorageError, err);

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
          this.canticosSearch$ = new Observable(observer =>
            observer.next(this.filterInArray(term, cantico))));

  private filterInArray(term: any, cantico: Cantico[]) {
    if (!isNaN(term)) {
      cantico = cantico.filter(({ numero }) => numero === term)
    } else {
      cantico = cantico.filter(({ letra }) => letra.toLowerCase().indexOf(term) > -1);
      cantico = cantico.concat(cantico.filter(({ titulo }) => titulo.toLowerCase().indexOf(term) > -1));
    }
    return UNIQUE_ARRAY(cantico);
  }

  public searchBar() {
    this.desactiveAllSearchFilter();

    (this.searchBarTerm)
      ? this.search(this.searchBarTerm.toLowerCase())
      : this.clearSearch();
  }

  public searchFilter(term: string, index: number) {
    this.searchBarTerm = '';

    !this.canticosStorage.searchFilter[index].active
      ? this.search(term.toLowerCase())
      : this.canticosSearch$ = new Observable;

    this.toggleActiveSearchFilter(index);
  }

  public clearSearch = () => {
    this.searchBarTerm = '';
    this.desactiveAllSearchFilter();
    this.canticosSearch$ = new Observable;
  }

  public onInputSearchFilter(event: CustomEvent | any) {
    const filteredValue = NOT_NUMBER(event.target!.value);
    this.keyWordsName = filteredValue;
    this.ionInputEl.value = filteredValue;
  }

  public addInSearchFilter() {
    if (this.keyWordsName)
      this.addInArrayStorage('searchFilter', { name: this.keyWordsName, active: false }, 'name');

    this.keyWordsName = '';
  }

  public addInArrayStorage(arrayName: ArrayName, item: any, key: Key, event?: CustomEvent | any) {
    if ((arrayName !== 'favorites' || event.detail.ratio === 1) && !FIND_IN_ARRAY(this.canticosStorage[arrayName], item, key)) {
      this.canticosStorage[arrayName].unshift(item);
      this.setStorage();
    }
  }

  public removeInArrayStorage(arrayName: ArrayName, item: any, key: Key, event?: CustomEvent | any) {
    if (arrayName === 'recents' || event.detail.ratio === 1) {
      this.canticosStorage[arrayName] = REMOVE_ITEM_ARRAY(this.canticosStorage[arrayName], item, key);
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

  public zooming(event: CustomEvent | any) {
    this.canticosStorage.formatacao.tamanhoFonte = event.detail.value;
    this.setProperty('--letra-font-size', event.detail.value + 'px');
    this.setProperty('--letra-line-height', event.detail.value * 1.5 + 'px');
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

  public uniqueArray = (arr: any) => UNIQUE_ARRAY(arr);
}
