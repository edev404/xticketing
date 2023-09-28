import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from 'src/app/modules/login/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from 'src/app/ant-design.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AntDesignModule,
    RouterModule
  ]
})
export class LoginModule { }
