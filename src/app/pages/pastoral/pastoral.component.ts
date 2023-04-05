import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { ActionSheetController, IonContent, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Position } from 'src/app/interfaces/devocional.interface';
import { Pastoral } from 'src/app/interfaces/pastoral.interface';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-pastoral',
  templateUrl: './pastoral.component.html',
  styleUrls: ['./pastoral.component.scss'],
})
export class PastoralComponent implements OnInit {
  @ViewChild(IonContent) content!: IonContent;

  public pastorais$!: Observable<Pastoral[]>;
  public pastoral!: Pastoral;
  public isModalOpen = false;
  public isScrollTop: boolean = true;
  public defaultImage = '../../../assets/logo_lazy.png';

  constructor(
    private datePipe: DatePipe,
    private firebaseService: FirebaseService,
    private toastController: ToastController,
    private actionSheetCtrl: ActionSheetController) {
    this.firebaseService.fieldPath = 'data';
    this.firebaseService.path = 'pastorais';
    this.firebaseService.orderByDirection = 'desc';
  }

  ngOnInit() {
    this.filterPastorais();
  }

  private filterPastorais = () =>
    this.pastorais$ = this.getAllPastorais();

  private getAllPastorais = () => this.firebaseService.getAll() as Observable<Pastoral[]>;

  private async presentToast(message: string, duration: number = 200, position: Position = 'top') {
    const toast = await this.toastController.create({ message, duration, position });
    await toast.present();
  }

  public toggleModal = () => this.isModalOpen = !this.isModalOpen;

  public openModal(pastoral: Pastoral) {
    this.toggleModal();
    this.pastoral = pastoral;
  }

  public scrollToTop = () =>
    this.content.scrollToTop(500);

  public handleScroll = ($event: CustomEvent) =>
    this.isScrollTop = ($event.detail.scrollTop === 0) ? true : false;

    public clipboard = async (pastoral: Pastoral) => await Clipboard
    .write({ string: pastoral.titulo.toUpperCase() + '\n\n' + this.pastoral.descricao })
    .then(() => {
      this.presentToast(`${pastoral.titulo} copiado`);
      this.dismissActionSheet();
    })

  public share = async (pastoral: Pastoral) => await Share
    .share({
      title: pastoral.titulo,
      text: '*' + pastoral.titulo.toUpperCase() + '*' + '\n\n' + pastoral.destaque + '\n\n' +  pastoral.descricao,
      dialogTitle: pastoral.titulo
    }).then(() => this.dismissActionSheet())

  public async presentActionSheet(pastoral: Pastoral) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: pastoral.autor,
      subHeader: this.datePipe.transform(pastoral.data, 'dd/MM/yyyy')?.toString(),
      translucent: true,
      mode: 'ios',
      buttons: [{
        icon: "copy-outline",
        text: "Copiar pastoral",
        handler: () => this.clipboard(pastoral),
      },
      {
        icon: "share-social",
        text: "Compartilhar pastoral",
        handler: () => this.share(pastoral),
      },
      {
        text: 'Cancelar',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

  public dismissActionSheet = async () => await this.actionSheetCtrl.dismiss();
}
