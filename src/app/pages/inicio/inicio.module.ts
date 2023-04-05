import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/model/shared.module';
import { FirebaseService } from 'src/app/services/firebase.service';
import { YoutubeService } from 'src/app/services/youtube.service';
import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './inicio.component';


@NgModule({
  declarations: [InicioComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioRoutingModule,
    SharedModule,

  ],
  providers: [
    YoutubeService,
    FirebaseService
  ]
})
export class InicioModule { }
