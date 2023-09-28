import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

// Services
import { AnalizarFraudeService } from '../../services/analizar-fraude.service';
import { LoginServiceService } from 'src/app/serivces/login-service/login-service.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

// Interfaces
import { IUser } from 'src/app/modules/antifraudes/auth-antifraude/interfaces/authAntifraude.interfaces';
import { SancionRegistrada } from '../../interfaces/analizar-acciones.interfaces';
import { ServiceRateService } from 'src/app/modules/tarifas/service/service-rate.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';

@Component({
  selector: 'app-data-table-sancion',
  templateUrl: './data-table-sancion.component.html',
  styleUrls: ['./data-table-sancion.component.scss']
})
export class DataTableSancionComponent implements OnInit {

  /** Objeto para mostrar en la tabla */
  listOfData: SancionRegistrada[] = [];

  /** Objeto para filtrar tabla */
  listOfDataFilter: SancionRegistrada[] | undefined;

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

  // PDF
  isVisiblePDF: boolean = false;
  urlFile;
  // Variable para manejar la suscripción
  subscriptions: Subscription[] = [];

  constructor(private analizarFraudeService: AnalizarFraudeService,
    private authService: LoginServiceService,
    private sanitazer: DomSanitizer,
    private _api: DescuentosService,
    private utils: UtilsService) { }

  ngOnInit(): void {
    /** Obtener ID's de fraudes emitidos desde tabla por analizar */
    this.subscriptions.push(this.analizarFraudeService.idFraudesPorAnalizarBehavior.subscribe(idFraudesSet => {
      this.setOfCheckedId = idFraudesSet;
      this.loadSancionesRegistradas();
    }));
  }

  /** 
   * Cargar lista de fraudes analizados
   */
  async loadSancionesRegistradas(): Promise<any> {
    /** Validar que hayan casos para ejecutar la peticion */
    if (this.setOfCheckedId.size <= 0) return;
    /** Obtener usuario */
    const auth: IUser = this.authService.getAuth();
    const idUsuario = auth.user.id;
    // Convertir setNumber a Array de numeros para buscar dicho id de fraude en la lista de fraudes analizados
    const arrayObj: number[] = [];
    this.setOfCheckedId.forEach(id => arrayObj.push(id));
    // Realizar petición para obtener lista de fraudes analizados
    const response = await this.analizarFraudeService.getSancionesRegistradas(idUsuario, arrayObj);
    if (response && response.status === this.utils.successMessage) {
      this.listOfData = response.data.registrar_fraude;
      const json: any[] = JSON.parse(String(localStorage.getItem('fraude')));
      json.forEach((element, i) => {
        if (element.isGroup) {
          json[i].fraudes.forEach(element => {
            arrayObj.push(element.id)
          });
        }
      })
      // Filtrar los fraudes que seleccione el usuario de la lista de fraudes analizados
      this.listOfData = this.listOfData.filter(fraude => {
        return arrayObj.some(id => id == fraude.fkfraude);
      }).map(fraude => {
        fraude.apliSancion = fraude.apliSancion.replace(/,/g, ', ');
        return fraude;
      });
      this.analizarFraudeService.fraudesSancionados$.next(this.listOfData);
    } else {
      await this.utils.openErrorAlert(response.message);
    }
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
        // Eliminar los milisegundos de la fecha
        const fechayHora = current.fecha.toString().slice(0, 16);
        // Formatear fecha con el mismo formato que se muestra en la tabla
        const formatDate = this.utils.formatDateHoursToString(new Date(fechayHora));
        return this.utils.validateObject(current.tipo) && current.tipo.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.detSancion) && current.detSancion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.fkApliSancion) && current.fkApliSancion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.observacion) && current.observacion.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
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
            console.log(err)
          },
          complete: () => {
            console.log("La suscripción al observable ha finalizado");
          },
        }
      )
  }
}
