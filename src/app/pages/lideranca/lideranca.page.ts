import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonAvatar,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonRow,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonText
} from '@ionic/angular/standalone';
import { UseLeadershipStore } from '../../presentation/signals/use-leadership.store';

@Component({
  selector: 'app-lideranca',
  templateUrl: './lideranca.page.html',
  styleUrls: ['./lideranca.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonListHeader,
    IonItem,
    IonAvatar,
    IonLabel,
    IonText,
  ],
})
export class LiderancaPage {
  private readonly store = inject(UseLeadershipStore);

  readonly leadership = this.store.leadership;
}
