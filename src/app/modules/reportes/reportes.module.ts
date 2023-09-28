import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reportesRoutingModule } from './reportes-routing.module';
import { ViewListComponent } from './view-list/view-list.component';
import { AntDesignModule } from 'src/app/ant-design.module';
import { ListWithComponent } from './view-list/list-with/list-with.component';
import { ListGrayComponent } from './view-list/list-gray/list-gray.component';
import { ListBlackComponent } from './view-list/list-black/list-black.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ViewListComponent,
    ListWithComponent,
    ListGrayComponent,
    ListBlackComponent
  ],
  imports: [
    CommonModule,
    reportesRoutingModule,
    AntDesignModule,
    NgxPaginationModule,
    FormsModule,
  ]
})
export class ReportesModule { }
