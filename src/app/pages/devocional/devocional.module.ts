import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { FirebaseService } from './../../services/firebase.service';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/model/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DevocionalRoutingModule } from './devocional-routing.module';
import { DevocionalComponent } from './devocional.component';


@NgModule({
  declarations: [DevocionalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevocionalRoutingModule,
    SharedModule,
    PipesModule
  ],
  providers: [
    FirebaseService,
    StorageService,
    DatePipe
  ]
})
export class DevocionalModule { }
