import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';
import { ServiceRateService } from 'src/app/modules/tarifas/service/service-rate.service';
import { Company } from 'src/app/modules/transporte/models/company';
import { ViewCollectionService } from 'src/app/modules/transporte/transporte/view-collection/view-collection.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { IReporte } from 'src/app/shared/models/reportes.interface';

@Component({
  selector: 'app-reportes-servicios',
  templateUrl: './reportes-servicios.component.html',
  styleUrls: ['./reportes-servicios.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class ReportesServiciosComponent implements OnInit {

  reportes: IReporte[];
  reporteInvalido: boolean = false;
  companies: Company[] = [];
  travel: any[] = [];
  entidad: any;
  data: any;

  // CONFIGURACION USERNAME
  id: number = 0;
  username: string = '';

  // CONFIGURACION MODEL
  companyModel: number | string = 0;
  idCompanyModel: number = 0;
  fechaRangoModel: Date | undefined;
  idVehiculoModel: number = 0;
  idConductorModel: number = 0;
  idRutaModel: number = 0;
  diaModel: number = 0;
  filname: string = '';

  // MANEJAR FORMULARIOS
  estadoEnvio: boolean = false;
  enviarFormulario: boolean = false;
  descargar: boolean = false;
  disponible: boolean= true;

  PATH = 'collects';
  STATE_CODE = 'RT';

  // PDF
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
        name: 'Tiempos y distancias promedio',
        path: '',
        estado: false,
        orden: 5
      },
      {
        id: 2,
        name: 'Intervalos de servicio',
        path: '',
        estado: false,
        orden: 4
      },
      {
        id: 3,
        name: 'Kilómetros programados vs realizados',
        path: '',
        estado: false,
        orden: 6
      },
      {
        id: 6,
        name: 'Cumplimiento de planes de servicio',
        path: '',
        estado: false,
        orden: 3
      },
      {
        id: 4,
        name: 'Porcentaje de ocupación de vehículos',
        path: '',
        estado: false,
        orden: 2
      },
      {
        id: 5,
        name: 'Número de vehículos en operación',
        path: '',
        estado: true,
        orden: 1
      }
    ]

    this.reportes = this.reportes.sort((a: any, b: any) => a.orden - b.orden)
  }

  ngOnInit(): void {
    this.loadCompanies();
    this.getSelectedEntity();
    this.validar();
  }

  recibirEmiter(event: number) {
    // RESETEAR VALORES
    this.companyModel = 0;
    this.idCompanyModel = 0;
    this.idConductorModel = 0;
    this.idRutaModel = 0;
    this.idVehiculoModel = 0;
    this.fechaRangoModel = undefined;
    this.urlFile = '';
    this.enviarFormulario = false;
    this.travel.length = 0;
    this.descargar = false;
    this.reporteInvalido = false;
    this.disponible = true;

    for (let index = 0; index < this.reportes.length; index++) {
      if (event != index) {
        this.reportes[index].estado = false;
      } else {
        this.reportes[event].estado = true
        if (this.companies.length == 0) {
          this.utils.openInfoAlert("Este reporte no está disponible, no cuentas con empresas de transporte").then(() => {
            this.disponible = false;
          });
        }
      }
    }
    this.getSelectedEntity();
  }

  getSelectedEntity(): void {
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));
    console.log(entity)
    if (entity) {
      this.username = entity.username;
      this.id = entity.userId;
    }
  }

  async cargarData() {
    this.travel.length = 0;
    const companyData = this.companies.find((element: Company) => element.id == this.companyModel || element.id == this.companyModel);
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

  validar() {
    if (this.companies.length == 0) {
      this.utils.openInfoAlert("Este reporte no está disponible, no cuentas con empresas de transporte").then(() => {
        this.disponible = false;
      });
    }
  }

  evaluarFormulario(): {} {
    this.estadoEnvio = false;
    const report = this.reportes.find((element: IReporte) => element.estado == true)
    switch (report?.id) {
      case 1: {
        this.filname = 'XT_RCS04_TiempoDistanciaPromedio_202306';
        if (this.companyModel && this.fechaRangoModel) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RCS04_TiempoDistanciaPromedio_202306",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "PROCESO": this.companyModel == 'Todos' ? null : this.companyModel,
              "FECHAFIN": this.fechaRangoModel![1].toISOString().slice(0, 10),
              "FECHAINI": this.fechaRangoModel![0].toISOString().slice(0, 10),
            }
          }
        }
        return {};
      }
      case 2: {
        this.filname = 'XT_RCS05_IntervaloServicio_202306';
        if (this.companyModel && this.fechaRangoModel) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RCS05_IntervaloServicio_202306",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "PROCESO": this.companyModel == 'Todos' ? null : this.companyModel,
              "FECHAFIN": this.fechaRangoModel![1].toISOString().slice(0, 10),
              "FECHAINI": this.fechaRangoModel![0].toISOString().slice(0, 10),
            }
          }
        }
        return {};
      }
      case 3: {
        this.filname = 'XT_RCS02_KilometrosProgramadosRecorridos_202306';
        if (this.companyModel && this.fechaRangoModel) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RCS02_KilometrosProgramadosRecorridos_202306",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "PROCESO": this.companyModel == 'Todos' ? null : this.companyModel,
              "FECHAFIN": this.fechaRangoModel![1].toISOString().slice(0, 10),
              "FECHAINI": this.fechaRangoModel![0].toISOString().slice(0, 10),
            }
          }
        }
        return {};
      }
      case 4: {
        this.filname = 'XT_RCS03_PorcentajeOcupacionRutaTipo_202306';
        if (this.companyModel && this.fechaRangoModel) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RCS03_PorcentajeOcupacionRutaTipo_202306",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "PROCESO": this.companyModel == 'Todos' ? null : this.companyModel,
              "FECHAFIN": this.fechaRangoModel![1].toISOString().slice(0, 10),
              "FECHAINI": this.fechaRangoModel![0].toISOString().slice(0, 10),
            }
          }
        }
        return {};

      }
      case 5: {
        this.filname = 'XT_RCS01_VehiculosRutaHorario_202306';
        if (this.companyModel && this.fechaRangoModel) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RCS01_VehiculosRutaHorario_202306",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "PROCESO": this.companyModel == 'Todos' ? null : this.companyModel,
              "FECHA_INICIO": this.fechaRangoModel![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRangoModel![1].toISOString().slice(0, 10),
            }
          }
        }
        return {};
      }
      case 6: {
        this.filname = 'XT_RCS06_CumplimientoVariacionServicio_202306';
        if (this.companyModel && this.fechaRangoModel) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RCS06_CumplimientoVariacionServicio_202306",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TRACK",
            "params": {
              "USUARIO": this.username,
              "PROCESO": this.companyModel == 'Todos' ? null : this.companyModel,
              "FECHA_FIN": this.fechaRangoModel![1].toISOString().slice(0, 10),
              "FECHA_INI": this.fechaRangoModel![0].toISOString().slice(0, 10)
            }
          }
        }
        return false;
      }
      default: {
        alert("default")
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