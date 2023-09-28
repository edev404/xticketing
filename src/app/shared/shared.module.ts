import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from './side-bar/side-bar.component';
import { AntDesignModule } from '../ant-design.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { TabsetComponent } from './tabset/tabset.component';
import { ViewerPdfComponent } from './pdf/viewer-pdf.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DisableCopyPasteDirective } from './directive/disableCopyPaste/disable-copy-paste.directive';
const MODULOS = [
  CommonModule,
  AntDesignModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  PdfViewerModule,
]

const COMPONENTES = [
  SideBarComponent,
  NavBarComponent,
  BreadcrumbComponent,
  TabsetComponent,
  ViewerPdfComponent,
  DisableCopyPasteDirective
]
@NgModule({
  declarations: [
    ...COMPONENTES,
  ],
  imports: [
    ...MODULOS
  ],
  exports: [
    ...COMPONENTES
  ]
})
export class SharedModule { }
