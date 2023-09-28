import { Component, Input, OnInit } from '@angular/core';

// Services
import { UtilsService } from 'src/app/myUtils/utils.service';

// Interfaces
import { Fraude, ResponseSearchFraudes } from '../../../interfaces/fraude.interfaces';
import { AccionMasiva, accionesMasivasPendiente } from '../../interfaces/acciones-masivas-data';
import { TipoLista } from 'src/app/modules/antifraudes/antifraude/search-controls/interfaces/lists-controls.interfaces';
import { UsuariosFraude } from '../../interfaces/search-fraude.interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { ServiceRateService } from 'src/app/modules/tarifas/service/service-rate.service';
import { IFraude } from '../../../analizar-fraude/interfaces/fraude.interface';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';

@Component({
  selector: 'app-data-table-pendientes',
  templateUrl: './data-table-pendientes.component.html',
  styleUrls: ['./data-table-pendientes.component.scss', '../../../../../../../assets/themes/white/core/_formulario.scss']
})
export class DataTablePendientesComponent implements OnInit {

  /** Objeto para mostrar en la tabla */
  @Input() listOfData: Fraude[] = [];

  // Lista de usuarios
  @Input() users: UsuariosFraude[] = [];

  // Tipos de prioridad
  @Input() tpPrioridad: TipoLista[] = [];

  /** Objeto para filtrar tabla */
  listOfDataFilter: Fraude[] | undefined;

  /** Variable para la busqueda global */
  filterValue: string = '';

  /** Variable para seleccionar la acción masiva (por defecto 0 => 'seleccionar') */
  accionMasiva: number = 0;

  /** Lista de Acciones masivas */
  accionesMasivas: AccionMasiva[] = accionesMasivasPendiente;

  /** Pagina inicial */
  page: number = 1;

  // PDF
  urlFile;

  /** Variable para definir límite de 15 registros por página. */
  numberRow: number = 5;

  /** Registros por paginas */
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
 
  /** Variables para seleccionar registros */

  /** Variable para comprobar que se ha seleccionado registros en la tabla */
  checked = false;

  /** Variable para conseguir un efecto "comprobar todo". */
  indeterminate = false;

  /** Lista de datos de la página actual */
  listOfCurrentPageData: readonly Fraude[] = [];

  /** Variable para obtener todos los IDS de fraudes seleccionados en la tabla */
  setOfCheckedId = new Set<number>();

  /** MODAL DETALLE */

  /** Variable para abrir modal */
  isModalShow: boolean = false;

  /** Objeto para ver el detalle del fraude */
  fraudeDetalle: Fraude | undefined;

  /** MODAL ASIGNAR FRAUDE */

  /** Variable para abrir modal asignar */
  isModalAsignar: boolean = false;

  /** MODAL AGRUPAR FRAUDE */

  /** Variable para abrir modal agrupar */
  isModalAgrupar: boolean = false;
  isVisiblePDF: boolean = false;
  filname: string = '';
  /** Objeto fraudes enviado desde el componente padre */
  @Input() set fraudesPendientesData(data: ResponseSearchFraudes) {
    /** Filtrar los fraudes con estado 'Pendientes' */
    this.listOfData = data.fraudes.filter(data => data.estado_antifraude == 1);
  }

  constructor(
    private utils: UtilsService,
    private sanitazer: DomSanitizer,
    private _api: DescuentosService,
  ) { 
  }

  ngOnInit(): void {
  }

