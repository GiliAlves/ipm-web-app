import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PastoralComponent } from './pastoral.component';

const routes: Routes = [
  {
    path: '',
    component: PastoralComponent
  },
  {
    path: ':id',
    component: PastoralComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PastoralRoutingModule { }
