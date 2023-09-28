import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClearingComponent } from './admin/clearing/clearing.component';
import { CompanyComponent } from './admin/company/company.component';
import { EntitesComponent } from './admin/entites/entites.component';
import { ParametersComponent } from './admin/parameters/parameters.component';
import { ServicesAdminComponent } from './admin/services-admin/services.component';
import { UserComponent } from './admin/user/user.component';
import { LogComponent } from './admin/log/log.component';

const routes: Routes = [
  {
    path:'user',
    component:UserComponent
  },
  {
    path:'company',
    component:CompanyComponent
  },
  {
    path:'service',
    component:ServicesAdminComponent
  },
  {
    path:'clearing',
    component:ClearingComponent
  },
  {
    path:'parameters',
    component:ParametersComponent
  },
  {
    path:'entites',
    component:EntitesComponent
  },
  {
    path:'log',
    component:LogComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
