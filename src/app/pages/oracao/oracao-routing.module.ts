import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OracaoComponent } from './oracao.component';

const routes: Routes = [
  {
    path: '',
    component: OracaoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OracaoRoutingModule { }
