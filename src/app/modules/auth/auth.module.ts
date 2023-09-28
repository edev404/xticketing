import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth/auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from 'src/app/ant-design.module';
import { LoginComponent } from 'src/app/modules/login/login/login.component';
import { ForgetPasswordComponent } from 'src/app/modules/forget-password/forget-password/forget-password.component';
import { HomeComponent } from 'src/app/modules/home/home/home.component';


@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
  ]
})
export class AuthModule { }
