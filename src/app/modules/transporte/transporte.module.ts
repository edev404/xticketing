import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransporteRoutingModule } from './transporte-routing.module';
import { TransporteComponent } from './transporte/transporte.component';
import { AntDesignModule } from 'src/app/ant-design.module';
import { TransportComponent } from './transporte/transport/transport.component';
import { TransfersComponent } from './transporte/transfers/transfers.component';
import { TransfersReportsComponent } from './transporte/transfers-reports/transfers-reports.component';
import { ViewCollectionComponent } from './transporte/view-collection/view-collection.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollectComponent } from './transporte/view-collection/collect/collect.component';
import { PartialCollectComponent } from './transporte/view-collection/partial-collect/partial-collect.component';
import { ReportsCollectionComponent } from './transporte/view-collection/reports-collection/reports-collection.component';
import { TravelAnalysisComponent } from './transporte/view-collection/travel-analysis/travel-analysis.component';
import { OutstandingBalanceComponent } from './transporte/view-collection/outstanding-balance/outstanding-balance.component';
import { RegisterCollectionComponent } from './transporte/view-collection/register-collection/register-collection.component';
import { NgChartsModule, NgChartsConfiguration } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { VehicleComponent } from './transporte/vehicle/vehicle.component';


@NgModule({
  declarations: [
    TransporteComponent,
    TransportComponent,
    TransfersComponent,
    TransfersReportsComponent,
    ViewCollectionComponent,
    CollectComponent,
    PartialCollectComponent,
    ReportsCollectionComponent,
    TravelAnalysisComponent,
    OutstandingBalanceComponent,
    RegisterCollectionComponent,
    VehicleComponent,
  ],
  imports: [
    CommonModule,
    TransporteRoutingModule,
    AntDesignModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    NgApexchartsModule
  ],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false }}
  ]
})
export class TransporteModule { }
