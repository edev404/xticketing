import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './guard/auth-guard.service';
import { AuthComponent } from './modules/auth/auth/auth.component';
import { MainComponent } from './modules/main/main/main.component';
import { MainGuardService } from './guard/main-guard.service';

const routes: Routes = [
  {
    path: "",
    component: AuthComponent,
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
    canActivate: [MainGuardService]
  },
  {
    path: "main",
    component: MainComponent,
    loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule),
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
