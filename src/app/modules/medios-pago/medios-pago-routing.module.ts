import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivateComponent } from './medios-pago/activate/activate.component';
import { DashboardComponent } from './medios-pago/dashboard/dashboard.component';
import { DistributionComponent } from './medios-pago/distribution/distribution.component';
import { LockComponent } from './medios-pago/lock/lock.component';
import { PersonalizeComponent } from './medios-pago/personalize/personalize.component';
import { RegisterComponent } from './medios-pago/register/register.component';
import { RequestInitializationComponent } from './medios-pago/request-initialization/request-initialization.component';
import { RequestSendComponent } from './medios-pago/request-send/request-send.component';
import { CheckBalanceComponent } from './medios-pago/check-balance/check-balance.component';
import { RechargesComponent } from './medios-pago/recharges/recharges.component';
import { DetailsRechargeComponent } from './medios-pago/details-recharge/details-recharge.component';
import { VentasComponent } from './medios-pago/ventas/ventas.component';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'distribution',
    component: DistributionComponent
  },
  {
    path: 'activate',
    component: ActivateComponent
  },
  {
    path: 'lock',
    component: LockComponent
  },
  {
    path: 'personalize',
    component: PersonalizeComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'new_request',
    component: RequestInitializationComponent
  },
  {
    path: 'send_request',
    component: RequestSendComponent
  },
  {
    path: 'check_balance',
    component: CheckBalanceComponent
  },
  {
    path: 'detalles-recarga',
    component: DetailsRechargeComponent
  },
  {
    path: 'ventas',
    component: VentasComponent
  },
  {
    path: 'recharges',
    component: RechargesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediosPagoRoutingModule { }
