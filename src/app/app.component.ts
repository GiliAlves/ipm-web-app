import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import {
  IonApp,
  IonAvatar,
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonNav,
  IonNote,
  IonRow,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToolbar,
} from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment.prod';
import { StorageService } from 'src/app/services/storage.service';
import { IGREJA, PAGES_LIST, PAGES_TAB, PROPOSITO, SOCIAL, TEMA } from './model/shared';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonApp,
    IonNav,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonItem,
    IonAvatar,
    IonLabel,
    IonNote,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonIcon,
    IonFooter,
    IonButton,
  ],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
/**
 * Componente raiz do aplicativo.
 *
 * Responsável por configurar a navegação, as informações institucionais,
 * o registro do service worker de mensagens e a obtenção do token FCM.
 */
export class AppComponent implements OnInit {
  private readonly _env = environment;
  
  /** Indica se a navegação em abas deve ser exibida. */
  public isTab = true;
  public igreja = IGREJA;
  public pagesList = PAGES_LIST;
  public pagesTab = PAGES_TAB;
  public social = SOCIAL;
  public proposito = PROPOSITO;
  public tema = TEMA;

  public icons = [
    { name: 'code-slash', color: 'success' },
    { name: 'fitness-outline', color: 'danger' },
    { name: 'barbell-outline', color: 'dark' },
    { name: 'cafe-outline', color: 'secondary'},
    { name: 'bug-outline', color: 'warning'}
  ];

  constructor(
    private storageService: StorageService, 
    private readonly _messaging: Messaging
  ) {
    this.storageService.create();
    this.storageService.clear();
  }

  /**
   * Inicializa o registro do service worker de mensagens e solicita o token FCM.
   */
  ngOnInit() {
    // console.log(location.pathname !== '/login');
    
    // this.isTab = location.pathname !== '/login';
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('../firebase-messaging-sw.js')
          .then(function (registration) {
              console.log('Registration successful, scope is:', registration.scope);
          }).catch(function (err) {
              console.log('Service worker registration failed, error:', err);
          });
    }
    this._getDeviceToken();
    this._onMessage();
  }

  /**
   * Solicita o token de dispositivo para notificações push.
   */
  private _getDeviceToken(): void {
    getToken(this._messaging, { vapidKey: this._env.vapidKey })
      .then((token) => console.log(token))
      .catch((error) => console.log('Token error', error));
  }

  /**
   * Escuta mensagens push recebidas em primeiro plano.
   */
  private _onMessage(): void {
    onMessage(this._messaging, {
      next: (payload) => console.log('Message', payload),
      error: (error) => console.log('Message error', error),
      complete: () => console.log('Done listening to messages'),
    });
  }

  /**
   * Retorna uma saudação de acordo com o horário atual.
   * @returns Saudação em português (`Bom dia`, `Boa tarde`, etc.).
   */
  public greetingMessage = () => {
    const tempo = new Date().getHours();

    if (tempo <= 5) return 'Boa madrugada';
    if (tempo < 12) return 'Bom dia';
    if (tempo < 18) return 'Boa tarde';

    return 'Boa noite';
  }
}
