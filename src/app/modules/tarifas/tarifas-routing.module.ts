import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RateFormComponent } from './tarifas/rate-form/rate-form.component';
import { RateUpdateComponent } from './tarifas/rate-update/rate-update.component';
import { TarifasServicioComponent } from './tarifas/tarifas-servicio/tarifas-servicio.component';

const routes: Routes = [
  {
    path:'',
    component:TarifasServicioComponent
  },
  {
    path:'rate-form',
    component:RateFormComponent
  },
  {
    path:'rate-update/:rate',
    component:RateUpdateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TarifasRoutingModule { }
