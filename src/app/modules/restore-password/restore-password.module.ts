import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestorePasswordRoutingModule } from './restore-password-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from 'src/app/ant-design.module';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { RestorePasswordComponent } from './restore-password/restore-password.component';


@NgModule({
  declarations: [
    RestorePasswordComponent
  ],
  imports: [
    CommonModule,
    RestorePasswordRoutingModule,
    ReactiveFormsModule,
    AntDesignModule
  ]
})
export class RestorePasswordModule { }
