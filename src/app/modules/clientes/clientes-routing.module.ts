import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePassengerComponent } from './clientes/create-passenger/create-passenger.component';
import { RechargeAccountComponent } from './clientes/recharge-account/recharge-account.component';
import { UploadFilesComponent } from './clientes/upload-files/upload-files.component';
import { ViewClientsComponent } from './clientes/view-clients/view-clients.component';

const routes: Routes = [
  {
    path:'',
    component: ViewClientsComponent
  },
  {
    path:'create-clients',
    component: CreatePassengerComponent
  },
  {
    path:'edit-clients/:id',
    component: CreatePassengerComponent
  },
  {
    path:'recharge-accounts',
    component: RechargeAccountComponent
  },
  {
    path:'uploda-file',
    component: UploadFilesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
