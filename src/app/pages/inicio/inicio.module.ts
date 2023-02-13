import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared.module';
import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './inicio.component';


@NgModule({
  declarations: [InicioComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioRoutingModule,
    SharedModule
  ]
})
export class InicioModule { }
