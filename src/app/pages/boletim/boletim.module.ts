import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoletimPageRoutingModule } from './boletim-routing.module';

import { BoletimPage } from './boletim.page';
import { BoletimDetailPage } from './boletim-detail/boletim-detail.page';
import { SharedModule } from 'src/app/model/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PipesModule,
    BoletimPageRoutingModule
  ],
  declarations: [BoletimPage, BoletimDetailPage]
})
export class BoletimPageModule {}
