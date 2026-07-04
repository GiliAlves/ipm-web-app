import { Routes } from '@angular/router';
import { livroResolver } from '../../rosolvers/livro.resolver';

export const BIBLIA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./biblia.page').then(m => m.BibliaPage),
  },
  {
    path: ':livro',
    loadComponent: () => import('./livro/livro.page').then(m => m.LivroPage),
    resolve: { biblia: livroResolver },
  },
];
