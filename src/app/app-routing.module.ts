import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pastoral',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioModule)
  },
  {
    path: 'pastoral',
    loadChildren: () => import('./pages/pastoral/pastoral.module').then( m => m.PastoralModule)
  },
  {
    path: 'devocional',
    loadChildren: () => import('./pages/devocional/devocional.module').then( m => m.DevocionalModule)
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
    path: 'oracao',
    loadChildren: () => import('./pages/oracao/oracao.module').then( m => m.OracaoModule)
  },
  {
    path: 'calendario',
    loadChildren: () => import('./pages/calendario/calendario.module').then( m => m.CalendarioModule)
  },
  {
    path: 'downloads',
    loadChildren: () => import('./pages/downloads/downloads.module').then( m => m.DownloadsModule)
  },
  {
    path: 'sobre',
    loadChildren: () => import('./pages/sobre/sobre.module').then( m => m.SobreModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
