import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { GuardAntifraudeGuard } from './guard-antifraude/guard-antifraude.guard';

// Components
import { AuthAntifraudeComponent } from './auth-antifraude/auth-antifraude/auth-antifraude.component';

const routes: Routes = [
  {
    path: '',
    component: AuthAntifraudeComponent
  },
  {
    path: 'controls',
    canActivate: [GuardAntifraudeGuard], canActivateChild: [GuardAntifraudeGuard],
    loadChildren: () => import('./antifraude/autifraude.module').then( m => m.AutifraudeModule)
  },
  {
    path: 'fraudes',
    canActivate: [GuardAntifraudeGuard], canActivateChild: [GuardAntifraudeGuard],
    loadChildren: () => import('./fraude/fraude.module').then( m => m.FraudeModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AntifraudesRoutingModule { }
