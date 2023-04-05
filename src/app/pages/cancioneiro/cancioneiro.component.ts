import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { IonInput, IonModal, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { distinctUntilChanged, first, Observable } from 'rxjs';
import { Cantico } from 'src/app/interfaces/cantico.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FIND_IN_ARRAY, DECODE_HTML_CHAR_CODES, NORMALIZE_HTML, REMOVE_FIRST_FROM_ARRAY, REMOVE_ITEM_ARRAY, SIZE_ARRAY, UNIQUE_ARRAY } from 'src/utils/utils';

export interface KeyWord {
  name: string;
  active: boolean
}

export interface CanticoStorage {
  searchFilter: KeyWord[],
  recents: Cantico[],
  favorites: Cantico[]
}

export type ArrayName = 'searchFilter' | 'recents' | 'favorites';
export type Key = 'name' | 'numero';
export type Position = 'top' | 'middle' | 'bottom'

@Component({
  selector: 'app-cancioneiro',
  templateUrl: './cancioneiro.component.html',
  styleUrls: ['./cancioneiro.component.scss'],
})
export class CancioneiroComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('letra') letra!: ElementRef;
  @ViewChild('ionInputEl') ionInputEl!: IonInput;

  private messageGetStorageError: string = 'Erro ao obter dados armazenados: ';

  public canticos$: Observable<Cantico[]> = new Observable<Cantico[]>;
  public canticosSearch$!: Observable<Cantico[]>;
  public cantico!: Cantico;
  public canticosStorage: CanticoStorage = {
    searchFilter: [],
    recents: [],
    favorites: [],
  };

  public initialSearchFilter: KeyWord[] = [
    {
      name: 'Jesus',
      active: false
    },
    {
      name: 'Amor',
      active: false
    },
    {
      name: 'Alegria',
      active: false
    }
  ];

  public arrayColors: any = { color1: '#005B40' };
  public selectedColor: string = 'color1';
  public fontSize: number = 12;

  public searchBarTerm: string = '';
  public keyWordsName: string = '';

  public isOpenDetailsModal: boolean = false;
  public isDarkColor: boolean = false;
  public isSpinner: boolean = false;

  constructor(
    private toastController: ToastController,
    private firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private storage: Storage) {
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
            observer.next(this.filterInArray(term, cantico))))

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
    if (this.searchBarTerm) {
      this.desactiveAllSearchFilter();
      this.search(this.searchBarTerm.toLowerCase());
    } else {
      this.canticosSearch$ = new Observable;
    }
  }

  public searchFilter(term: string, index: number) {
    if (!this.canticosStorage.searchFilter[index].active) {
      this.searchBarTerm = '';
      this.search(term.toLowerCase());
    } else {
      this.canticosSearch$ = new Observable;
    }

    this.toggleActiveSearchFilter(index);
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

  public toggleDetailsModal = () => this.isOpenDetailsModal = !this.isOpenDetailsModal;

  public toggleBackground = () => this.isDarkColor = !this.isDarkColor;

  public selected = (cantico: Cantico) => {
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

  public share = async (cantico: Cantico) => await Share
    .share({
      title: cantico.titulo,
      text: '*' + cantico.numero + ' ・ ' + cantico.titulo.toUpperCase() + '*' + '\n\n' + this.cantico.letra,
      dialogTitle: cantico.titulo
    })

  public zooming(event: CustomEvent | any) {
    this.fontSize = event.detail.value;
    document.documentElement.style.setProperty('--letra-font-size', event.detail.value + 'px');
    document.documentElement.style.setProperty('--letra-line-height', event.detail.value * 1.5 + 'px');
  }

  public changeColor(color: any) {
    document.documentElement.style.setProperty('--letra-color', color);
  }

  public changeBackground(){
    this.toggleBackground();
    let systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    // systemDark.addListener(this.colorTest(systemDark));

    (this.isDarkColor)
      ? document.body.setAttribute('data-theme', 'dark')
      : document.body.setAttribute('data-theme', 'light');
  }

  public colorTest(systemInitiatedDark: any) {
    (systemInitiatedDark.matches)
      ? document.body.setAttribute('data-theme', 'dark')
      : document.body.setAttribute('data-theme', 'light');
  }

  public pinFormatter = (value: number) => `${value}px`;
}
