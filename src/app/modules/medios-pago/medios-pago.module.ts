import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediosPagoRoutingModule } from './medios-pago-routing.module';
import { MediosPagoComponent } from './medios-pago/medios-pago.component';
import { DashboardComponent } from './medios-pago/dashboard/dashboard.component';
import { RegisterComponent } from './medios-pago/register/register.component';
import { AntDesignModule } from 'src/app/ant-design.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DistributionComponent } from './medios-pago/distribution/distribution.component';
import { ActivateComponent } from './medios-pago/activate/activate.component';
import { LockComponent } from './medios-pago/lock/lock.component';
import { PersonalizeComponent } from './medios-pago/personalize/personalize.component';
import { RequestInitializationComponent } from './medios-pago/request-initialization/request-initialization.component';
import { RequestSendComponent } from './medios-pago/request-send/request-send.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClientesModule } from '../clientes/clientes.module';
import { LowercasePipe } from 'src/app/shared/pipe/lowercase';
import { CapitalezePipe } from 'src/app/shared/pipe/capitaleze';
import { CheckBalanceComponent } from './medios-pago/check-balance/check-balance.component';
import { RechargesComponent } from './medios-pago/recharges/recharges.component';
import { DetailsRechargeComponent } from './medios-pago/details-recharge/details-recharge.component';
import { UppercaseDirective } from 'src/app/shared/directive/uppercase/uppercase.directive';
import { VentasComponent } from './medios-pago/ventas/ventas.component';

@NgModule({
  declarations: [
    MediosPagoComponent,
    DashboardComponent,
    RegisterComponent,
    DistributionComponent,
    ActivateComponent,
    LockComponent,
    PersonalizeComponent,
    RequestInitializationComponent,
    RequestSendComponent,
    LowercasePipe,
    CapitalezePipe,
    CheckBalanceComponent,
    RechargesComponent,
    DetailsRechargeComponent,
    UppercaseDirective,
    VentasComponent
  ],
  imports: [
    CommonModule,
    MediosPagoRoutingModule,
    AntDesignModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ClientesModule
  ]
})
export class MediosPagoModule { }
