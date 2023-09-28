import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescuentosRoutingModule } from './descuentos-routing.module';
import { DescuentosComponent } from './descuentos/descuentos.component';
import { DiscountAssingComponent } from './descuentos/discount-assing/discount-assing.component';
import { DiscountSettingComponent } from './descuentos/discount-setting/discount-setting.component';
import { DistcountAssignMassiveComponent } from './descuentos/distcount-assign-massive/distcount-assign-massive.component';
import { AntDesignModule } from 'src/app/ant-design.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    DescuentosComponent,
    DiscountAssingComponent,
    DiscountSettingComponent,
    DistcountAssignMassiveComponent
  ],
  imports: [
    CommonModule,
    DescuentosRoutingModule,
    AntDesignModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule 
]
})
export class DescuentosModule { }
