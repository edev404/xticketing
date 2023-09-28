import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AntDesignModule } from 'src/app/ant-design.module';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop'
import { NgxPaginationModule } from 'ngx-pagination';

// Components
import { SearchFraudeComponent } from './pages/search-fraude/search-fraude.component';

// Componentes para tablas
import { DataTablaFraudeComponent } from './pages/data-tabla-fraude/data-tabla-fraude.component';
import { DataTablePendientesComponent } from './components/data-table-pendientes/data-table-pendientes.component';
import { DataTableAnalizarComponent } from './components/data-table-analizar/data-table-analizar.component';
import { DataTableCerradosComponent } from './components/data-table-cerrados/data-table-cerrados.component';

// Componentes para modales
import { ModalShowComponent } from './components/data-table-pendientes/modal-show/modal-show.component';
import { ModalAsignarFraudeComponent } from './components/data-table-pendientes/modal-asignar-fraude/modal-asignar-fraude.component';
import { ModalAgruparFraudeComponent } from './components/data-table-pendientes/modal-agrupar-fraude/modal-agrupar-fraude.component';
import { ModalShowGrupoComponent } from './components/data-table-analizar/modal-show-grupo/modal-show-grupo.component';

// PDF
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    SearchFraudeComponent,
    
    // Componentes para tablas
    DataTablaFraudeComponent,
    DataTablePendientesComponent,
    DataTableAnalizarComponent,
    DataTableCerradosComponent,
    
    // Componentes para modales
    ModalShowComponent,
    ModalAsignarFraudeComponent,
    ModalAgruparFraudeComponent,
    ModalShowGrupoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    AntDesignModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
    PdfViewerModule

  ]
})
export class SearchFraudeModule { }
