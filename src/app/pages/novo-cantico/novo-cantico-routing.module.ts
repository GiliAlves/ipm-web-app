import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NovoCanticoComponent } from './novo-cantico.component';

const routes: Routes = [
  {
    path: '',
    component: NovoCanticoComponent
  },
  {
    path: ':id',
    component: NovoCanticoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NovoCanticoRoutingModule { }
