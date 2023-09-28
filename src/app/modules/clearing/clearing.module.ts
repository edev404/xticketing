import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AntDesignModule } from 'src/app/ant-design.module';
import { clearingRoutingModule } from "./clearing-routing.module";
import { PassageComponent } from './clearing/passage/passage.component';
import { CreatePassageComponent } from './clearing/create-passage/create-passage.component';
import { FindingComponent } from './clearing/finding/finding.component';
import { DetailPassageComponent } from './clearing/passage/detail-passage/detail-passage.component';
import { DetailPassageDistributionsComponent } from './clearing/passage/detail-passage/detail-passage-distributions/detail-passage-distributions.component';
import { DetailPassageCollectionComponent } from './clearing/passage/detail-passage/detail-passage-collection/detail-passage-collection.component';
import { DetailPassageGeneralComponent } from './clearing/passage/detail-passage/detail-passage-general/detail-passage-general.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsComponent } from './clearing/reports/reports.component';

@NgModule({
  declarations: [
    PassageComponent,
    CreatePassageComponent,
    FindingComponent,
    DetailPassageComponent,
    DetailPassageDistributionsComponent,
    DetailPassageCollectionComponent,
    DetailPassageGeneralComponent,
    ReportsComponent
  ],
  imports: [
    CommonModule,
    AntDesignModule,
    clearingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ClearingModule { }
