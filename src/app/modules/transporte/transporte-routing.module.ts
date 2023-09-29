import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransfersReportsComponent } from './transporte/transfers-reports/transfers-reports.component';
import { TransfersComponent } from './transporte/transfers/transfers.component';
import { TransportComponent } from './transporte/transport/transport.component';
import { ViewCollectionComponent } from './transporte/view-collection/view-collection.component';
import { VehicleComponent } from './transporte/vehicle/vehicle.component';

const routes: Routes = [
  {
    path:'',
    component:TransportComponent
  },
  {
    path:'transfer',
    component:TransfersComponent
  },
  {
    path: 'reports',
    component:TransfersReportsComponent
  },
  {
    path: 'view-collection',
    component:ViewCollectionComponent
  },
  {
    path: 'vehicle',
    component:VehicleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransporteRoutingModule { }
