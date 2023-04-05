import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ColorPickerModule } from 'ngx-color-picker';
import { SharedModule } from 'src/app/model/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CancioneiroRoutingModule } from './cancioneiro-routing.module';
import { CancioneiroComponent } from './cancioneiro.component';

@NgModule({
  declarations: [
    CancioneiroComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CancioneiroRoutingModule,
    SharedModule,
    PipesModule,
    ColorPickerModule
  ],
  providers: [ FirebaseService ]
})
export class CancioneiroModule { }
