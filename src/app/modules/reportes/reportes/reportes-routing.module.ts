import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterComponent } from './reportes.component';
import { ReportesOperacionRedComercializacionComponent } from './reportes-operacion-red-comercializacion/reportes-operacion-red-comercializacion.component';
import { ReportesOperativosUsuarioComponent } from './reportes-operativos-usuario/reportes-operativos-usuario.component';
import { ReportesOperativosVehiculosConductoresComponent } from './reportes-operativos-vehiculos-conductores/reportes-operativos-vehiculos-conductores.component';
import { ReportesClearingComponent } from './reportes-clearing/reportes-clearing.component';
import { ReportesRedValidacionComponent } from './reportes-red-validacion/reportes-red-validacion.component';
import { ReportesServiciosComponent } from './reportes-servicios/reportes-servicios.component';
import { ReportesPqrsComponent } from './reportes-pqrs/reportes-pqrs.component';

const routes: Routes = [
  {
    path: '',
    component: RouterComponent,
    children: [
      {
        path: '1',
        component: ReportesClearingComponent
      },
      {
        path: '2',
        component: ReportesOperacionRedComercializacionComponent
      },
      {
        path: '3',
        component: ReportesOperativosUsuarioComponent
      },
      {
        path: '4',
        component: ReportesOperativosVehiculosConductoresComponent
      },
      {
        path: '5',
        component: ReportesRedValidacionComponent
      },
      {
        path: '6',
        component: ReportesServiciosComponent
      },
      {
        path: '7',
        component: ReportesPqrsComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '1'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
