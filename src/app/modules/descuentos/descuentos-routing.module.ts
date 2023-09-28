import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscountAssingComponent } from './descuentos/discount-assing/discount-assing.component';
import { DiscountSettingComponent } from './descuentos/discount-setting/discount-setting.component';
import { DistcountAssignMassiveComponent } from './descuentos/distcount-assign-massive/distcount-assign-massive.component';

const routes: Routes = [
  {
    path:'',
    component:DiscountSettingComponent
  },
  {
    path:'assign',
    component:DiscountAssingComponent
  },
  {
    path:'assign-massive',
    component:DistcountAssignMassiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DescuentosRoutingModule { }
