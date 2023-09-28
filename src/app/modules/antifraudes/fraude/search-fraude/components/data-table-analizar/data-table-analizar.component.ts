import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Services
import { FraudesService } from '../../services/fraudes.service';
import { SearchFraudeService } from '../../services/search-fraude.service';
import { AnalizarFraudeService } from '../../../analizar-fraude/services/analizar-fraude.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

// Interfaces
import { DesagruparFraudeUpdate } from '../../interfaces/fraudes-acciones';
import { AccionMasiva, accionesMasivasAnalizar } from '../../interfaces/acciones-masivas-data';
import { Fraude, ResponseSearchFraudes, Grupo } from '../../../interfaces/fraude.interfaces';
import { UsuariosFraude } from '../../interfaces/search-fraude.interfaces';
import { TipoLista } from 'src/app/modules/antifraudes/antifraude/search-controls/interfaces/lists-controls.interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { ServiceRateService } from 'src/app/modules/tarifas/service/service-rate.service';
import { IFraude } from '../../../analizar-fraude/interfaces/fraude.interface';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';

@Component({
  selector: 'app-data-table-analizar',
  templateUrl: './data-table-analizar.component.html',
  styleUrls: ['./data-table-analizar.component.scss', '../../../../../../../assets/themes/white/core/_formulario.scss']
})
export class DataTableAnalizarComponent implements OnInit {

  // Lista de usuarios
  @Input() users: UsuariosFraude[] = [];

  // Tipos de prioridad
  @Input() tpPrioridad: TipoLista[] = [];

  /** Objeto para mostrar todos los fraudes y grupos */
  listOfData: any[] = [];

  /** Objeto para filtrar tabla */
  listOfDataFilter: any[] | undefined;

  /** Variable para la busqueda global */
  filterValue: string = '';

  /** Variable para seleccionar la acción masiva */
  accionMasiva: number = 0;

  /** Lista de Acciones masivas */
  accionesMasivas: AccionMasiva[] = accionesMasivasAnalizar;

  /** Pagina inicial */
  page: number = 1;

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
  listOfCurrentPageData: readonly any[] = [];

  /** Variable para obtener todos los IDS de fraudes seleccionados en la tabla */
  setOfCheckedId = new Set<number>();

  /** Variable para obtener todos los IDS de grupos de fraudes seleccionados en la tabla */
  setOfCheckedIdFraudeGrupo = new Set<number>();

  /** Variables para seleccionar grupos */

  /** Variable para comprobar que se ha seleccionado grupos en la tabla */
  checkedGrupo: boolean[] = [];

  /** Variable para conseguir un efecto "comprobar todo". */
  indeterminateGrupo: boolean[] = [];

  /** Variable para obtener todos los IDS de grupos seleccionados en la tabla */
  setGrupoOfCheckedId = new Set<number>();

  /** MODAL DETALLE */

  /** Variable para abrir modal */
  isModalShow: boolean = false;

  /** Objeto para ver el detalle del fraude */
  fraudeDetalle: Fraude | undefined;

  /** Variable para abrir modal grupo */
  isModalShowGrupo: boolean = false;

  /** Objeto para ver el detalle del grupo de fraude */
  grupoFraudeDetalle: Grupo | undefined;

  /** MODAL DIVIDIR FRAUDE */

  /** Variable para abrir modal dividir */
  isModalDividir: boolean = false;

  /** Variable de fraudes seleccionados para dividir y tomar el "usuario asignado a y prioridad" */
  fraudesDividir: any[] | undefined = undefined;

  // PDF
  isVisiblePDF: boolean = false;
  urlFile;
  filname: string = '';

  /** Objeto fraudes enviado desde el componente padre */
  @Input() set fraudesAnalizarData(data: ResponseSearchFraudes) {
    /** Si existen grupos en la data, colocarle a la propiedad `isgroup` con valor true para la funcionalidad de expandir fraudes de grupos */
    const grupos = data.grupos.map(grupo => {
      grupo.isGroup = true;
      return grupo;
    });
    const fraudesPorAnalizar = data.fraudes.filter(data => data.estado_antifraude == 2 || data.estado_antifraude == 4);
    /** Unir los grupos y fraudes sin grupos en un solo array de objetos */
    this.listOfData = [...grupos, ...fraudesPorAnalizar];
  }

