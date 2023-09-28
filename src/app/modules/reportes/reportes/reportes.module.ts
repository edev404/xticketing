import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportesOperacionRedComercializacionComponent } from './reportes-operacion-red-comercializacion/reportes-operacion-red-comercializacion.component';
import { ReportesOperativosUsuarioComponent } from './reportes-operativos-usuario/reportes-operativos-usuario.component';
import { ReportesOperativosVehiculosConductoresComponent } from './reportes-operativos-vehiculos-conductores/reportes-operativos-vehiculos-conductores.component';
import { RouterComponent } from './reportes.component';
import { AntDesignModule } from 'src/app/ant-design.module';
import { ReportesRedValidacionComponent } from './reportes-red-validacion/reportes-red-validacion.component';
import { ReportesClearingComponent } from './reportes-clearing/reportes-clearing.component';
import { FormsModule } from '@angular/forms';
import { ReportesServiciosComponent } from './reportes-servicios/reportes-servicios.component';
import { ReportesPqrsComponent } from './reportes-pqrs/reportes-pqrs.component';

const COMPONENTES = [
  ReportesClearingComponent,
  ReportesOperacionRedComercializacionComponent,
  ReportesOperativosUsuarioComponent,
  ReportesOperativosVehiculosConductoresComponent,
  ReportesRedValidacionComponent,
  RouterComponent,
  ReportesServiciosComponent
]

@NgModule({
  declarations: [
    ...COMPONENTES,
    ReportesPqrsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReportesRoutingModule,
    AntDesignModule,
    SharedModule
  ]
})
export class ReportesModule { }
