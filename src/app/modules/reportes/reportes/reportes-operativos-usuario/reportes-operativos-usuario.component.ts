import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';
import { ServiceRateService } from 'src/app/modules/tarifas/service/service-rate.service';
import { Company } from 'src/app/modules/transporte/models/company';
import { ViewCollectionService } from 'src/app/modules/transporte/transporte/view-collection/view-collection.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { IReporte } from 'src/app/shared/models/reportes.interface';

@Component({
  selector: 'app-reportes-operativos-usuario',
  templateUrl: './reportes-operativos-usuario.component.html',
  styleUrls: ['./reportes-operativos-usuario.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class ReportesOperativosUsuarioComponent implements OnInit {

  procesos: any[] = [];
  // rutas: any[] = [];
  temporada: any[] = [];
  reportes: IReporte[];
  reporteInvalido: boolean = false;
  enviarFormulario: boolean = false;

  filname: string = '';

  // CONFIGURACION USERNAME
  id: number = 0;
  username: string = '';

  // ESTADOS FORMULARIOS
  estadoFormulario1: boolean = true;
  descargar: boolean = false;
  horaIni: Date | null = null;
  horaFin: Date | null = null;
  // CARGAR FORMULARIO 1
  companies: any[] = [];
  formaPago: string[] = ["Tarjeta", "Efectivo"]
  conductors: string = '';

  conduct: any[] = []
  vehiculos: any[] = [];


  plate: string = '';
  travel: any[] = [];
  fechaRango: Date | undefined;
  rutas: any;
  data: any;
  company: string | null = '';
  vehiculo: number = 0;

  idConductors: string = '';
  idVehiculo: number = 0;
  entidad: any;
  PATH = 'collects';
  STATE_CODE = 'RT';

  disponible: boolean = true;

  // CARGAR FORMULARIO 2
  tipoUsuario: string[] = ["Anonimo", "No identificado"]
  urlFile;

  constructor(
    private utils: UtilsService,
    private api: DescuentosService,
    private _viewCollectionService: ViewCollectionService,
    private sanitizer: DomSanitizer
  ) {
    this.reportes = [
      {
        id: 1,
        name: 'Estadística de alarmas',
        path: '',
        estado: false,
        orden: 2
      },
      {
        id: 2,
        name: 'Tiempo de operación del vehículo',
        path: '',
        estado: false,
        orden: 5
      },
      {
        id: 3,
        name: 'Afluencia por recorrido',
        path: '',
        estado: false,
        orden: 6
      },
      {
        id: 4,
        name: 'Distancia recorrido',
        path: '',
        estado: false,
        orden: 7
      },
      {
        id: 5,
        name: 'Matriz de ascensos y descensos',
        path: '',
        estado: false,
        orden: 3
      },
      {
        id: 6,
        name: 'Densidad de carga',
        path: '',
        estado: true,
        orden: 1
      },
      {
        id: 7,
        name: 'Tiempos de recorrido',
        path: '',
        estado: false,
        orden: 4
      }
    ]
    this.reportes = this.reportes.sort((a: any, b: any) => a.orden - b.orden)
  }

  async ngOnInit() {
    await this.loadCompanies();
    await this.getSelectedEntity();
    await this.cargarData();
    await this.getUsername();
    await this.validar();
  }

  validar() {
    if (this.companies.length == 0) {
      this.utils.openInfoAlert("Este reporte no está disponible, no cuentas con empresas de transportes");
      this.disponible = false;
    }
  }

  async cargarData() {
    const response = await this._viewCollectionService.findAll(this.utils.getBasicEndPoint(`routes/prog/procesos`));
    if (response.data) {
      this.companies = response.data.entities;
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

  cargarRuta(event) {
    console.log(event)
    this.rutas = event.idRuta;
    this.idVehiculo = event.idVehiculo;
    this.idConductors = event.idConductor;
  }

  async loadCompanies() {
    const companies = JSON.parse(localStorage.getItem('selectedEntity')!);
    this.entidad = companies;
  }

  recibirEmiter(event: number) {
    // REINICIAMOS VARIABLES
    this.company = null;
    this.vehiculo = 0;
    this.idConductors = '';
    this.idVehiculo = 0;
    this.conductors = '';
    this.plate = '';
    this.rutas = '';
    this.urlFile = '';
    this.fechaRango = undefined;
    this.descargar = false;
    this.horaIni = null;
    this.horaFin = null;
    this.enviarFormulario = false;
    this.reporteInvalido = false;
    this.disponible = true;

    this.getSelectedEntity();

    for (let index = 0; index < this.reportes.length; index++) {
      if (event != index) {
        this.reportes[index].estado = false;
      } else {
        this.reportes[event].estado = true
        switch (index) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6: {
            if (this.companies.length == 0) {
              this.utils.openInfoAlert("Este reporte no está disponible, no cuentas con empresas de transportes").then(() => {
                this.disponible = false;
              });
            }
          }
            break;
        }
      }
    }
  }

  getSelectedEntity(): void {
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));
    if (entity) {
      this.id = entity.userId;
    }
  }

  async getUsername() {
    const jsonUser = JSON.parse(localStorage.getItem('auth')!);
    this.username = (jsonUser.user.firstName ? jsonUser.user.firstName : '') + " " + (jsonUser.user.lastName ? jsonUser.user.lastName : '');
  }

  evaluarFormulario(): {} {
    const report = this.reportes.find((element: IReporte) => element.estado == true)
    switch (report?.id) {
      case 1: {
        this.filname = 'XT_RU01_AlarmasEventosConfig_202303';
        if (this.company) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RU01_AlarmasEventosConfig_202303",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "ID_USUARIO": this.id,
              "ID_ENTIDAD": JSON.parse(localStorage.getItem('selectedEntity')!).entities[0].id,
              "ID_SERVICIO": null,
              "PROCESO": this.company == 'Todos' ? null : this.company,
              "PERIODO": null,
            }
          }
        }
        return {};
      }
      case 2: {
        this.filname = 'XT_RU03_TiempoOperacion_202304';
        if (this.fechaRango && this.company && this.idVehiculo) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RU03_TiempoOperacion_202304",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "IDPROCESO": this.company,
              "IDVEHICULO": this.idVehiculo,
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10),
            }
          }
        }
        return {};
      }
      case 3: {
        this.filname = 'XT_RU07_AfluenciaRecorrido_202304';
        if (this.idVehiculo && this.fechaRango && this.rutas) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RU07_AfluenciaRecorrido_202304",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "IDRUTA": this.rutas,
              "IDPROCESO": this.company,
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10),
              "IDVEHICULO": this.idVehiculo,
            }
          }
        }
        return {};
      }
      case 4: {
        this.filname = 'XT_RU02_DistanciaRutas_202303';
        if (this.idVehiculo && this.idConductors && this.horaIni && this.horaFin && this.fechaRango && this.rutas) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RU02_DistanciaRutas_202303",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "IDRUTA": this.rutas,
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10),
              "IDVEHICULO": this.idVehiculo,
              "CONDUCTOR": this.idConductors,
              "HORAINI": this.horaIni?.getHours() + ":" + this.horaIni?.getMinutes(),
              "HORAFIN": this.horaFin?.getHours() + ":" + this.horaFin?.getMinutes()
            }
          }
        }
        return {};
      }
      case 5: {
        this.filname = 'XT_RU04_MatrizAscensosDescensos_202304';
        if (this.idVehiculo && this.fechaRango && this.company && this.rutas) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RU04_MatrizAscensosDescensos_202304",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "IDRUTA": this.rutas,
              "IDPROCESO": this.company,
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10),
              "IDVEHICULO": this.idVehiculo
            }
          }
        }
        return {};
      }
      case 6: {
        this.filname = 'XT_RU05_DensidadCarga_202304';
        if (this.idVehiculo && this.idConductors && this.horaIni && this.horaFin && this.fechaRango && this.rutas) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RU05_DensidadCarga_202304",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "IDRUTA": this.rutas,
              "FECHA_INICIO": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10),
              "IDVEHICULO": this.idVehiculo,
              "CONDUCTOR": this.idConductors,
              "HORAINI": this.horaIni?.getHours() + ":" + this.horaIni?.getMinutes(),
              "HORAFIN": this.horaFin?.getHours() + ":" + this.horaFin?.getMinutes()
            }
          }
        }
        return {};
      }
      case 7: {
        this.filname = 'XT_RU06_TiempoRecorrido_202304';
        if (this.company && this.idVehiculo && this.fechaRango) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RU06_TiempoRecorrido_202304",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10),
              "IDVEHICULO": this.idVehiculo,
              "IDPROCESO": this.company
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
              console.log(err)
              this.utils.openErrorAlert("Falla en el servidor, comuniquese con la línea de soporte.")
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
