import { Component, OnInit, ViewChild } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { ActionSheetController, IonContent, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Devocional, Position } from 'src/app/interfaces/devocional.interface';
import { SOCIAL } from 'src/app/model/shared';
import { FirebaseService } from 'src/app/services/firebase.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-devocional',
  templateUrl: './devocional.component.html',
  styleUrls: ['./devocional.component.scss'],
})
export class DevocionalComponent implements OnInit {
  @ViewChild(IonContent) content!: IonContent;

  public devocionais$!: Observable<Devocional[]>;
  public devocional!: Devocional;
  public isModalOpen = false;
  public isScrollTop: boolean = true;
  public social = SOCIAL;

  constructor(
    private datePipe: DatePipe,
    private firebaseService: FirebaseService,
    private toastController: ToastController,
    private actionSheetCtrl: ActionSheetController) {
    this.firebaseService.fieldPath = 'data';
    this.firebaseService.path = 'devocionais';
    this.firebaseService.orderByDirection = 'desc';
  }

  ngOnInit() {
    this.filterDevocionais();

  }
  private filterDevocionais = () =>
    this.devocionais$ = this.getAllDevocionais();

  private getAllDevocionais = () => this.firebaseService.getAll() as Observable<Devocional[]>;

  public toggleModal = () => this.isModalOpen = !this.isModalOpen;

  private async presentToast(message: string, duration: number = 200, position: Position = 'top') {
    const toast = await this.toastController.create({ message, duration, position });
    await toast.present();
  }

  public openModal(pastoral: Devocional) {
    this.toggleModal();
    this.devocional = pastoral;
  }

  public scrollToTop = () =>
    this.content.scrollToTop(500);

  public handleScroll = ($event: CustomEvent) =>
    this.isScrollTop = ($event.detail.scrollTop === 0) ? true : false;

  public clipboard = async (devocional: Devocional) => await Clipboard
    .write({ string: devocional.titulo.toUpperCase() + '\n\n' + this.devocional.descricao })
    .then(() => {
      this.presentToast(`${devocional.titulo} copiado`);
      this.dismissActionSheet();
    })

  public share = async (devocional: Devocional) => await Share
    .share({
      title: devocional.titulo,
      text: '*' + devocional.titulo.toUpperCase() + '*' + '\n\n' + devocional.destaque + '\n\n' +  devocional.descricao,
      dialogTitle: devocional.titulo
    }).then(() => this.dismissActionSheet())

  public async presentActionSheet(devocional: Devocional) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: devocional.autor,
      subHeader: this.datePipe.transform(devocional.data, 'dd/MM/yyyy')?.toString(),
      translucent: true,
      mode: 'ios',
      buttons: [{
        icon: "copy-outline",
        text: "Copiar Devocional",
        handler: () => this.clipboard(devocional),
      },
      {
        icon: "share-social",
        text: "Compartilhar Devocional",
        handler: () => this.share(devocional),
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
