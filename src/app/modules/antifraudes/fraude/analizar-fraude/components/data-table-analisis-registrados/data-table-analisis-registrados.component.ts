import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

// Services
import { AnalizarFraudeService } from '../../services/analizar-fraude.service';
import { LoginServiceService } from 'src/app/serivces/login-service/login-service.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

// Interfaces
import { IUser } from '../../../../auth-antifraude/interfaces/authAntifraude.interfaces';
import { FraudeAnalizado } from '../../interfaces/analizar-acciones.interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';

@Component({
  selector: 'app-data-table-analisis-registrados',
  templateUrl: './data-table-analisis-registrados.component.html',
  styleUrls: ['./data-table-analisis-registrados.component.scss']
})
export class DataTableAnalisisRegistradosComponent implements OnInit {

  /** Objeto para mostrar en la tabla */
  listOfData: FraudeAnalizado[] = [];

  /** Objeto para filtrar tabla */
  listOfDataFilter: FraudeAnalizado[] | undefined;

  /** Variable para la busqueda global */
  filterValue: string = '';

  /** Variable para obtener todos los IDS de fraudes seleccionados en la tabla */
  setOfCheckedId = new Set<number>();

  /** Paginación */

  /** Página inicial */
  page: number = 1;

  /** Variable para definir límite de 15 registros por página. */
  numberRow: number = 5;

  /** Registros por paginas */
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  /** Fin paginacion */

  // Variable para manejar la suscripción
  subscriptions: Subscription[] = [];

  // PDF
  isVisiblePDF: boolean = false;
  urlFile;

  constructor(private analizarFraudeService: AnalizarFraudeService,
    private authService: LoginServiceService,
    private sanitazer: DomSanitizer,
    private _api: DescuentosService,
    private utils: UtilsService) { }

  ngOnInit(): void {
    /** Obtener ID's de fraudes emitidos desde tabla por analizar */
    this.subscriptions.push(this.analizarFraudeService.idFraudesPorAnalizarBehavior.subscribe(idFraudesSet => {
      console.log(idFraudesSet)
      this.setOfCheckedId = idFraudesSet;
      this.loadFraudesAnalizados();
    }));
  }

  /** 
   * Cargar lista de fraudes analizados
   */
  async loadFraudesAnalizados(): Promise<any> {
    /** Validar que hayan casos para ejecutar la peticion */
    if (this.setOfCheckedId.size <= 0) return;
    /** Obtener usuario */
    const auth: IUser = this.authService.getAuth();
    const idUsuario = auth.user.id;
    // Realizar petición para obtener lista de fraudes analizados
    const response = await this.analizarFraudeService.getFraudesAnalizados(idUsuario);
    if (response && response.status === this.utils.successMessage) {
      this.listOfData = response.data.registrar_fraude;
      // Convertir setNumber a Array de numeros para buscar dicho id de fraude en la lista de fraudes analizados
      const arrayObj: number[] = [];
      this.setOfCheckedId.forEach(id => arrayObj.push(id));
      const json: any[] = JSON.parse(String(localStorage.getItem('fraude')));
      json.forEach((element, i) => {
        if (element.isGroup) {
          json[i].fraudes.forEach(element => {
            arrayObj.push(element.id)
          });
        }
      });
      // Filtrar los fraudes que seleccione el usuario de la lista de fraudes analizados
      this.listOfData = this.listOfData.filter(fraude => {
        return arrayObj.some(id => id == fraude.fkfraude);
      });
      // this.listOfData = this.listOfData.sort((a: any, b:any) => (a.fecha!.valueOf() > b.fecha!.valueOf() ? 1 : -1))

      this.analizarFraudeService.fraudesAnalizados$.next(this.listOfData);
    } else {
      await this.utils.openErrorAlert(response.message);
    }
  }

  /**
   * Método para filtrar contenido de la tabla
   */
  search(): void {
    let data: FraudeAnalizado[];
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.listOfData;
    }
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.listOfDataFilter.filter((current) => {
        // Eliminar los milisegundos de la fecha
        const fechayHora = current.fecha.toString().slice(0, 16);
        // Formatear fecha con el mismo formato que se muestra en la tabla
        const formatDate = this.utils.formatDateHoursToString(new Date(fechayHora));
        return this.utils.validateObject(current.causa) && current.causa.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.detCausa) && current.detCausa.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.resolucion) && current.resolucion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.accion) && current.accion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(formatDate) && formatDate.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.nomusuario) && current.nomusuario.toString().toUpperCase().includes(this.filterValue.toUpperCase())
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

  /** Resetear tab y desuscribirse */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
          },
          complete: () => {
            console.log("La suscripción al observable ha finalizado");
          },
        }
      )
  }

}
