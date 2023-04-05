import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { ActionSheetController, IonInput, IonModal, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import * as _ from 'lodash';
import { distinctUntilChanged, first, Observable } from 'rxjs';
import { TEMATICAS } from 'src/app/model/shared';

import { ArrayName, Font, HinoStorage, Key, KeyWord, NovoCantico, Position, Tematica } from 'src/app/interfaces/novo-cantico.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import {
  DECODE_HTML_CHAR_CODES,
  FILTER_IN_ARRAY,
  FIND_IN_ARRAY,
  NORMALIZE_HTML,
  REMOVE_FIRST_FROM_ARRAY,
  REMOVE_ITEM_ARRAY,
  SIZE_ARRAY,
  UNIQUE_ARRAY
} from 'src/utils/utils';
import { COLORS, COLORS_DARK, COLOR_LIGHT, FILTERS, FONTS, PARTITURA, STORAGE } from './novo-cantico';

@Component({
  selector: 'app-novo-cantico',
  templateUrl: './novo-cantico.component.html',
  styleUrls: ['./novo-cantico.component.scss'],
})
export class NovoCanticoComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('letra') letra!: ElementRef;
  @ViewChild('ionInputEl') ionInputEl!: IonInput;

  private messageGetStorageError: string = 'Erro ao obter dados armazenados: ';

  public hinos$: Observable<NovoCantico[]> = new Observable<NovoCantico[]>;
  public hinosSearch$!: Observable<NovoCantico[]>;
  public hino!: NovoCantico;

  public hinosStorage: HinoStorage = STORAGE;
  public initialSearchFilter: KeyWord[] = FILTERS;
  public tematicas: Tematica[] = TEMATICAS;
  public arrayColors: string[] = COLORS;
  public arrayFonts: Font[] = FONTS;
  public partitura: string = '';

  public searchBarTerm: string = '';
  public keyWordsName: string = '';

  public isOpenDetailsModal: boolean = false;
  public isOpenPDFModal: boolean = false;
  public isOpenColorModal: boolean = false;

  public indice: boolean = false;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private toastController: ToastController,
    private firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private storage: Storage,
    ) {
      this.firebaseService.fieldPath = 'indice';
      this.firebaseService.path = 'hinos';
      this.firebaseService.orderByDirection = 'asc';
  }

  ngOnInit() {
    this.getAll();
    this.getStorage();

    let paramMap = this.activatedRoute.snapshot.paramMap.get('id');

    if (paramMap) {
      isNaN(Number(paramMap))
        ? this.searchFilterTematicaAndAssunto(this.activatedRoute.snapshot.paramMap.get('id') as string)
        : this.getStorageHino();
    }
  }

  private getAll = () =>
    this.hinos$ = this.firebaseService.getAll() as Observable<NovoCantico[]>;

  private getStorage = async () =>
    await this.storage.get('hinosStorage')
      .then(storage => storage !== null ? this.getInitialSearchFilter(storage) : this.setStorage())
      .catch(err => this.messageErrorStorage(err));

  private getStorageHino = async () =>
    await this.storage.get('inicialStorage')
      .then(storage => this.selected(storage.hino))
      .catch(err => this.messageErrorStorage(err));

  private REDUCE_ARRAY = (arr: any) => Object.values(_.reduce(arr, (acc: any, val: any) => {
    (!acc[val])
      ? acc[val] = { "title": val, "quantity": 1 }
      : acc[val]["quantity"]++;

    return acc;
  }, {}))

  private async getInitialSearchFilter(storage: any) {
    this.hinosStorage = storage;

    this.initialSearchFilter.forEach(key =>
      this.addInArrayStorage('searchFilter', key, 'name'));

    this.desactiveAllSearchFilter();
  }

  private setStorage = () =>
    this.storage.set('hinosStorage', this.hinosStorage)
      .then(storage => this.hinosStorage = storage)
      .catch(err => this.messageErrorStorage(err));

  private messageErrorStorage = (err: any) =>
    this.presentToast(this.messageGetStorageError, err);

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
        this.hinosSearch$ = new Observable(observer =>
          observer.next(this.filterInArray(term, hinos, indice)))
        })

  private filterInArray(term: any, hinos: NovoCantico[], indice: boolean = false) {
    hinos.forEach((hino, index) => hinos[index].letra = DECODE_HTML_CHAR_CODES(NORMALIZE_HTML(hino.letra)));

    let arr1 = [];
    let arr2 = [];

    if (!isNaN(term) && !indice) {
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

  public searchBar() {
    if (this.searchBarTerm) {
      this.desactiveAllSearchFilter();
      this.search(this.searchBarTerm.toLowerCase());
    } else {
      this.clearSearch();
    }
  }

  public searchFilter(term: string, index: number) {
    if (!this.hinosStorage.searchFilter[index].active) {
      this.searchBarTerm = '';
      this.search(term.toLowerCase());
    } else {
      this.clearSearch();
    }

    this.toggleActiveSearchFilter(index);
  }

  public searchFilterTematicaAndAssunto(term: string) {
    this.clearSearch();
    this.search(term.toLowerCase(), true);
  }

  public clearSearch = () => {
    this.searchBarTerm = '';
    this.desactiveAllSearchFilter();
    this.hinosSearch$ = new Observable;
  }

  public onInputSearchFilter(event: CustomEvent | any) {
    const value = event.target!.value;
    const filteredValue = value.replace(/[0-9]/,'');
    this.ionInputEl.value = this.keyWordsName = filteredValue;
  }

  public addInSearchFilter() {
    if (this.keyWordsName) {
      this.addInArrayStorage('searchFilter', { name: this.keyWordsName, active: false }, 'name');
    }

    this.keyWordsName = '';
  }

  public addInArrayStorage(arrayName: ArrayName, item: any, key: Key, event?: CustomEvent | any) {
    if ((arrayName !== 'favorites' || event.detail.ratio === 1) && !FIND_IN_ARRAY(this.hinosStorage[arrayName], item, key)) {
      this.hinosStorage[arrayName].unshift(item);
      this.setStorage();
    }
  }

  public removeInArrayStorage(arrayName: ArrayName, item: any, key: Key, event?: CustomEvent | any) {
    if (arrayName === 'recents' || event.detail.ratio === 1) {
      this.hinosStorage[arrayName] = REMOVE_ITEM_ARRAY(this.hinosStorage[arrayName], item, key);
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

  public zooming(event: CustomEvent | any) {
    this.hinosStorage.formatacao.tamanhoFonte = event.detail.value;
    this.setProperty('--letra-font-size', event.detail.value + 'px');
    this.setProperty('--letra-line-height', event.detail.value * 1.5 + 'px');
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

  public setPartitura = (partitura: any) => {
    this.partitura = partitura;
    this.isOpenPDFModal = true;
  };

  public async presentActionSheet(hino: NovoCantico) {
    PARTITURA[0].handler = () => this.setPartitura(hino.partitura);
    PARTITURA[1].handler = () => {};
    PARTITURA[2].handler = () => {
      this.clipboard(hino);
      this.dismissActionSheet()
    }
    PARTITURA[3].handler = () => {
      this.share(hino);
      this.dismissActionSheet();
    }
    let buttons = [];

    buttons = hino.partitura
      ? PARTITURA
      : PARTITURA.filter((a) => a.text !== 'Partitura')

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

  public uniqueArray = (arr: any) => UNIQUE_ARRAY(arr);
}
