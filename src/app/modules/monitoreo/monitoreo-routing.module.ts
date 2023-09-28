import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonitoreoComponent } from './monitoreo.component';
import { MonitoreoComponents } from './monitoreo/monitoreo.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { GestionComponent } from './gestion/gestion.component';

const routes: Routes = [
  {
    path: '',
    component: MonitoreoComponent,
  },
  {
    path: 'dashboards',
    component: DashboardsComponent,
  },
  {
    path: 'alarma',
    component: MonitoreoComponents,
  },
  {
    path: 'gestion',
    component: GestionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoreoRoutingModule { }
