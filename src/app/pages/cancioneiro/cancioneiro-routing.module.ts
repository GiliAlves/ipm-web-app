import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CancioneiroComponent } from './cancioneiro.component';

const routes: Routes = [
  {
    path: '',
    component: CancioneiroComponent
  },
  {
    path: ':id',
    component: CancioneiroComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancioneiroRoutingModule { }
