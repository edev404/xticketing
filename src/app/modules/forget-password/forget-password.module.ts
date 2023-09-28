import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgetPasswordRoutingModule } from './forget-password-routing.module';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from 'src/app/ant-design.module';


@NgModule({
  declarations: [
    ForgetPasswordComponent,
  ],
  imports: [
    CommonModule,
    ForgetPasswordRoutingModule,
    ReactiveFormsModule,
    AntDesignModule
  ]
})
export class ForgetPasswordModule { }
