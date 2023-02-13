import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CalendarioService } from 'src/app/services/calendario.service';
import { SharedModule } from '../../components/shared.module';
import { CalendarioRoutingModule } from './calendario-routing.module';
import { CalendarioComponent } from './calendario.component';


@NgModule({
  declarations: [CalendarioComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarioRoutingModule,
    SharedModule
  ],
  providers: [CalendarioService]
})
export class CalendarioModule { }
