import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DevocionalService } from 'src/app/services/devocional.service';
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
  providers: [DevocionalService]
})
export class DevocionalModule { }
