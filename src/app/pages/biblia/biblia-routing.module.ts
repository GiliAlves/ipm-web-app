import { query } from 'firebase/firestore';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BibliaPage } from './biblia.page';
import { LivroResolver } from 'src/app/rosolvers/livro.resolver';
import { LivroPage } from './livro/livro.page';

const routes: Routes = [
  {
    path: '',
    component: BibliaPage
  },
  {
    path: ':livro',
    component: LivroPage,
    resolve: { biblia: LivroResolver },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BibliaPageRoutingModule {}
