import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BibliaPageRoutingModule } from './biblia-routing.module';

import { SharedModule } from 'src/app/model/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { BibliaPage } from './biblia.page';
import { LivroPage } from './livro/livro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PipesModule,
    BibliaPageRoutingModule
  ],
  declarations: [BibliaPage, LivroPage]
})
export class BibliaPageModule {}
