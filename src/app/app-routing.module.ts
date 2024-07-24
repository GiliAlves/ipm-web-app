import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioModule)
  },
  {
    path: 'biblia',
    loadChildren: () => import('./pages/biblia/biblia.module').then( m => m.BibliaPageModule)
  },
  {
    path: 'boletim',
    loadChildren: () => import('./pages/boletim/boletim.module').then( m => m.BoletimPageModule)
  },
  {
    path: 'novo-cantico',
    loadChildren: () => import('./pages/novo-cantico/novo-cantico.module').then( m => m.NovoCanticoModule)
  },
  {
    path: 'cancioneiro',
    loadChildren: () => import('./pages/cancioneiro/cancioneiro.module').then( m => m.CancioneiroModule)
  },
  {
    path: 'lideranca',
    loadChildren: () => import('./pages/lideranca/lideranca.module').then( m => m.LiderancaPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'sobre',
    loadChildren: () => import('./pages/sobre/sobre.module').then( m => m.SobreModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'cadastro',
    loadChildren: () => import('./pages/cadastro/cadastro.module').then( m => m.CadastroPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'lideranca',
    loadChildren: () => import('./pages/lideranca/lideranca.module').then( m => m.LiderancaPageModule)
  },
  {
    path: 'biblia',
    loadChildren: () => import('./pages/biblia/biblia.module').then( m => m.BibliaPageModule)
  },
  {
    path: 'boletim',
    loadChildren: () => import('./pages/boletim/boletim.module').then( m => m.BoletimPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
