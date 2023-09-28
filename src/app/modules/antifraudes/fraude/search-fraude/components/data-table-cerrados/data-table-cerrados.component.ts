import { Component, OnInit, Input } from '@angular/core';

// Services
import { UtilsService } from 'src/app/myUtils/utils.service';

// Interfaces
import { Fraude, Grupo, ResponseSearchFraudes } from '../../../interfaces/fraude.interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { ServiceRateService } from 'src/app/modules/tarifas/service/service-rate.service';
import { IFraude } from '../../../analizar-fraude/interfaces/fraude.interface';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';

@Component({
  selector: 'app-data-table-cerrados',
  templateUrl: './data-table-cerrados.component.html',
  styleUrls: ['./data-table-cerrados.component.scss', '../../../../../../../assets/themes/white/core/_formulario.scss']
})
export class DataTableCerradosComponent implements OnInit {

  /** Objeto para mostrar en la tabla */
  @Input() listOfData: any[] = [];

  /** Objeto para filtrar tabla */
  listOfDataFilter: any[] | undefined;

  /** Variable para la busqueda global */
  filterValue: string = '';

  /** Pagina inicial */
  page: number = 1;

  /** Variable para definir límite de 15 registros por página. */
  numberRow: number = 5;

  /** Registros por paginas */
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  /** MODAL DETALLE */

  /** Variable para abrir modal */
  isModalShow: boolean = false;

  /** Objeto para ver el detalle del fraude */
  fraudeDetalle: Fraude | undefined;

  /** Variable para abrir modal grupo */
  isModalShowGrupo: boolean = false;

  /** Objeto para ver el detalle del grupo de fraude */
  grupoFraudeDetalle: Grupo | undefined;

  // PDF
  isVisiblePDF: boolean = false;
  urlFile;
  filname: string = '';
  /** Objeto fraudes enviado desde el componente padre */
  @Input() set fraudesCerradosData(data: ResponseSearchFraudes) {
    /** Si existen grupos en la data, colocarle a la propiedad `isgroup` con valor true para la funcionalidad de expandir fraudes de grupos */
    const grupos = data.grupos.map(grupo => {
      grupo.isGroup = true;
      return grupo;
    }).filter(data => data.estado == '3');
    const fraudesCerrados = data.fraudes.filter(data => data.estado_antifraude == 3);
    /** Unir los grupos y fraudes sin grupos con estado cerrados en un solo array de objetos */
    this.listOfData = [...grupos, ...fraudesCerrados];
  }

  constructor(
    private utils: UtilsService,
    private sanitazer: DomSanitizer,
    private _api: DescuentosService) { }

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
        if (current.isGroup) {
          const fraudes = current.fraudes.filter(fraude => {
            return this.utils.validateObject(fraude.id) && fraude.id.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(fraude.estado_anti) && fraude.estado_anti.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(fraude.descripcion) && fraude.descripcion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(fraude.tipo_fraude) && fraude.tipo_fraude.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(fraude.fecha_creacion) && fraude.fecha_creacion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(fraude.componente) && fraude.componente.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(fraude.fuente) && fraude.fuente.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(fraude.riesgo) && fraude.riesgo.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(fraude.impacto) && fraude.impacto.toString().toUpperCase().includes(this.filterValue.toUpperCase())
          });
          return fraudes.length > 0 ? fraudes : null;
        }
        // Eliminar los milisegundos de la fecha
        const fechayHora = current.fecha_creacion.toString().slice(0, 16);
        // Formatear fecha con el mismo formato que se muestra en la tabla
        const formatDate = this.utils.formatDateHoursToString(new Date(fechayHora));
        // Eliminar los milisegundos de la fecha de Registro
        const fechayHoraFechaRegistro = current.fechaRegistro?.toString().slice(0, 16);
        let formatDateFechaRegistro = '';
        if (fechayHoraFechaRegistro) {
          // Formatear fecha Registro con el mismo formato que se muestra en la tabla
          formatDateFechaRegistro = this.utils.formatDateHoursToString(new Date(fechayHoraFechaRegistro));
        }
        return this.utils.validateObject(current.id) && current.id.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.estado_anti) && current.estado_anti.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.descripcion) && current.descripcion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.tipo_fraude) && current.tipo_fraude.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(formatDate) && formatDate.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.componente) && current.componente.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.fuente) && current.fuente.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.riesgo) && current.riesgo.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.impacto) && current.impacto.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.causa) && current.causa.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.detallePosiblecausa) && current.detallePosiblecausa.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.resolucion) && current.resolucion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.accion) && current.accion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.conclusion) && current.conclusion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(formatDateFechaRegistro) && formatDateFechaRegistro.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.usuarioRegi) && current.usuarioRegi.toString().toUpperCase().includes(this.filterValue.toUpperCase())
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
    this.isModalShow = false;
    this.isVisiblePDF = false;
  }

  /**
   * Abrir modal detalle del grupo fraude
   */
  openModalGrupo(grupo: Grupo): void {
    this.grupoFraudeDetalle = grupo;
    this.isModalShowGrupo = true;
  }

  /**
   * Cerrar modal detalle del grupo fraude
   */
  closeModalShowGrupo(): void {
    this.grupoFraudeDetalle = undefined;
    this.isModalShowGrupo = false;
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
