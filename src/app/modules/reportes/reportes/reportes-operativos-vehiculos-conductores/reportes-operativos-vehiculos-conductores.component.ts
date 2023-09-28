import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';
import { ServiceRateService } from 'src/app/modules/tarifas/service/service-rate.service';
import { Company } from 'src/app/modules/transporte/models/company';
import { ViewCollectionService } from 'src/app/modules/transporte/transporte/view-collection/view-collection.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { IReporte } from 'src/app/shared/models/reportes.interface';

@Component({
  selector: 'app-reportes-operativos-vehiculos-conductores',
  templateUrl: './reportes-operativos-vehiculos-conductores.component.html',
  styleUrls: ['./reportes-operativos-vehiculos-conductores.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class ReportesOperativosVehiculosConductoresComponent implements OnInit {

  procesos: any[] = [];
  conductor: any[] = [];
  reportes: IReporte[];
  reporteInvalido: boolean = false;

  filname: string = '';

  // CONFIGURACION NGMODEL
  companiaModel: number | string | null = 0;
  idVehiculoModel: number = 0;
  idVehiculo: number = 0;

  horaIni: Date | null = null;
  horaFin: Date | null = null;

  fechaRango!: Date | undefined;
  enviarFormulario: boolean = false;
  estadoEnvio: boolean = false;

  servcios: any[] = [];
  serviciosModel: number = 0;


  // CONFIGURACION USERNAME
  id: number = 0;
  username: string = '';

  // ESTADOS FORMULARIOS
  estadoFormulario1: boolean = true;
  descargar: boolean = false;
  disponible: boolean = true;

  // CARGAR FORMULARIO 1
  companies: Company[] = [];
  formaPago: string[] = ["Tarjeta", "Efectivo"]
  idConductors: string = '';
  plate: string = '';
  travel: any[] = [];
  fechaIni!: Date;
  fechaFin!: Date;
  rutas: any;
  data: any;
  company: string = '';
  entidad: any;
  PATH = 'collects';
  STATE_CODE = 'RT';

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
        name: 'Calificación de conductores',
        path: '',
        estado: false,
        orden: 2
      },
      {
        id: 2,
        name: 'Vigencia de documentos legales',
        path: '',
        estado: false,
        orden: 7
      },
      {
        id: 3,
        name: 'Cumplimiento de requerimientos legales',
        path: '',
        estado: false,
        orden: 6
      },
      {
        id: 4,
        name: 'Programa de Mantenimiento',
        path: '',
        estado: false,
        orden: 5
      },
      {
        id: 5,
        name: 'Servicios prestados',
        path: '',
        estado: true,
        orden: 1
      },
      {
        id: 6,
        name: 'Mantenimiento Preventivo',
        path: '',
        estado: false,
        orden: 4
      },
      {
        id: 7,
        name: 'Consumos de combustible',
        path: '',
        estado: false,
        orden: 3
      }
    ]
    this.reportes = this.reportes.sort((a: any, b: any) => a.orden - b.orden)
  }

  async ngOnInit() {
    await this.getSelectedEntity();
    await this.loadCompanies();
    await this.getUsername();
    await this.servicios();
    await this.validar();
  }


  async servicios() {
    const jsonUser = JSON.parse(localStorage.getItem('auth')!);
    console.log(jsonUser.user.services)
    this.servcios = jsonUser.user.services.filter(element => element.id == 2);
    this.serviciosModel = this.servcios.length > 0 ? this.servcios[0].id : 0;
    if (this.servcios.length == 0) {
      this.disponible = false;
      this.utils.openInfoAlert("Este reporte no está disponible, no cuentas con empresas de recaudo a ningún servicio")
      return;
    }
    this.username = (jsonUser.user.firstName ? jsonUser.user.firstName : '') + " " + (jsonUser.user.lastName ? jsonUser.user.lastName : '');
  }

  cargarRutas() {
    this.idConductors = this.rutas.id;
    this.idVehiculo = this.rutas.vehicleId;
  }

  async cargarData() {
    // this.estadoFormulario1 = false;
    const company = this.companies.filter((element) => element.name == this.company);
    this.travel.length = 0;
    const companyData = this.companies.find((element: Company) => element.id == this.companiaModel);
    const response = await this._viewCollectionService.findAll(this.utils.getCollectionEndPoint(`${this.PATH}/?state=${this.STATE_CODE}&idCompany=${companyData?.id}&idEntity=${this.entidad.entities[0].id}`));
    if (response.data) {
      this.data = response.data.collects;
      for (let index = 0; index < this.data.length; index++) {
        this.travel.push(this.data[index].travel)
      }
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

  recibirEmiter(event: number) {
    this.company = ''
    this.idConductors = '';
    this.idVehiculoModel = 0;
    this.companiaModel = 0;
    this.travel.length = 0;
    this.enviarFormulario = false;
    this.estadoEnvio = false;
    this.fechaRango = undefined;
    this.urlFile = '';
    this.reporteInvalido = false;
    this.disponible = true;
    this.descargar = false;

    for (let index = 0; index < this.reportes.length; index++) {
      if (event != index) {
        this.reportes[index].estado = false;
      } else {
        this.reportes[event].estado = true
        this.disponible = true;

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
    }
    this.getSelectedEntity();
  }

  validar() {
    if (this.companies.length == 0) {
      this.utils.openInfoAlert("Este reporte no está disponible, no cuentas con empresas de transportes");
      this.disponible = false;
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
    this.estadoEnvio = false;
    const report = this.reportes.find((element: IReporte) => element.estado == true)
    switch (report?.id) {
      case 1: {
        this.filname = 'XT_RV06_CalificacionConductores_202304';
        if (this.companiaModel) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RV06_CalificacionConductores_202304",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "IDPROCESO": this.companiaModel,
              "IDCONDUCTOR": null
            }
          }
        }
        return {};
      }
      case 2: {
        this.filname = 'XT_RV04_DocumentosVehiculos_202304';
        if (this.fechaRango && this.companiaModel) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RV04_DocumentosVehiculos_202304",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10),
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "SERVICIO": null,
              "IDPROCESO": this.companiaModel == 'Todos' ? null : this.companiaModel,
              "IDVEHICULO": null
            }
          }
        }
        return {};
      }
      case 3: {
        this.filname = 'XT_RV07_DocumentosConductores_202304';
        if (this.companiaModel) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RV07_DocumentosConductores_202304",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "IDPROCESO": this.companiaModel == 'Todos' ? null : this.companiaModel,
              "IDCONDUCTOR": null
            }
          }
        }
        return {};
      }
      case 4: {
        this.filname = 'XT_RV05_ProgramaMantenimiento_202304';
        if (this.fechaRango && this.companiaModel) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RV05_ProgramaMantenimiento_202304",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10),
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "IDPROCESO": this.companiaModel == 'Todos' ? null : this.companiaModel
            }
          }
        }
        return {};
      }
      case 5: {
        this.filname = 'XT_RV03_ServiciosPrestados_202304';
        if (this.fechaRango && this.companiaModel) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RV03_ServiciosPrestados_202304",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10),
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "IDPROCESO": this.companiaModel == 'Todos' ? null : this.companiaModel
            }
          }
        }
        return {};
      }
      case 6: {
        this.filname = 'XT_RV02_MantenimientoPreventivo_202304';
        if (this.fechaRango && this.companiaModel) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RV02_MantenimientoPreventivo_202304",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10),
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "IDPROCESO": this.companiaModel == 'Todos' ? null : this.companiaModel
            }
          }
        }
        return {};
      }
      case 7: {
        this.filname = 'XT_RV01_ConsumoCombustible_202304';
        if (this.fechaRango && this.company) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RV01_ConsumoCombustible_202304",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "IDPROCESO": this.company == 'Todos' ? null : this.company,
              "USUARIO": this.username,
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10),
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
