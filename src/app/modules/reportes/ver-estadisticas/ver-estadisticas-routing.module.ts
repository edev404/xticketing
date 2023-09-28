import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerEstadisticasComponent } from './ver-estadisticas/ver-estadisticas.component';

const routes: Routes = [
  {
    path: ':id', 
    component: VerEstadisticasComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerEstadisticasRoutingModule { }
