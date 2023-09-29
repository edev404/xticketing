import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { RechargeComponent } from './recharge/recharge.component';

// componentes

const routes:Routes = [
  {
    path: 'recharge', 
    component: RechargeComponent,
  },
  {
    path: 'recharge-settlement', 
    component: RechargeComponent,
  }   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class RechargesRoutingModule { }