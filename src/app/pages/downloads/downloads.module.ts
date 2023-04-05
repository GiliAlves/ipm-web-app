import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/model/shared.module';

import { DownloadsRoutingModule } from './downloads-routing.module';
import { DownloadsComponent } from './downloads.component';


@NgModule({
  declarations: [DownloadsComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadsRoutingModule,
    SharedModule
  ],
  providers: []
})
export class DownloadsModule { }
