import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PqrRoutingModule } from './pqr-routing.module';
import { PqrComponent } from './pqr/pqr.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { PqrServiceService } from './services/pqr-service.service';
import { AccionesPqrComponent } from './pqr/acciones-pqr/acciones-pqr.component';
import { PqrRegistroComponent } from './pqr/pqr-registro/pqr-registro.component';
import { ListaPqrComponent } from './pqr/lista-pqr/lista-pqr.component';
import { VerPqrsComponent } from './pqr/ver-pqrs/ver-pqrs.component';
import { ModalsAccionesComponent } from './pqr/modals-acciones/modals-acciones.component';
import { ParametrosPqrComponent } from './pqr/parametros-pqr/parametros-pqr.component';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableFixedRowComponent, NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { ReportesPqrComponent } from './pqr/reportes-pqr/reportes-pqr.component';



@NgModule({
  declarations: [
    PqrRegistroComponent,
    PqrComponent,
    ListaPqrComponent,
    VerPqrsComponent,
    AccionesPqrComponent,
    ModalsAccionesComponent,
    ParametrosPqrComponent,
    ReportesPqrComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzSelectModule,
    NzModalModule,
    NzTableModule,
    NzDividerModule,
    NzMenuModule,
    NzIconModule,
    NzCollapseModule,
    NzBreadCrumbModule,
    PqrRoutingModule,
    ReactiveFormsModule,
    NzCardModule,
    NgxPaginationModule,
    NzToolTipModule,
    NzDropDownModule,
    SharedModule
  ]
})
export class PqrModule { }
