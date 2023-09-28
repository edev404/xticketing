import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { AntDesignModule } from 'src/app/ant-design.module';
import { AntifraudesRoutingModule } from './antifraudes-routing.module';

// Components
import { AntifraudesHomeComponent } from './antifraudes-home.component';
import { AuthAntifraudeComponent } from './auth-antifraude/auth-antifraude/auth-antifraude.component';

@NgModule({
  declarations: [
    AntifraudesHomeComponent,
    AuthAntifraudeComponent
  ],
  imports: [
    CommonModule,
    AntifraudesRoutingModule,
    AntDesignModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AntifraudesModule { }
