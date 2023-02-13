import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NovoCanticoService } from 'src/app/services/novo-cantico.service';
import { NovoCanticoRoutingModule } from './novo-cantico-routing.module';
import { NovoCanticoComponent } from './novo-cantico.component';


@NgModule({
  declarations: [NovoCanticoComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NovoCanticoRoutingModule,
    SharedModule,
    PipesModule
  ],
  providers: [NovoCanticoService]
})
export class NovoCanticoModule { }