  constructor(private fraudesService: FraudesService,
    private searchFraudeService: SearchFraudeService,
    private analizarFraudeService: AnalizarFraudeService,
    private sanitazer: DomSanitizer,
    private _api: DescuentosService,
    private utils: UtilsService,
    private router: Router) { }

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
              this.utils.validateObject(fraude.riesgo) && fraude.riesgo.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(fraude.impacto) && fraude.impacto.toString().toUpperCase().includes(this.filterValue.toUpperCase())
          });
          return fraudes.length > 0 ? fraudes : null;
        }
        // Eliminar los milisegundos de la fecha
        const fechayHora = current.fecha_creacion.toString().slice(0, 16);
        // Formatear fecha con el mismo formato que se muestra en la tabla
        const formatDate = this.utils.formatDateHoursToString(new Date(fechayHora));
        // Eliminar los milisegundos de la fecha de Asignacion
        const fechayHoraFechaAsignacion = current.fechaAsignacion.toString().slice(0, 16);
        // Formatear fecha Asignacion con el mismo formato que se muestra en la tabla
        const formatDateFechaAsignacion = this.utils.formatDateHoursToString(new Date(fechayHoraFechaAsignacion));
        return this.utils.validateObject(current.id) && current.id.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.estado_anti) && current.estado_anti.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.descripcion) && current.descripcion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.tipo_fraude) && current.tipo_fraude.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(formatDate) && formatDate.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.componente) && current.componente.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.fuente) && current.fuente.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.riesgo) && current.riesgo.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.impacto) && current.impacto.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.noUserAsig) && current.noUserAsig.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.prioridad) && current.prioridad.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.observacion) && current.observacion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(formatDateFechaAsignacion) && formatDateFechaAsignacion.toString().toUpperCase().includes(this.filterValue.toUpperCase())
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
   * Actualizar los registros de la página actual
   * @param listOfCurrentPageData any
   */
  onCurrentPageDataChange(listOfCurrentPageData: readonly any[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  /**
   * Seleccionar o deseleccionar todos los registros de la página actual
   * @param checked: boolean
   */
  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach((data) => {
      if (data.fraudes) {
        this.updateGruposCheckedSet(data.id, checked);
        data.fraudes.forEach(fraudeGrupo => {
          this.updateFraudesGruposCheckedSet(fraudeGrupo.id, checked)
        });
        return;
      }
      this.updateFraudesCheckedSet(data.id, checked)
    });
    this.refreshCheckedStatus();
    this.enableDisabledActionMassive();
  }

  /**
   * Metodo para seleccionar el grupo y todos sus fraudes
   * @param grupo: Grupo
   * @param checked: checked
   */
  onAllGruposChecked(grupo: Grupo, checked: boolean): void {
    // this.updateGruposCheckedSet(grupo.id, checked);
    grupo.fraudes.forEach(({ id }) => this.updateFraudesGruposCheckedSet(id, checked));
    this.refreshCheckedStatus();
    this.enableDisabledActionMassive();
  }


  /**
   * Seleccionar o deseleccionar fraude
   * @param id: number
   * @param checked: boolean
   * @param isGrupo: boolean: Si es un grupo o no
   */
  onFraudeChecked(id: number, checked: boolean, isGrupo: boolean): void {
    if (!isGrupo) {
      this.updateFraudesCheckedSet(id, checked);
    } else if (isGrupo) {
      this.updateFraudesGruposCheckedSet(id, checked);
    }
    this.refreshCheckedStatus();
    this.enableDisabledActionMassive();
  }

  /**
   * Agregar los ID de fraudes a la lista de seleccionados (Chequeado o no)
   * @param id: number, id del registro
   * @param checked: boolean
   */
  updateFraudesCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  /**
   * Agregar los ID de grupos a la lista de seleccionados
   * @param id: number, id del fraude
   * @param checked: boolean
   */
  updateGruposCheckedSet(id: number, checkedGrupo: boolean): void {
    if (checkedGrupo) {
      this.setGrupoOfCheckedId.add(id);
    } else {
      this.setGrupoOfCheckedId.delete(id);
    }
  }

  /**
   * Agregar los grupos de ID de fraudes a la lista de seleccionados (Chequeado o no)
   * @param id: number, id del registro
   * @param checked: boolean
   */
  updateFraudesGruposCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedIdFraudeGrupo.add(id);
    } else {
      this.setOfCheckedIdFraudeGrupo.delete(id);
    }
  }

  /**
   * Habilitar o deshabilitar acciones masivas
   */
  enableDisabledActionMassive(): void {
    this.accionesMasivas = this.accionesMasivas.map(accion => {
      accion.disabled = true;
      return accion;
    });
    /** Habilitar acción desagrupar, desasignar y analizar si se selecciono 1 o más fraude */
    if (this.setOfCheckedId.size >= 1) {
      this.accionesMasivas[4].disabled = false;
      this.accionesMasivas[5].disabled = false;
    }
    /** Habilitar acción dividir si se selecciono 2 o más fraudes de un grupo */
    if (this.setOfCheckedId.size == 0 && this.setOfCheckedIdFraudeGrupo.size >= 1) {
      this.accionesMasivas[2].disabled = false;
      this.accionesMasivas[4].disabled = false;
      this.accionesMasivas[5].disabled = false;
      if (this.setOfCheckedIdFraudeGrupo.size >= 2) {
        this.accionesMasivas[3].disabled = false;
      }
    }
  }

  /**
   * Metodo para mantener los check seleccionados correctamente tanto para grupos y fraudes sin grupos
   */
  refreshCheckedStatus(): void {
    // Reiniciar campo de acciones masivas cuando no hayan registros seleccionados
    if (this.setOfCheckedId.size <= 0) {
      this.accionMasiva = 0;
    }
    const listOfEnabledData = this.listOfCurrentPageData;
    /** Fraudes */
    this.checked = listOfEnabledData.every((element) => {
      if (!element.fraudes) {
        return this.setOfCheckedId.has(element.id);
      }
      return this.setGrupoOfCheckedId.has(element.id);
    });
    this.indeterminate = listOfEnabledData.some((element) => {
      if (!element.fraudes) {
        return this.setOfCheckedId.has(element.id) && !this.checked;
      }
      return this.setGrupoOfCheckedId.has(element.id) && !this.checked;
    });
    /** Grupos fraudes */
    listOfEnabledData.forEach((element, index) => {
      if (element.fraudes) {
        this.checkedGrupo[index] = element.fraudes.every((fraude) => {
          return this.setOfCheckedIdFraudeGrupo.has(fraude.id);
        });
      }
    });
    /** Grupos fraudes */
    listOfEnabledData.forEach((element, index) => {
      if (element.fraudes) {
        this.indeterminateGrupo[index] = element.fraudes.some((fraude) => {
          return this.setOfCheckedIdFraudeGrupo.has(fraude.id);
        });
      }
    });
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

  /** Metodo para mover filas */
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex);
  }

  /**
   * Método para realizar la acción seleccionada
   */
  async accionMasivaSelect(option: number): Promise<void> {
    /** Si la opción es 0 retornar */
    if (option == 0) return;
    switch (option) {
      // Caso 3: Abrir modal para DESAGRUPAR fraudes
      case 3:
        await Swal.fire(this.utils.getQuestionModalOptions('¿Desea desagrupar los posibles fraudes seleccionados?', ''))
          .then((result) => {
            /* Si el usuario le da click en aceptar, desagrupará los fraudes */
            if (result.isConfirmed) {
              this.desagruparFraudes();
            }
            this.accionMasiva = 0;
          });
        break;
      // Caso 2: Abrir modal para DESASIGNAR fraudes
      case 2:
        await Swal.fire(this.utils.getQuestionModalOptions('¿Desea desasignar y desagrupar los posibles fraudes seleccionados?', ''))
          .then((result) => {
            /* Si el usuario le da click en aceptar, desasignara los fraudes */
            if (result.isConfirmed) {
              this.desasignarFraudes();
            }
            this.accionMasiva = 0;
          });
        break;
      // Caso 4: Abrir modal para DIVIDIR grupos fraudes
      case 4:
        this.dividirGrupo();
        break;
      // Caso 6: Analizar grupos y fraudes
      case 6:
        this.analizarFraudes();
        break;
      default:
        this.utils.openErrorAlert('Opción incorrecta, eliga nuevamente la opción.').then(r => this.accionMasiva = 0);
        break;
    }
  }

  /**
   * Accion para desagrupar fraudes
   */
  async desagruparFraudes(): Promise<void> {
    /** Objeto de posibles fraudes a desagrupar */
    let listaDesagruparFraude: DesagruparFraudeUpdate[] = [];
    this.setOfCheckedId.forEach(id => listaDesagruparFraude.push({ id }));
    this.setOfCheckedIdFraudeGrupo.forEach(id => listaDesagruparFraude.push({ id }));
    // Realizar petición para desagrupar 1 o mas fraudes
    const response = await this.fraudesService.desagruparFraudes(listaDesagruparFraude);
    if (response && response.status === this.utils.successMessage) {
      await Swal.fire(this.utils.getSuccessModalOptions(`Fraudes desagrupados correctamente.`, this.utils.titleSuccessMessage));
      // Refrescar busqueda de fraudes
      await this.searchFraudeService.refreshFraudesSubject$.next(true);
      /** Limpiar grupos y fraudes checked seleccionados */
      this.setOfCheckedId.clear();
      this.setOfCheckedIdFraudeGrupo.clear();
      this.setGrupoOfCheckedId.clear();
    } else {
      await Swal.fire(this.utils.getErrorModalOptions(response.message));
    }
  }

  /**
   * Accion para desasignar fraudes
   */
  async desasignarFraudes(): Promise<void> {
    /** Objeto de posibles fraudes a desagrupar */
    let listaDesasignarFraude: DesagruparFraudeUpdate[] = [];
    this.setOfCheckedId.forEach(id => listaDesasignarFraude.push({ id }));
    this.setOfCheckedIdFraudeGrupo.forEach(id => listaDesasignarFraude.push({ id }));
    // Realizar petición para desasignar 1 o mas fraudes
    const response = await this.fraudesService.desasignarFraudes(listaDesasignarFraude);
    if (response && response.status === this.utils.successMessage) {
      await Swal.fire(this.utils.getSuccessModalOptions(`Fraudes desasignados y desagrupados correctamente.`, this.utils.titleSuccessMessage));
      // Refrescar busqueda de fraudes
      await this.searchFraudeService.refreshFraudesSubject$.next(true);
      /** Limpiar grupos y fraudes checked seleccionados */
      this.setOfCheckedId.clear();
      this.setOfCheckedIdFraudeGrupo.clear();
      this.setGrupoOfCheckedId.clear();
    } else {
      await Swal.fire(this.utils.getErrorModalOptions(response.message));
    }
  }

  /**
   * Accion para dividir grupos de fraudes seleccionados
   */
  async dividirGrupo(): Promise<void> {
    // Filtrar lista de fraudes seleccionados para dividir
    this.fraudesDividir = this.listOfData.filter(fraude => {
      let grupoSelect = false;
      /** Validar que sea un grupo y retornar el grupo de fraude si se selecciona un fraude dentro del grupo */
      if (fraude.isGroup) {
        fraude.fraudes.forEach(grupofraude => {
          this.setOfCheckedIdFraudeGrupo.forEach(id => {
            if (grupofraude.id == id) grupoSelect = true;
          });
        })
        return grupoSelect;
      }
      return false;
    });
    // Abrir modal para dividir grupos
    this.isModalDividir = true;
  }

  /**
   * Accion para analizar fraudes seleccionados
   */
  async analizarFraudes(): Promise<void> {
    // Filtrar lista de fraudes seleccionados para analizar
    const casosPorAnalizar = this.listOfData.filter(value => {
      let grupoSelect = false;
      /** Validar que sea un grupo y retornar el grupo de fraude si se selecciona un fraude dentro del grupo */
      if (value.isGroup) {
        console.log(this.setOfCheckedIdFraudeGrupo)
        console.log(this.setGrupoOfCheckedId)
        value.fraudes.forEach(grupofraude => {
          this.setOfCheckedIdFraudeGrupo.forEach(id => { if (grupofraude.id == id) grupoSelect = true; });
        })
        return grupoSelect;
      }
      /** Retornar los fraudes seleccionados */
      let fraudeSelect = false;
      this.setOfCheckedId.forEach(id => {
        if (value.id == id)
          fraudeSelect = true;
      });
      return fraudeSelect;
    });
    console.log(this.setOfCheckedIdFraudeGrupo)
    const data = new Set([...this.setOfCheckedId, ...this.setOfCheckedIdFraudeGrupo])

    /** Emitir lista de fraudes seleccionados */
    this.analizarFraudeService.fraudesPorAnalizar$.next(casosPorAnalizar);
    /** Emitir solo ID's de los fraudes seleccionados */
    this.analizarFraudeService.idFraudesPorAnalizar$.next(data);
    /** Redirigir a la ruta (Analizar) */
    await this.router.navigateByUrl('/main/antifraude/fraudes/analizar');
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
