import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AntDesignModule } from 'src/app/ant-design.module';
import { RouterModule } from '@angular/router';

// Components
import { CreateFraudeComponent } from './pages/create-fraude/create-fraude.component';


@NgModule({
  declarations: [
    CreateFraudeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AntDesignModule,
    FormsModule,
    RouterModule
  ]
})
export class CreateFraudeModule { }