  /**
   * Método para filtrar contenido de la tabla
   */
  search(): void {
    let data: Fraude[];
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.listOfData;
    }
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.listOfDataFilter.filter((current) => {
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
          this.utils.validateObject(current.riesgo) && current.riesgo.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.impacto) && current.impacto.toString().toUpperCase().includes(this.filterValue.toUpperCase())
      }
      );
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
   * Actualizar los registros de la página actual
   * @param listOfCurrentPageData Fraude]
   */
  onCurrentPageDataChange(listOfCurrentPageData: readonly Fraude[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  /**
   * Seleccionar o deseleccionar todos los registros de la página actual
   * @param checked: boolean
   */
  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
    this.enableDisabledActionMassive();
  }

  /**
   * Actualizar el estado del registro (Chequeado o no)
   * @param id: number, id del registro
   * @param checked: boolean
   */
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  /**
   * Seleccionar o deseleccionar registro de la página actual
   * @param id: number
   * @param checked: boolean
   */
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
    this.enableDisabledActionMassive();
  }

  /**
   * Habilitar o deshabilitar acciones masivas
   */
  enableDisabledActionMassive(): void {
    this.accionesMasivas = this.accionesMasivas.map(accion => {
      accion.disabled = true;
      return accion;
    });
    /** Habilitar acción asignar si se selecciono 1 o más fraude */
    if (this.setOfCheckedId.size >= 1)
      this.accionesMasivas[0].disabled = false;
    /** Habilitar acción agrupar si se selecciono 2 o más fraudes */
    if (this.setOfCheckedId.size >= 2)
      this.accionesMasivas[1].disabled = false;
  }

  /**
   * Refrescar los registros seleccionados
   */
  refreshCheckedStatus(): void {
    // Reiniciar campo de acciones masivas cuando no hayan registros seleccionados
    if (this.setOfCheckedId.size <= 0) {
      this.accionMasiva = 0;
    }
    const listOfEnabledData = this.listOfCurrentPageData;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
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
   * Método para realizar la acción seleccionada 
   */
  accionMasivaSelect(option: number): void {
    /** Si la opción es 0 retornar */
    if (option == 0) return;
    switch (option) {
      // Caso 1: Abrir modal para ASIGNAR fraude
      case 1:
        /** Validar que se haya seleccionado 1 registro */
        if (this.setOfCheckedId.size <= 0) {
          /** Mostrar mensaje de error y resetear el campo select */
          this.utils.openErrorAlert('Debe seleccionar 1 o más registros para asignar.').then(r => this.accionMasiva = 0);
          return;
        }
        this.isModalAsignar = true;
        break;
      // Caso 5: Abrir modal para AGRUPAR fraude
      case 5:
        if (this.setOfCheckedId.size <= 1) {
          /** Mostrar mensaje de error y resetear el campo select */
          this.utils.openErrorAlert('Debe seleccionar 2 o más registros para agrupar.').then(r => this.accionMasiva = 0);
          return;
        }
        this.isModalAgrupar = true;
        break;
      default:
        this.utils.openErrorAlert('Opción incorrecta, eliga nuevamente la opción.').then(r => this.accionMasiva = 0);
        break;
    }
  }

  /**
   * Abrir modal detalle de fraude
   * @param fraudeDetalle: Fraude
   */
  openModal(fraudeDetalle: Fraude): void {
    this.fraudeDetalle = fraudeDetalle;
    this.isModalShow = true;
  }

  /**
   * Cerrar modal detalle de fraude
   */
  closeModalShow(): void {
    this.fraudeDetalle = undefined;
    this.isVisiblePDF = false;
    this.isModalShow = false;
  }

  
  getSelectedEntity() {
    return JSON.parse(localStorage.getItem('selectedEntity')!).entities[0].username;
  }

  evaluarFormulario() {
    const data: IFraude = JSON.parse(localStorage.getItem("controlFraude")!);
    this.filname = 'FRAUDE2023';
    return {
      "fileName": "FRAUDE2023",
      "type": "PDF",
      "typeDataSource": "CONN",
      "connect": "TICKETING",
      "params": {
        "USUARIO": this.getSelectedEntity(),
        "RIESGO": data.riesgo ? data.riesgo : '',
        "COMPONENTE": data.componente ? Number(data.componente) : 0,
        "SERVICIO": data.servicio ? Number(data.servicio) : 0,
        "TIPO_FRAUDE": data.tipo_fraude ? Number(data.tipo_fraude) : 0,
        "FUENTE": data.fuente ? Number(data.fuente) : 0,
        "IMPACTO": data.impacto ? Number(data.impacto) : 0,
        "DESCRIPCION": data.descripcion ? data.descripcion : '',
        "EMPRESA": data.empresa ? data.empresa : '',
        "ID": data.id ? data.id : '',
        "FECHA_INI_OCU": data.fecha_ini_ocu ? data.fecha_ini_ocu : '',
        "FECHA_FIN_OCU": data.fecha_fin_ocu ? data.fecha_fin_ocu : '',
        "FECHA_FIN_RE": data.fecha_fin_re ? data.fecha_fin_re : '',
        "FECHA_INI_RE": data.fecha_ini_re ? data.fecha_ini_re : ''
      }
    }
  }

  renderFileInTemplate() {
    this.isVisiblePDF = true;
    this._api.downloadImageDiscountReports(this.evaluarFormulario())
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
  renderFileInTemplateDownloads() {
    this._api.downloadImageDiscountReports(this.evaluarFormulario())
      .subscribe(
        {
          next: (value: Blob) => {
            const urlCreator = window.URL || window.webkitURL;
            this.urlFile = this.sanitazer.bypassSecurityTrustUrl(urlCreator.createObjectURL(value));
            const url = URL.createObjectURL(value);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.filname}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
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
