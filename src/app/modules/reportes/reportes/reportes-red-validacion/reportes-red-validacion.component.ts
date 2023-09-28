import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';
import { ServiceRateService } from 'src/app/modules/tarifas/service/service-rate.service';
import { Company } from 'src/app/modules/transporte/models/company';
import { ViewCollectionService } from 'src/app/modules/transporte/transporte/view-collection/view-collection.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { IReporte } from 'src/app/shared/models/reportes.interface';

@Component({
  selector: 'app-reportes-red-validacion',
  templateUrl: './reportes-red-validacion.component.html',
  styleUrls: ['./reportes-red-validacion.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class ReportesRedValidacionComponent implements OnInit {

  procesos: any[] = [];
  nombre: any[] = [];
  reportes: IReporte[];
  reporteInvalido: boolean = false;

  filname: string = '';

  // CONFIGURACION NGMODEL
  companiaModel: any = 0;
  diaModel: number | string  | any = 0;

  conduct: any[] = []
  vehiculos: any[] = [];

  // ESTADOS FORMULARIOS  
  estadoFormulario1: boolean = true;
  enviarFormulario: boolean = false;
  descargar: boolean = false;
  disponible: boolean = true;

  // FORMULARIO 2
  companies: Company[] = [];
  companiess: any[] = [];
  dias: string[] = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]
  idConductors: string = '';
  idVehiculo: number = 0;
  travel: any[] = [];
  fechaRango!: Date | null;
  rutas: any;
  data: any;
  company: string = '';
  entidad: any;
  PATH = 'collects';
  STATE_CODE = 'RT';

  urlFile;

  constructor(
    private utils: UtilsService,
    private _viewCollectionService: ViewCollectionService,
    private api: DescuentosService,
    private sanitizer: DomSanitizer
  ) {
    this.reportes = [
      {
        id: 1,
        name: 'Localización de errores',
        path: '',
        estado: false,
        orden: 4
      },
      {
        id: 2,
        name: 'Funcionamiento dispositivo de validación',
        path: '',
        estado: false,
        orden: 3
      },
      {
        id: 3,
        name: 'Usos por franja horaria',
        path: '',
        estado: true,
        orden: 1
      },
      {
        id: 4,
        name: 'Usos por puntos de validación',
        path: '',
        estado: false,
        orden: 2
      },
      {
        id: 5,
        name: 'Cantidad de validaciones',
        path: '',
        estado: false,
        orden: 5
      }
    ]
    this.reportes = this.reportes.sort((a: any, b: any) => a.orden - b.orden)
  }

  async ngOnInit() {
    await this.loadCompanies()
    await this.cargarData();
    this.validar()
  }

  validar() {
    if (this.companiess.length == 0) {
      this.utils.openInfoAlert("Este reporte no está disponible, no cuentas con empresas de transporte").then(() => {
        this.disponible = false;
      });
    }
  }

  getSelectedEntity() {
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));
    if (entity) {
      const username = entity.username;
      return username;
    }
    return null;
  }

  reiniciarVaribles() {
    this.companiaModel = null;
    this.company = '';
    this.rutas = '';
    this.diaModel = 0;
    this.idConductors = '';
    this.idVehiculo = 0;
    this.travel.length = 0;
    this.enviarFormulario = false;
    this.fechaRango = null;
    this.urlFile = '';
    this.descargar = false;
    this.reporteInvalido = false;
    this.disponible = true;
  }

  recibirEmiter(event: number) {
    // REINICIAMOS VARIABLES
    this.reiniciarVaribles();

    for (let index = 0; index < this.reportes.length; index++) {
      if (event != index) {
        this.reportes[index].estado = false;
      } else {
        this.reportes[event].estado = true
        if (index == 0 && (this.companiess.length == 0)) {
          this.utils.openInfoAlert("Este reporte no está disponible, no cuentas con empresas de transporte").then(() => {
            this.disponible = false;
          });
          return;
        }
        if (index > 0 && (this.companies.length == 0)) {
          this.utils.openInfoAlert("Este reporte no está disponible, no cuentas con empresas de transporte").then(() => {
            this.disponible = false;
          });
        }
      }
    }
    this.evaluarFormulario()
  }

  async cargarData() {
    const response = await this._viewCollectionService.findAll(this.utils.getBasicEndPoint(`routes/prog/procesos`));
    if (response.data) {
      this.companiess = response.data.entities;
    }
  }

  async cargarRutas(event) {
    const response = await this._viewCollectionService.findAll(this.utils.getBasicEndPoint(`routes/rutas/procesos?idProceso=${event}`));
    if (response.data) {
      this.travel = response.data.entities;
    }
  }
  async cargarVehiculos(event) {
    const response = await this._viewCollectionService.findAll(this.utils.getBasicEndPoint(`routes/vehiculos/procesos?idProceso=${event}`));
    if (response.data) {
      this.vehiculos = response.data.entities;
    }
  }

  async cargarConductor(event) {
    const response = await this._viewCollectionService.findAll(this.utils.getBasicEndPoint(`routes/conductores/procesos?idProceso=${event}`));
    if (response.data) {
      this.conduct = response.data.entities;
    }
  }


  async loadCompanies() {
    const companies = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (companies) {
      this.companies = companies.companies.filter(
        (company: Company) => company.active && company.typeId == 1
      );
    }
    this.entidad = companies;
  }

  evaluarFormulario(): {} {
    const report = this.reportes.find((element: IReporte) => element.estado == true)
    switch (report?.id) {
      case 1: {
        this.filname = 'XT_RRV04_LocalizacionErrores_202307';
        if (this.fechaRango && this.companiaModel) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RRV04_LocalizacionErrores_202307",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.getSelectedEntity(),
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10),
              "PROCESO": this.companiaModel,
            }
          }
        }
        return {};
      }
      case 2: {
        this.filname = 'XT_RRV03_FuncionamientoDispositivoValidacion_202307';
        if (this.fechaRango && this.companiaModel) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RRV03_FuncionamientoDispositivoValidacion_202307",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.getSelectedEntity(),
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10),
              "PROCESO": this.companiaModel == 'Todos' ? null : this.companiaModel,
            }
          }
        }
        return {};
      }
      case 3: {
        this.filname = 'XT_RRV01_UsosFranjaHoraria_202304';
        if (this.fechaRango && this.company && this.rutas && this.idVehiculo && this.idConductors) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RRV01_UsosFranjaHoraria_202304",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.getSelectedEntity(),
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10),
              "IDPROCESO": this.company,
              "IDRUTA": this.rutas,
              "IDVEHICULO": this.idVehiculo,
              "IDCONDUCTOR": this.idConductors,
              "DIA": this.diaModel = ' Todos' ? null : this.diaModel + 1
            }
          }
        }
        return {};
      }
      case 4: {
        this.filname = 'XT_RRV02_UsoPuntoValidacion_202305';
        if (this.companiaModel, this.fechaRango) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RRV02_UsoPuntoValidacion_202305",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.getSelectedEntity(),
              "IDPROCESO": this.companiaModel == 'Todos' ? null : this.companiaModel,
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10)
            }
          }
        }
        return {};
      }
      case 5: {
        this.filname = 'XT_RRV05_CantidadValidacionesValor_202307';
        if (this.fechaRango && this.companiaModel) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RRV05_CantidadValidacionesValor_202307",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TICKETING",
            "params": {
              "USUARIO": this.getSelectedEntity(),
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10),
              "PROCESO": this.companiaModel == 'Todos' ? null : this.companiaModel,
            }
          }
        }
        return {};
      }
      default: {
        return {
          "message": "No esta en el rango de parametros"
        }
      }
    }
  }

  renderFileInTemplate() {
    const valor = this.evaluarFormulario();
    if (valor == false) {
      this.utils.openInfoAlert("Reporte no disponible")
      return;
    }
    if (this.reporteInvalido) {
      this.api.downloadImageDiscountReports(this.evaluarFormulario())
        .subscribe(
          {
            next: (value: Blob) => {
              if (value.size <= 1000) {
                this.urlFile = '';
                this.utils.openInfoAlert("No existen datos")
                return;
              }
              const urlCreator = window.URL || window.webkitURL;
              this.urlFile = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(value));
              this.urlFile = this.urlFile.changingThisBreaksApplicationSecurity;
              this.descargar = true;
            },
            error: (err: any) => {
              this.utils.openErrorAlert("Falla en el servidor, comuniquese con la línea de soporte.")
              // REINICIAMOS VARIABLES
              this.reiniciarVaribles();
            },
            complete: () => {
              console.log("La suscripción al observable ha finalizado");
            },
          }
        )
    }
    if (!this.reporteInvalido) {
      this.enviarFormulario = true;
      setTimeout(() => {
        this.enviarFormulario = false;
      }, 4000)
    }
  }

  renderFileInTemplateDownloads() {
    this.api.downloadImageDiscountReports(this.evaluarFormulario())
      .subscribe(
        {
          next: (value: Blob) => {
            const urlCreator = window.URL || window.webkitURL;
            this.urlFile = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(value));
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
