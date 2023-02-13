import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared.module';
import { OracaoService } from 'src/app/services/oracao.service';
import { OracaoRoutingModule } from './oracao-routing.module';
import { OracaoComponent } from './oracao.component';


@NgModule({
  declarations: [OracaoComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OracaoRoutingModule,
    SharedModule
  ],
  providers: [OracaoService]
})
export class OracaoModule { }
