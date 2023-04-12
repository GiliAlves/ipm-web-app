import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonDatetime, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { OrderByDirection, Timestamp } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Calendario } from 'src/app/interfaces/calendario.interface';
import { Cantico } from 'src/app/interfaces/cantico.interface';
import { Devocional, Position } from 'src/app/interfaces/devocional.interface';
import { Cargo, Cargos, InicialStorage } from 'src/app/interfaces/inicial.interface';
import { Membro } from 'src/app/interfaces/membros.interface';
import { NovoCantico, Tematica } from 'src/app/interfaces/novo-cantico.interface';
import { Pastoral } from 'src/app/interfaces/pastoral.interface';
import { YouTube } from 'src/app/interfaces/youTube.interface';
import { BIBLIA, HORARIOS, INICIAL_STORAGE, LINKS, MESSAGE_GET_STORAGE_ERROR, RESET_HINO_CANTICO, SOCIAL, TEMATICAS } from 'src/app/model/shared';
import { FirebaseService } from 'src/app/services/firebase.service';
import { YoutubeService } from 'src/app/services/youtube.service';
import { DECODE_HTML_CHAR_CODES, NORMALIZE_HTML } from 'src/utils/utils';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  @ViewChild('popoverCancioneiro') popoverCancioneiro!: any;
  @ViewChild('popoverHino') popoverHino!: any;
  @ViewChild('datetime') datetime!: IonDatetime;

  public pastorais$!: Observable<Pastoral[]>;
  public devocionais$!: Observable<Devocional[]>;
  public calendar$!: Observable<Calendario[]>;
  
  public cantico: Cantico[] = [];
  public hino: NovoCantico[] = [];

  public biblia = BIBLIA;
  public tematicas: Tematica[] = TEMATICAS;
  public inicialStorage: InicialStorage = INICIAL_STORAGE;
  public social = SOCIAL;
  public horarios = HORARIOS;
  public links = LINKS;
  private messageGetStorageError: string = MESSAGE_GET_STORAGE_ERROR;
  
  public date = new Date();
  public calendarDates: string[] = [];
  public searchBarTerm: string = '';
  public scrollTop: boolean = true;
  public isSpinner: boolean = false;
  public isSubmmit: boolean = false;

  constructor(
    private datePipe: DatePipe,
    private firebaseService: FirebaseService,
    private youTubeService: YoutubeService,
    private toastController: ToastController,
    private router: Router,
    private storage: Storage) { }

  async ngOnInit() {
    await this.getStorage();

    this.getVideos();

    this.setFirebase('pastorais');
    this.getAllPastorais();

    this.setFirebase('devocionais');
    this.getAllDevocionais();

    this.setFirebase('eventos', 'dataInicio', 'asc');
    this.getAllCalendar();

    this.setFirebase('membros', 'nome', 'asc');

    if (!this.inicialStorage.diaconos.length)
      this.getWhereMembros('Diácono', 'diaconos');

    if (!this.inicialStorage.pastores.length)
      this.getWhereMembros('Pastor', 'pastores');

    if (!this.inicialStorage.presbiteros.length)
      this.getWhereMembros('Presbítero', 'presbiteros');

    this.calendar$.subscribe(calendar => 
      calendar.forEach(evento => {
        if (evento && evento.dataInicio) {
          let date = this.datePipe.transform(evento.dataInicio.toDate(), 'yyyy-MM-dd')?.toString();
          if (date)
            this.calendarDates.push(date);          
        }
      })
    )
  }

  private setFirebase(path: string, fieldPath: string = 'data', orderByDirection: OrderByDirection = 'desc') {
    this.firebaseService.path = path;
    this.firebaseService.fieldPath = fieldPath;
    this.firebaseService.orderByDirection = orderByDirection;
  }

  private getVideos = () =>
    this.youTubeService.getVideosForChanel()
      .subscribe((youTube: YouTube) => {
        if(youTube && youTube.items.length) {
          this.inicialStorage.videosStorage = youTube;
        }
        this.setStorage();
      });

  private getAllPastorais = () =>
    this.pastorais$ = this.firebaseService.getLimit(6) as Observable<Pastoral[]>;

  private getAllDevocionais = () =>
    this.devocionais$ = this.firebaseService.getLimit(6) as Observable<Devocional[]>;

  private getAllCalendar  = () =>
      this.calendar$ = this.firebaseService.getWhere('dataInicio', '>=', Timestamp.now()) as Observable<Calendario[]>;

  private getWhereMembros = (cargo: Cargo, key: Cargos) =>
    this.firebaseService.getWhere('cargo', '==', cargo).subscribe(membro => {
      this.inicialStorage[key] = membro as Membro[];
      this.setStorage();
    });

  private getStorage = async () =>
    await this.storage.get('inicialStorage')
      .then(storage => storage !== null ? this.inicialStorage = storage : this.setStorage())
      .catch(err => this.messageErrorStorage(err));

  private setStorage = async () =>
    await this.storage.set('inicialStorage', this.inicialStorage)
      .then(storage => this.inicialStorage = storage)
      .catch(err => this.messageErrorStorage(err));

  private messageErrorStorage = (err: any) =>
    this.presentToast(this.messageGetStorageError, err);

  private async presentToast(message: string, duration: number = 200, position: Position = 'top') {
    const toast = await this.toastController.create({ message, duration, position });
    await toast.present();
  }

  public trasformerText = (text: string) => text.replace('|', "\n").replace(/&quot;/g, '"');

  public handleScroll = ($event: CustomEvent) =>
    this.scrollTop = ($event.detail.scrollTop === 0) ? true : false;

  public greetingMessage = () => {
    const tempo = new Date().getHours();

    if (tempo <= 5) return 'Boa madrugada';
    if (tempo < 12) return 'Bom dia';
    if (tempo < 18) return 'Boa tarde';

    return 'Boa noite';
  }

  public resetSearch = () => this.searchBarTerm = '';

  public calendar() {
    console.log(this.datetime.value);
  }

  public searchBar(item: string, path: string, fieldPath: string) {
    switch (item) {
      case 'backspace':
        this.searchBarTerm = this.searchBarTerm.substring(0, this.searchBarTerm.length - 1);
        if (this.searchBarTerm.length < 1) {
          this.hino = [];
          this.inicialStorage.hino = RESET_HINO_CANTICO;

          this.cantico = [];
          this.inicialStorage.cantico  = RESET_HINO_CANTICO;
        }
        break;

      case 'arrow-forward':
        if (this.searchBarTerm && this.isSubmmit) {
          this.popoverHino.dismiss();
          this.popoverCancioneiro.dismiss();
          this.hino = [];
          this.cantico = [];
          this.router.navigate([`/${path === 'hinos' ? 'novo-cantico' : 'cancioneiro'}/${this.searchBarTerm}`]);
          this.resetSearch();
        }
        break;

      default:
        if (this.searchBarTerm.length < 3) {
          this.searchBarTerm += item;
          this.searchBarTerm = this.searchBarTerm.replace(/^[0]+$/i, '');
          this.isSpinner = true;

          setTimeout(() => {
            this.setFirebase(path, fieldPath, 'asc');
            this.firebaseService.getWhere('numero', '==', this.searchBarTerm).subscribe(value => {
              this.isSubmmit = true;
              this.isSpinner = false;

              switch (path) {
                case 'hinos':
                  this.hino = value as NovoCantico[];
                  this.hino.forEach((hino, index) => this.hino[index].letra = DECODE_HTML_CHAR_CODES(NORMALIZE_HTML(hino.letra)));
                  this.inicialStorage.hino = this.hino[0];
                  this.setStorage();
                  break;

                case 'canticos':
                  this.cantico = value as Cantico[];
                  this.cantico.forEach((cantico, index) => this.cantico[index].letra = DECODE_HTML_CHAR_CODES(NORMALIZE_HTML(cantico.letra)));
                  this.inicialStorage.cantico = this.cantico[0];
                  this.setStorage();
                  break;
              }
            });
          }, 1500);
        }
        break;
    }
  }
}

