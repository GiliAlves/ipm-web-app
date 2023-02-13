import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CancioneiroService } from 'src/app/services/cancioneiro.service';
import { CancioneiroRoutingModule } from './cancioneiro-routing.module';
import { CancioneiroComponent } from './cancioneiro.component';


@NgModule({
  declarations: [CancioneiroComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CancioneiroRoutingModule,
    SharedModule,
    PipesModule
  ],
  providers: [CancioneiroService]
})
export class CancioneiroModule { }
