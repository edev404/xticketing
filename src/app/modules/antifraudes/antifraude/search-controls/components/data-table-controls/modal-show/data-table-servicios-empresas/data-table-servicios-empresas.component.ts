import { Component, Input } from '@angular/core';
import { ServicioEmpresa } from '../../../../interfaces/search-controles.interfaces';

@Component({
  selector: 'app-data-table-servicios-empresas',
  templateUrl: './data-table-servicios-empresas.component.html',
  styleUrls: ['./data-table-servicios-empresas.component.scss']
})
export class DataTableServiciosEmpresasComponent {

  /** Objeto para mostrar en la tabla */
  @Input() listOfData: ServicioEmpresa[] = [];

  /** Paginación */

  /** Página inicial */
  page: number = 1;

  /** Variable para definir límite de 5 registros por página. */ 
  numberRow: number = 5;

  /** Registros por paginas */
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  /** Cambiar de página */
  onChangePage(event: number): void {
    this.page = event;
  }

  /** Cambiar el tamaño de filas por página */
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }  

}
