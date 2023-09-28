import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RechargesRoutingModule } from './recharge-routing.module';
import { RechargeComponent } from './recharge/recharge.component';
import { AntDesignModule } from 'src/app/ant-design.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailRechargeComponent } from './recharge/detail-recharge/detail-recharge.component';
import { FindingRechargeComponent } from './finding-recharge/finding-recharge.component';
import { CreateRechargeComponent } from './create-recharge/create-recharge.component';

@NgModule({
  declarations: [
    RechargeComponent,
    DetailRechargeComponent,
    FindingRechargeComponent,
    CreateRechargeComponent,
  ],
  imports: [
    CommonModule,
    AntDesignModule,
    RechargesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class RechargesModule { }
