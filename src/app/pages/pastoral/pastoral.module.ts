import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SharedModule } from 'src/app/model/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StorageService } from 'src/app/services/storage.service';
import { PastoralRoutingModule } from './pastoral-routing.module';
import { PastoralComponent } from './pastoral.component';


@NgModule({
  declarations: [PastoralComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PastoralRoutingModule,
    SharedModule,
    PipesModule,
    LazyLoadImageModule
  ],
  providers: [
    FirebaseService,
    StorageService,
    DatePipe
  ]
})
export class PastoralModule { }
