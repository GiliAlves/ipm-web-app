import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SharedModule } from 'src/app/components/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { PastoralService } from 'src/app/services/pastoral.service';
import { PastoralRoutingModule } from './pastoral-routing.module';
import { PastoralComponent } from './pastoral.component';


@NgModule({
  declarations: [PastoralComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PastoralRoutingModule,
    SharedModule,
    PipesModule,
    LazyLoadImageModule
  ],
  providers: [PastoralService]
})
export class PastoralModule { }
