import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevocionalComponent } from './devocional.component';

const routes: Routes = [
  {
    path: '',
    component: DevocionalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevocionalRoutingModule { }
