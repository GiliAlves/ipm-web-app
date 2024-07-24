import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { IGREJA, PAGES_LIST, PAGES_TAB, PROPOSITO, SOCIAL, TEMA } from './model/shared';
import { Messaging, getToken, onMessage  } from '@angular/fire/messaging';
import { environment } from 'src/environments/environment.prod';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  component = InicioComponent;

  private readonly _env = environment;
  
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

  private _getDeviceToken(): void {
    getToken(this._messaging, { vapidKey: this._env.vapidKey })
      .then((token) => console.log(token))
      .catch((error) => console.log('Token error', error));
  }

  private _onMessage(): void {
    onMessage(this._messaging, {
      next: (payload) => console.log('Message', payload),
      error: (error) => console.log('Message error', error),
      complete: () => console.log('Done listening to messages'),
    });
  }

  public greetingMessage = () => {
    const tempo = new Date().getHours();

    if (tempo <= 5) return 'Boa madrugada';
    if (tempo < 12) return 'Bom dia';
    if (tempo < 18) return 'Boa tarde';

    return 'Boa noite';
  }
}
