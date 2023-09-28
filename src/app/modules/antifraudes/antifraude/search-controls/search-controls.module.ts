import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AntDesignModule } from 'src/app/ant-design.module';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

// Components
import { SearchControlsComponent } from './pages/search-controls/search-controls.component';
import { DataTableControlsComponent } from './components/data-table-controls/data-table-controls.component';
import { ModalShowComponent } from './components/data-table-controls/modal-show/modal-show.component';

// Components para ver detalle
import { DetalleControlComponent } from './components/data-table-controls/modal-show/detalle-control/detalle-control.component';
import { DataTableServiciosEmpresasComponent } from './components/data-table-controls/modal-show/data-table-servicios-empresas/data-table-servicios-empresas.component';
import { DataTableTrazabilidadComponent } from './components/data-table-controls/modal-show/data-table-trazabilidad/data-table-trazabilidad.component';
import { PdfViewerModule } from 'ng2-pdf-viewer'
@NgModule({
  declarations: [
    SearchControlsComponent,
    DataTableControlsComponent,
    ModalShowComponent,
    // Components para ver detalle
    DetalleControlComponent,
    DataTableServiciosEmpresasComponent,
    DataTableTrazabilidadComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AntDesignModule,
    FormsModule,
    RouterModule,
    PdfViewerModule,
    NgxPaginationModule
  ],
})
export class SearchControlsModule { }
