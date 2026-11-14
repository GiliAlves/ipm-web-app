import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonProgressBar,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgTemplateOutlet,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonLabel,
    IonNote,
    IonButton,
    IonIcon,
    IonProgressBar,
    IonFooter,
    IonItem,
    IonInput,
    IonRadioGroup,
    IonRadio,
    IonSelect,
    IonSelectOption,
  ],
})
export class CadastroPage {
  readonly index = signal(1);

  prevStep = () => this.index.update(value => Math.max(1, value - 1));
  nextStep = () => this.index.update(value => Math.min(5, value + 1));
}
