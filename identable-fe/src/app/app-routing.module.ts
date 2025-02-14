import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    data: { title: 'Auth Module' },
  },  
  // MODULES
  {
    path: '',
    loadChildren: () =>
      import('./modules/modules.module').then((m) => m.ModulesModule),
    data: { title: 'Modules' },
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
