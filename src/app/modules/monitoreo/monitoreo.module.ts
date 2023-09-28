import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitoreoRoutingModule } from './monitoreo-routing.module';
import { MonitoreoComponents } from './monitoreo/monitoreo.component';
import { MonitoreoComponent } from './monitoreo.component';
import { DashboardsComponent } from './dashboards/dashboards.component';

import { AntDesignModule } from 'src/app/ant-design.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule } from '@angular/forms';
import { GestionComponent } from './gestion/gestion.component';
import { RecargaComponent } from './recarga/recarga.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ViajesDashboardsComponent } from './viajes-dashboards/viajes-dashboards.component';

@NgModule({
  declarations: [
    MonitoreoComponent,
    MonitoreoComponents,
    DashboardsComponent,
    GestionComponent,
    RecargaComponent,
    ViajesDashboardsComponent
  ],
  imports: [
    CommonModule,
    MonitoreoRoutingModule,
    AntDesignModule,
    NgApexchartsModule,
    FormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ]
})
export class MonitoreoModule { }
