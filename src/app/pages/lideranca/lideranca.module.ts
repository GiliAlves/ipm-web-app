import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiderancaPageRoutingModule } from './lideranca-routing.module';

import { LiderancaPage } from './lideranca.page';
import { SharedModule } from 'src/app/model/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LiderancaPageRoutingModule
  ],
  declarations: [LiderancaPage]
})
export class LiderancaPageModule {}
