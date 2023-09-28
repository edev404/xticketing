import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/modules/home/home/home.component';
import { LoginComponent } from 'src/app/modules/login/login/login.component';
import { RestorePasswordComponent } from '../restore-password/restore-password/restore-password.component';
import { ForgetPasswordComponent } from '../forget-password/forget-password/forget-password.component';

const routes: Routes = [
  {
    path: "login", 
    component: LoginComponent, 
    loadChildren:() => import('../login/login.module').then(m => m.LoginModule)
  },
  {
    path: "restore/:id", 
    component: RestorePasswordComponent, 
    loadChildren:() => import('../restore-password/restore-password.module').then(m => m.RestorePasswordModule)
  },
  {
    path: "changePassword/first/:userName",
    component: RestorePasswordComponent, 
    loadChildren:() => import('../restore-password/restore-password.module').then(m => m.RestorePasswordModule)
  },
  {
    path: "changePassword/expiration/:userName",
    component: RestorePasswordComponent, 
    loadChildren:() => import('../restore-password/restore-password.module').then(m => m.RestorePasswordModule)
  },
  {
    path: "forget", 
    component: ForgetPasswordComponent, 
    loadChildren:() => import('../forget-password/forget-password.module').then(m => m.ForgetPasswordModule)
  },  
  {
    path:"",
    redirectTo:'/login',
    pathMatch:'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
