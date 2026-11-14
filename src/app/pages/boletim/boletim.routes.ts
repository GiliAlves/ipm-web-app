import { Routes } from '@angular/router';
import { boletimResolver } from '../../rosolvers/boletim.resolver';

export const BOLETIM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./boletim.page').then(m => m.BoletimPage),
  },
  {
    path: ':id',
    loadComponent: () => import('./boletim-detail/boletim-detail.page').then(m => m.BoletimDetailPage),
    resolve: { boletim: boletimResolver },
  },
];
