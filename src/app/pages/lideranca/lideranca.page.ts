import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Cargo, Cargos, InicialStorage } from 'src/app/interfaces/inicial.interface';
import { Membro } from 'src/app/interfaces/membro.interface';
import { INICIAL_STORAGE, MESSAGE_GET_STORAGE_ERROR } from 'src/app/model/shared';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Position } from '../cancioneiro/cancioneiro';

@Component({
  selector: 'app-lideranca',
  templateUrl: './lideranca.page.html',
  styleUrls: ['./lideranca.page.scss'],
})
export class LiderancaPage implements OnInit {
  public inicialStorage: InicialStorage = INICIAL_STORAGE;
  private messageGetStorageError: string = MESSAGE_GET_STORAGE_ERROR;
  
  constructor(
    private firebaseService: FirebaseService, 
    private toastController: ToastController,
    private storage: Storage
  ) { }

  async ngOnInit() {
    await this.getStorage();

    this.getWhereMembros('Diácono', 'diaconos');
    this.getWhereMembros('Pastor', 'pastores');
    this.getWhereMembros('Presbítero', 'presbiteros');
  }

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

}
