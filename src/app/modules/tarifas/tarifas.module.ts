import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TarifasRoutingModule } from './tarifas-routing.module';
import { TarifasComponent } from './tarifas/tarifas.component';
import { AntDesignModule } from 'src/app/ant-design.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TarifasServicioComponent } from './tarifas/tarifas-servicio/tarifas-servicio.component';
import { RateFormComponent } from './tarifas/rate-form/rate-form.component';
import { RateUpdateComponent } from './tarifas/rate-update/rate-update.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NgxPaginationModule } from 'ngx-pagination';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';


@NgModule({
  declarations: [
    TarifasComponent,
    TarifasServicioComponent,
    RateFormComponent,
    RateUpdateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TarifasRoutingModule, 
    AntDesignModule,
    DragDropModule,
    FormsModule,
    NgxPaginationModule,
    NzDatePickerModule,
    NzCheckboxModule
  ]
})
export class TarifasModule { }
