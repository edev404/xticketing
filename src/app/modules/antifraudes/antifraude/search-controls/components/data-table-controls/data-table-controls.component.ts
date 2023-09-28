import { Component, OnInit, Input } from '@angular/core';

// Services
import { UtilsService } from 'src/app/myUtils/utils.service';
import { SearchControlesService } from '../../services/search-controles.service';

// Interfaces
import { ControlView } from '../../interfaces/search-controles.interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';

@Component({
  selector: 'app-data-table-controls',
  templateUrl: './data-table-controls.component.html',
  styleUrls: ['./data-table-controls.component.scss', '../../../../../../../assets/themes/white/core/_formulario.scss']
})
export class DataTableControlsComponent implements OnInit {

  /** Objeto para mostrar en la tabla */
  @Input() listOfData: ControlView[] = [];

  /** Objeto para filtrar tabla */
  listOfDataFilter: ControlView[] | undefined;

  /** Variable para la busqueda global */
  filterValue: string = '';
  filname: string = '';

  // PDF
  urlFile;

  /** Paginación */

  /** Página inicial */
  page: number = 1;

  /** Variable para definir límite de 15 registros por página. */
  numberRow: number = 5;

  /** Registros por paginas */
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  /** Fin paginacion */

  /** MODALES */
  // Variable para mostrar la tabla
  mostrarInformacion: boolean = false;

  /** Objeto para ver el detalle del control */
  controlDetalle: ControlView | undefined;

  // Variable para abrir modal 
  isModalShow: boolean = false;
  isVisiblePDF: boolean = false;

  /** Objeto controles enviado desde el componente padre */
  @Input() set controlesData(data: ControlView[]) {
    /** Guardar los datos en la variable listOfData para mostrar en la tabla*/
    this.listOfData = data;
  }

  constructor(
    private searchControlesService: SearchControlesService,
    private sanitazer: DomSanitizer,
    private _api: DescuentosService,
    private utils: UtilsService) { }

  ngOnInit(): void {
    // Para guardar el estado si hay data
    this.mostrarInformacion = this.listOfData.length > 0 ? true : false;
  }

  /**
   * Método para filtrar contenido de la tabla
   */
  search(): void {
    let data: ControlView[];
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.listOfData;
    }
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.listOfDataFilter.filter((current) => {
        return this.utils.validateObject(current.codigo) && current.codigo.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.control) && current.control.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.fuente) && current.fuente.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.descripcion) && current.descripcion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.tipo_control) && current.tipo_control.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.criticidad) && current.criticidad.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.componente) && current.componente.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.deteccion) && current.deteccion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.accion_resultante) && current.accion_resultante.toString().toUpperCase().includes(this.filterValue.toUpperCase())
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
   * Abrir modal detalle de controles y consumir servicio de findById
   * @param controlDetalle: ControlView
   */
  async openModal(controlDetalle: ControlView): Promise<void> {
    this.controlDetalle = controlDetalle;
    this.isModalShow = true;
    // Realizar petición para buscar el detalle de control
    const response = await this.searchControlesService.getDetailFindById(controlDetalle.id);
    if (response && response.status === this.utils.successMessage) {
      this.controlDetalle = response.data.controles[0];
    } else {
      await this.utils.openErrorAlert(response.message);
    }
  }

  /**
   * Cerrar modal detalle de control
   */
  closeModalShow(): void {
    this.controlDetalle = undefined;
    this.isModalShow = false;
    this.isVisiblePDF = false;
  }

  getSelectedEntity() {
    return JSON.parse(localStorage.getItem('selectedEntity')!).entities[0].username;
  }

  evaluarFormulario() {
    const data = JSON.parse(localStorage.getItem("controlAntifraude")!);
    this.filname = 'AN202301_Controles';
    return {
      "fileName": "AN202301_Controles",
      "type": "PDF",
      "typeDataSource": "CONN",
      "connect": "TICKETING",
      "params": {
        "USUARIO": this.getSelectedEntity(),
        "FECHA_INI": data.fecha_ini ? data.fecha_ini : '',
        "FECHA_FIN": data.fecha_fin ? data.fecha_fin : '',
        "SERVICIO": data.servicio ? Number(data.servicio) : 0,
        "ESTADO": data.estado ? Number(data.estado) : 0,
        "ACCION_RESULTANTE": data.accion_resultante ? data.accion_resultante : '',
        "DETENCCION": data.deteccion ? data.deteccion : '',
        "FUENTE": data.fuente ? data.fuente : '',
        "CRITICIDAD": data.criticidad ? data.criticidad : '',
        "DESCRIPCION": data.descripcion ? data.descripcion : '',
        "EMPREAC": data.empreac ? data.empreac : 0,
        "EMPRESA": data.empresa ? data.empresa : '',
        "COMPONENTE": data.componente ? data.componente : '',
        "TIPO_CONTROL": data.tipo_control ? data.tipo_control : '',
        "CONTROL": data.control ? data.control : '',
        "CODIGO": data.codigo ? data.codigo : '',
        "SERVICEAC": data.serviceac ? data.serviceac : 0,
        "EMPRESAC": data.empresac ? data.empresac : 0,
        "CAUSA": data.causa ? data.causa : '',
        "ACCION_EJE": data.accion_eje ? data.accion_eje : '',
        "ACTIVO": data.activo ? data.activo : false,
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
