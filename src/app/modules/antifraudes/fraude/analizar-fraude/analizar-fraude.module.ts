import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from 'src/app/ant-design.module';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

// Components
import { AnalizarFraudeComponent } from './pages/analizar-fraude/analizar-fraude.component';

// Componentes para acciones de analizar
import { AccionesAnalizarComponent } from './pages/acciones-analizar/acciones-analizar.component';

// Componentes para tablas de analizar
import { DataTablaAnalizarComponent } from './pages/data-tabla-analizar/data-tabla-analizar.component';
import { DataTableCasosAnalizarComponent } from './components/data-table-casos-analizar/data-table-casos-analizar.component';
import { DataTableAnalisisRegistradosComponent } from './components/data-table-analisis-registrados/data-table-analisis-registrados.component';
import { DataTableSancionComponent } from './components/data-table-sancion/data-table-sancion.component';
import { DataTableNotificacionesComponent } from './components/data-table-notificaciones/data-table-notificaciones.component';
import { PdfViewerModule } from 'ng2-pdf-viewer'
@NgModule({
  declarations: [
    AnalizarFraudeComponent,

  // Componentes para acciones de analizar
    AccionesAnalizarComponent,

  // Componentes para tablas de analizar
   DataTablaAnalizarComponent,
   DataTableCasosAnalizarComponent,
   DataTableAnalisisRegistradosComponent,
   DataTableSancionComponent,
   DataTableNotificacionesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AntDesignModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
    PdfViewerModule
  ]
})
export class AnalizarFraudeModule { }
