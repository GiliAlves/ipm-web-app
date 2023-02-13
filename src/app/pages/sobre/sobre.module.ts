import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SharedModule } from 'src/app/components/shared.module';
import { SobreService } from 'src/app/services/sobre.service';
import { SobreRoutingModule } from './sobre-routing.module';
import { SobreComponent } from './sobre.component';


@NgModule({
  declarations: [SobreComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SobreRoutingModule,
    SharedModule,
    LazyLoadImageModule
  ],
  providers: [SobreService]
})
export class SobreModule { }
