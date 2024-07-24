import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoletimResolver } from 'src/app/rosolvers/boletim.resolver';
import { BoletimDetailPage } from './boletim-detail/boletim-detail.page';
import { BoletimPage } from './boletim.page';

const routes: Routes = [
  {
    path: '',
    component: BoletimPage
  },
  {
    path: ':id',
    component: BoletimDetailPage,
    resolve: { boletim: BoletimResolver }
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoletimPageRoutingModule {}
