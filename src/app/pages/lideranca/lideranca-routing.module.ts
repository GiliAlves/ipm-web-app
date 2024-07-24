import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiderancaPage } from './lideranca.page';

const routes: Routes = [
  {
    path: '',
    component: LiderancaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiderancaPageRoutingModule {}
