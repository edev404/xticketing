import { Component, OnInit, Input } from '@angular/core';

// Services
import { UtilsService } from 'src/app/myUtils/utils.service';
import { Grupo } from '../../../interfaces/fraude.interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';

// Interfaces

@Component({
  selector: 'app-data-table-casos-analizar',
  templateUrl: './data-table-casos-analizar.component.html',
  styleUrls: ['./data-table-casos-analizar.component.scss']
})
export class DataTableCasosAnalizarComponent implements OnInit {

  /** Objeto para mostrar en la tabla */
  @Input() listOfData: any[] = [];

  /** Objeto para filtrar tabla */
  listOfDataFilter: any[] | undefined;

  /** Variable para la busqueda global */
  filterValue: string = '';

  /** Paginación */

  /** Página inicial */
  page: number = 1;

  /** Variable para definir límite de 5 registros por página. */
  numberRow: number = 5;

  /** Registros por paginas */
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  /** Fin paginacion */
  // PDF
  isVisiblePDF: boolean = false;
  urlFile;

  constructor(
    private utils: UtilsService,
    private sanitazer: DomSanitizer,
    private _api: DescuentosService,) { }

  ngOnInit(): void {
  }

  /**
   * Método para filtrar contenido de la tabla
   */
  search(): void {
    let data: any[];
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.listOfData;
    }
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.listOfDataFilter.filter((current) => {
        if (current.isGroup) {
          const fraudes = current.fraudes.filter(fraude => {
            // Eliminar los milisegundos de la fecha
            const fechayHora = fraude.fecha_creacion.toString().slice(0, 16);
            // Formatear fecha con el mismo formato que se muestra en la tabla
            const formatDate = this.utils.formatDateHoursToString(new Date(fechayHora));
            return this.utils.validateObject(fraude.id) && fraude.id.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(fraude.estado_anti) && fraude.estado_anti.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(fraude.descripcion) && fraude.descripcion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(fraude.tipo_fraude) && fraude.tipo_fraude.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(formatDate) && formatDate.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(fraude.componente) && fraude.componente.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(fraude.fuente) && fraude.fuente.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(fraude.impacto) && fraude.impacto.toString().toUpperCase().includes(this.filterValue.toUpperCase())
          });
          return fraudes.length > 0 ? fraudes : null;
        }
        // Eliminar los milisegundos de la fecha
        const fechayHora = current.fecha_creacion.toString().slice(0, 16);
        // Formatear fecha con el mismo formato que se muestra en la tabla
        const formatDate = this.utils.formatDateHoursToString(new Date(fechayHora));
        return this.utils.validateObject(current.id) && current.id.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.estado_anti) && current.estado_anti.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.descripcion) && current.descripcion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.tipo_fraude) && current.tipo_fraude.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(formatDate) && formatDate.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.componente) && current.componente.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.fuente) && current.fuente.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.impacto) && current.impacto.toString().toUpperCase().includes(this.filterValue.toUpperCase())
      });
      if (data) {
        this.listOfData = data;
      }
    } else {
      if (this.listOfDataFilter) {
        this.listOfData = this.listOfDataFilter;
        this.listOfDataFilter = undefined;
      }
    }
  }

  /**
   * Método para expandir o minimizar grupos de fraudes
   * @param grupoFraude: Grupo
   */
  collapse(grupoFraude: Grupo): void {
    grupoFraude.expandFraude = !grupoFraude.expandFraude;
  }

  /** Cambiar de página */
  onChangePage(event: number): void {
    this.page = event;
  }

  /** Cambiar el tamaño de filas por página */
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  
  /**
 * Cerrar modal detalle de control
 */
  closeModalShow(): void {
    this.isVisiblePDF = false;
  }

  renderFileInTemplateDownloads() {
    this.isVisiblePDF = true;
    const body = {
      "fileName": "XT_RC01_HorariosAperturaCierre_202302",
      "type": "PDF",
      "typeDataSource": "CONN",
      "connect": "TICKETING",
      "params": {
        "ID_USUARIO": 0,
        "USUARIO": "Alison Prieto",
        "ID_ENTIDAD": 0,
        "ID_SERVICIO": 0
      }
    }
    this._api.downloadImageDiscountReports(body)
      .subscribe(
        {
          next: (value: Blob) => {
            const urlCreator = window.URL || window.webkitURL;
            this.urlFile = this.sanitazer.bypassSecurityTrustUrl(urlCreator.createObjectURL(value));
            this.urlFile = this.urlFile.changingThisBreaksApplicationSecurity;
          },
          error: (err: any) => {
            console.log(err)
          },
          complete: () => {
            console.log("La suscripción al observable ha finalizado");
          },
        }
      )
  }

}
