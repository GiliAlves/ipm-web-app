import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.component').then(m => m.InicioComponent)
  },
  {
    path: 'biblia',
    loadChildren: () => import('./pages/biblia/biblia.routes').then(m => m.BIBLIA_ROUTES)
  },
  {
    path: 'boletim',
    loadChildren: () => import('./pages/boletim/boletim.routes').then(m => m.BOLETIM_ROUTES)
  },
  {
    path: 'novo-cantico',
    loadComponent: () => import('./pages/novo-cantico/novo-cantico.component').then(m => m.NovoCanticoComponent)
  },
  {
    path: 'cancioneiro',
    loadComponent: () => import('./pages/cancioneiro/cancioneiro.component').then(m => m.CancioneiroComponent)
  },
  {
    path: 'lideranca',
    loadComponent: () => import('./pages/lideranca/lideranca.page').then(m => m.LiderancaPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage)
  },
  {
    path: 'sobre',
    loadComponent: () => import('./pages/sobre/sobre.component').then(m => m.SobreComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.page').then(m => m.CadastroPage)
  }
];
