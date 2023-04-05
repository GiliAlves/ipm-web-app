import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SharedModule } from 'src/app/model/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NovoCanticoRoutingModule } from './novo-cantico-routing.module';
import { NovoCanticoComponent } from './novo-cantico.component';


@NgModule({
  declarations: [
    NovoCanticoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NovoCanticoRoutingModule,
    SharedModule,
    PipesModule,
    PdfViewerModule
  ],
  providers: [ FirebaseService ]
})
export class NovoCanticoModule { }
