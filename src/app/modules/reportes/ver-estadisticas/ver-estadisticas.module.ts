import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerEstadisticasRoutingModule } from './ver-estadisticas-routing.module';
import { VerEstadisticasComponent } from './ver-estadisticas/ver-estadisticas.component';
import { AntDesignModule } from 'src/app/ant-design.module';
import { SafePipe } from '../pipes/safe.pipe';


@NgModule({
  declarations: [
    VerEstadisticasComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    AntDesignModule,
    VerEstadisticasRoutingModule
  ]
})
export class VerEstadisticasModule { }
