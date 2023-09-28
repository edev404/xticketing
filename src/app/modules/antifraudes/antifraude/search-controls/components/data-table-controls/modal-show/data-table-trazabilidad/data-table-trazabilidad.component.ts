import { Component, Input } from '@angular/core';
import { Trazabilidad } from '../../../../interfaces/search-controles.interfaces';

@Component({
  selector: 'app-data-table-trazabilidad',
  templateUrl: './data-table-trazabilidad.component.html',
  styleUrls: ['./data-table-trazabilidad.component.scss']
})
export class DataTableTrazabilidadComponent {

  /** Objeto para mostrar en la tabla */
  @Input() listOfData: Trazabilidad[] = [];

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
