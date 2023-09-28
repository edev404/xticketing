import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesComponent } from './clientes/clientes.component';
import { ViewClientsComponent } from './clientes/view-clients/view-clients.component';
import { CreatePassengerComponent } from './clientes/create-passenger/create-passenger.component';
import { RechargeAccountComponent } from './clientes/recharge-account/recharge-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from 'src/app/ant-design.module';
import { DetailPassengerComponent } from './clientes/view-clients/detail-passenger/detail-passenger.component';
import { PersonalInformationComponent } from './clientes/view-clients/detail-passenger/personal-information/personal-information.component';
import { AccountPassengerComponent } from './clientes/view-clients/detail-passenger/account-passenger/account-passenger.component';
import { CardPassengerComponent } from './clientes/view-clients/detail-passenger/card-passenger/card-passenger.component';
import { DiscountPassengerComponent } from './clientes/view-clients/detail-passenger/discount-passenger/discount-passenger.component';
import { UploadFilesComponent } from './clientes/upload-files/upload-files.component';
import { PdfViewerModule } from 'ng2-pdf-viewer'
import { NgxPaginationModule } from 'ngx-pagination';

import { NgApexchartsModule } from 'ng-apexcharts';
import { UppercaseDirective } from 'src/app/shared/directive/uppercase/uppercase.directive';


@NgModule({
  declarations: [
    ClientesComponent,
    ViewClientsComponent,
    CreatePassengerComponent,
    RechargeAccountComponent,
    DetailPassengerComponent,
    PersonalInformationComponent,
    AccountPassengerComponent,
    CardPassengerComponent,
    DiscountPassengerComponent,
    UploadFilesComponent
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    ReactiveFormsModule,
    AntDesignModule,
    FormsModule,
    NgxPaginationModule,
    PdfViewerModule,
    NgApexchartsModule
  ],
  exports:[CreatePassengerComponent]
})
export class ClientesModule { }
