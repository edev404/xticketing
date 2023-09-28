import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyService } from 'src/app/modules/admin/admin/company/service/company.service';
import { ClearingServiceService } from 'src/app/modules/clearing/services/clearing-service.service';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';
import { Tarifas } from 'src/app/modules/tarifas/models/tarifas';
import { ServiceRateService } from 'src/app/modules/tarifas/service/service-rate.service';
import { Company } from 'src/app/modules/transporte/models/company';
import { ViewCollectionService } from 'src/app/modules/transporte/transporte/view-collection/view-collection.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { IReporte } from 'src/app/shared/models/reportes.interface';

@Component({
  selector: 'app-reportes-clearing',
  templateUrl: './reportes-clearing.component.html',
  styleUrls: ['./reportes-clearing.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class ReportesClearingComponent implements OnInit {

  reportes: IReporte[];
  reporteInvalido: boolean = false;

  filname: string = '';

  // ESTADOS FORMULARIOS
  estadoFormulario1: boolean = true;
  enviarFormulario: boolean = false;
  descargar: boolean = false;
  disponible: boolean = true;

  // CONFIGURACION NGMODEL
  companiaModel: number | null | string = 0;

  // CARGAR FORMULARIO 1
  companies: Company[] = [];
  entidades: any[] = [];
  fechaRango!: Date | null;
  data: any;
  company: string = '';
  entidad: any;
  PATH = 'collects';
  STATE_CODE = 'RT';

  pathCompanies = 'companies';
  PATHS = 'fareServices';

  // CONFIGURACION USERNAME
  id: number = 0;
  username: string = '';

  PATH_TICKETS = 'tickets';

  CITIES_PATH = 'masters/cities';



  ciudad: any[] = [];


  // PARA CARGAR PDF
  urlFile;
  urlFileCopy;
  constructor(
    private api: DescuentosService,
    private util: UtilsService,
    private company_api: CompanyService,
    public _api: ClearingServiceService,
    private sanitizer: DomSanitizer
  ) {
    this.reportes = [
      {
        id: 1,
        name: 'Cantidad de pasajeros validados',
        path: '',
        estado: false,
        orden: 5
      },
      {
        id: 2,
        name: 'Valor de créditos vigentes',
        path: '',
        estado: true,
        orden: 1
      },
      {
        id: 3,
        name: 'Valor de validaciones',
        path: '',
        estado: false,
        orden: 3
      },
      {
        id: 4,
        name: 'Valor de recargas',
        path: '',
        estado: false,
        orden: 4
      },
      {
        id: 5,
        name: 'Valor de compensaciones',
        path: '',
        estado: false,
        orden: 2
      },
      {
        id: 6,
        name: 'Reporte general de clearing',
        path: '',
        estado: false,
        orden: 6
      }
    ]
    this.reportes = this.reportes.sort((a: any, b: any) => a.orden - b.orden)
  }

  ngOnInit(): void {
    // this.renderFileInTemplate()
    this.loadCompanies();
    this.cargarEntidad();
    this.getSelectedEntity()
    this.getUsername();
    // this.getCiudad();
  }

  // async getCiudad() {
  //   const response = await this._api.getCities(this.util.getBasicEndPoint(`${this.CITIES_PATH}`));
  //   if (response.status === this.util.successMessage) {
  //     this.ciudad = response.data.cities;
  //   } else if (response.showAlert){
  //     await this.util.openErrorAlert(response.message);
  //   }
  // }

  async getUsername() {
    const jsonUser = JSON.parse(localStorage.getItem('auth')!);
    this.username = (jsonUser.user.firstName ? jsonUser.user.firstName : '') + " " + (jsonUser.user.lastName ? jsonUser.user.lastName : '');
  }

  getSelectedEntity(): void {
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));
    if (entity) {
      this.id = entity.userId;
    }
  }

  async loadCompanies() {
    const companies = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (companies) {
      console.log(companies.companies)
      this.companies = companies.companies.filter(
        (company: Company) => company.active && company.typeId == 1
      );
    }
    this.entidad = companies;
  }

  async cargarEntidad() {
    const resp = await this.company_api.getCompanies(this.util.getBasicEndPoint(`${this.pathCompanies}/sucursales?type-id=2`));
    if (resp.status === this.util.successMessage) {
      let data = resp.data.companies;
      let companies: Array<any> = [];
      for (let i = 0; i < data.length; i++) {
        let d = data[i];
        companies.push({ ...d, ...d.client });
      }
      this.entidades = companies;
    }
  }


  recibirEmiter(event: number) {
    // REINICIAMOS VARIABLES
    this.company = '';
    this.companiaModel = null;
    this.fechaRango = null;
    this.urlFile = '';
    this.descargar = false;
    this.disponible = true;
    this.enviarFormulario = false;
    this.reporteInvalido = false;
    this.disponible = true;

    for (let index = 0; index < this.reportes.length; index++) {
      if (event != index) {
        this.reportes[index].estado = false;
      } else {
        this.reportes[event].estado = true
        switch (index) {
          case 1:
          case 2:
          case 4: {
            if (this.companies.length == 0) {
              this.util.openInfoAlert("Este reporte no está disponible, no cuentas con empresas de transportes").then(() => {
                this.disponible = false;
              });
            }
          }
            break;
          case 3: {
            if (this.entidades.length == 0) {
              this.util.openInfoAlert("Este reporte no está disponible, no cuentas con empresas de transportes").then(() => {
                this.disponible = false;
              });
            }
          }
            break;
        }
      }
    }
    this.getSelectedEntity();
  }

  evaluarFormulario(): {} {
    const report = this.reportes.find((element: IReporte) => element.estado == true)
    switch (report?.id) {
      case 1: {
        this.filname = 'XT_RCL01_PasajerosFormaPagoRuta_202306';
        if (this.companiaModel && this.fechaRango) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RCL01_PasajerosFormaPagoRuta_202306",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TICKETING",
            "params": {
              "ID_EMPRESA": this.companiaModel == 'Todos' ? null : this.companiaModel,
              "USUARIO": this.username,
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10)
            }
          }
        }
        return {};
      }
      case 2: {
        this.filname = 'XT_RCL04_ValorCredito_202306';
        if (this.fechaRango) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RCL04_ValorCredito_202306",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TICKETING",
            "params": {
              "USUARIO": this.username,
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10)
            }
          }
        }
        return {};
      }
      case 3: {
        this.filname = 'XT_RCL03_ValorValidacionesUsuarioTarifa_202306';
        if (this.companiaModel && this.fechaRango) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RCL03_ValorValidacionesUsuarioTarifa_202306",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TICKETING",
            "params": {
              "ID_EMPRESA": this.companiaModel == 'Todos' ? null : this.companiaModel,
              "USUARIO": this.username,
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10)
            }
          }
        }
        return {};

      }
      case 4: {
        this.filname = 'XT_RCL02_ValorRecargaCanalRed_202306';
        if (this.companiaModel && this.fechaRango) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RCL02_ValorRecargaCanalRed_202306",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TICKETING",
            "params": {
              "ID_EMPRESA": this.companiaModel == 'Todos' ? null : this.companiaModel,
              "USUARIO": this.username,
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10)
            }
          }
        }
        return {};
      }
      case 5: {
        this.filname = 'XT_RCL05_CompensacionesPeriodo_202306';
        if (this.companiaModel && this.fechaRango) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RCL05_CompensacionesPeriodo_202306",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TICKETING",
            "params": {
              "ID_EMPRESA": this.companiaModel == 'Todos' ? null : this.companiaModel,
              "USUARIO": this.username,
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10)
            }
          }
        }
        return {};
      }
      case 6: {
        this.filname = 'XT_ReporteGenearlClearing_202308';
        if (this.fechaRango) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_ReporteGenearlClearing_202308",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TICKETING",
            "params": {
              "ID_CLEARING": null,
              "USUARIO": this.username,
              "FECHA_INI": this.fechaRango![0].toISOString().slice(0, 10),
              "FECHA_FIN": this.fechaRango![1].toISOString().slice(0, 10)
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
      this.util.openInfoAlert("Reporte no disponible")
      return;
    }
    if (this.reporteInvalido) {
      this.api.downloadImageDiscountReports(this.evaluarFormulario())
        .subscribe(
          {
            next: (value: Blob) => {
              if (value.size <= 1000) {
                this.urlFile = '';
                this.util.openInfoAlert("No existen datos")
                return;
              }
              const urlCreator = window.URL || window.webkitURL;
              this.urlFile = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(value));
              this.urlFile = this.urlFile.changingThisBreaksApplicationSecurity;
              this.descargar = true;
            },
            error: (err: any) => {
              console.log(err)
              this.util.openErrorAlert("Falla en el servidor, comuniquese con la línea de soporte.")
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
            this.urlFileCopy = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(value));
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
