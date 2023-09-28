import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyService } from 'src/app/modules/admin/admin/company/service/company.service';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';
import { Company } from 'src/app/modules/transporte/models/company';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { IReporte } from 'src/app/shared/models/reportes.interface';
import { ReportesService } from '../../service/reportes.service';

@Component({
  selector: 'app-reportes-operacion-red-comercializacion',
  templateUrl: './reportes-operacion-red-comercializacion.component.html',
  styleUrls: ['./reportes-operacion-red-comercializacion.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class ReportesOperacionRedComercializacionComponent implements OnInit {

  procesos: any[] = [];
  conductor: any[] = [];
  reportes: IReporte[];
  reporteInvalido: boolean = false;
  disponible = true;
  movimiento: number | string = 0;
  movimientoList: any[] = []
  filname: string = '';
  enviarFormulario: boolean = false;

  // CONFIGURACION NGMODEL
  companiaModel: number | null | string = 0;
  serviciosModel: number = 0;
  descargar: boolean = false;

  // CONFIGURACION USERNAME
  id: number = 0;
  username: string = '';

  // CARGAR FORMULARIO 1
  entidades: any[] = [];
  companies: Company[] = [];
  company: string = '';
  fechaRango!: Date | undefined;

  // CARGAR FORMULARIO 2
  entidad: any;

  // CARGAR FORMULARIO 2
  servcios: any[] = [];
  urlFile;

  pathCompanies = 'companies';

  constructor(
    private util: UtilsService,
    private api: DescuentosService,
    private _reportesService: ReportesService,
    private company_api: CompanyService,
    private sanitizer: DomSanitizer
  ) {
    this.reportes = [
      {
        id: 2,
        name: 'Registro de recargas y ventas',
        path: '',
        estado: false,
        orden: 3
      },
      {
        id: 1,
        name: 'Promedio de recarga',
        path: '',
        estado: true,
        orden: 1
      },
      {
        id: 4,
        name: 'Horarios de apertura y cierre',
        path: '',
        estado: false,
        orden: 4
      },
      {
        id: 3,
        name: 'Transacciones por periodo',
        path: '',
        estado: false,
        orden: 2
      },
      {
        id: 5,
        name: 'Tarjeta vendidas',
        path: '',
        estado: false,
        orden: 5
      }
    ]
    this.reportes = this.reportes.sort((a: any, b: any) => a.orden - b.orden)
  }

  async ngOnInit() {
    await this.loadCompanies();
    await this.getSelectedEntity();
    await this.cargarEntidad()
    await this.servicios()
    await this.listarMovimientos()
    await this.validar();
  }

  listarMovimientos() {
    this._reportesService.getListarMovimientos()
      .subscribe(
        {
          next: async (value: any) => {
            await value.data.data.forEach(element => {
              if ((element.id != 1)) {
                if ((element.id != 3)) {
                  this.movimientoList.push(element)
                }
              }

            });
            this.movimientoList.push(
              {
                "id": 0,
                "nombre": "Recarga",
                "descripcion": "",
                "fecha_registro": "2021-09-21 10:12:08.176427"
              }
            )
            this.movimiento = this.movimientoList[0];
          },
          error: (err: any) => {

          }
        }
      );
  }

  async servicios() {
    const jsonUser = JSON.parse(localStorage.getItem('auth')!);
    console.log(jsonUser.user)
    this.servcios = jsonUser.user.services.filter(element => element.id == 5);
    this.serviciosModel = this.servcios.length > 0 ? this.servcios[0].id : 0;
    if (this.servcios.length == 0) {
      this.disponible = false;
      this.util.openInfoAlert("Este reporte no está disponible, no cuentas con empresas de recaudo a ningún servicio")
      return;
    }
    this.username = (jsonUser.user.firstName ? jsonUser.user.firstName : '') + " " + (jsonUser.user.lastName ? jsonUser.user.lastName : '');
  }

  async cargarEntidad() {
    const resp = await this.company_api.getCompanies(this.util.getBasicEndPoint(`${this.pathCompanies}/sucursales?type-id=2`));
    if (resp.status === this.util.successMessage) {
      let data = resp.data.companies;
      console.log(data)
      let companies: Array<any> = [];
      for (let i = 0; i < data.length; i++) {
        let d = data[i];
        companies.push({ ...d, ...d.client });
      }
      this.entidades = companies;
    }
  }

  getSelectedEntity(): void {
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));
    if (entity) {
      this.id = entity.userId;
    }
  }

  recibirEmiter(event: number) {
    // REINICIAMOS VARIABLES
    this.companiaModel = 0;
    this.serviciosModel = 0;
    this.company = '';
    this.disponible = true;
    // FECHAS
    this.fechaRango = undefined;
    this.urlFile = '';
    this.enviarFormulario = false;
    this.descargar = false;
    this.reporteInvalido = false;

    for (let index = 0; index < this.reportes.length; index++) {
      if (event != index) {
        this.reportes[index].estado = false;
      } else {
        this.reportes[event].estado = true
        if (index == 0 || index == 4) {
          this.servicios();
        }
      }
    }
    this.getSelectedEntity();
    console.log(this.disponible)
  }

  validar() {
    if (this.entidades.length == 0) {
      this.util.openInfoAlert("Este reporte no está disponible, no cuentas con empresas de recaudo");
      this.disponible = false;
    }
  }


  async loadCompanies() {
    const companies = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (companies) {
      this.companies = companies.companies.filter(
        (company: Company) => company.active && company.typeId == 1
      );
    }
    this.entidad = companies.entities[0].id;
    // this.servcios = companies.services;
  }

  evaluarFormulario(): {} {
    const report = this.reportes.find((element: IReporte) => element.estado == true)
    switch (report?.id) {
      case 1: {
        this.filname = 'XT_RC02_ValorPromedioRecarga_202303';
        if (this.companiaModel && this.serviciosModel && this.fechaRango) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RC02_ValorPromedioRecarga_202303",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TICKETING",
            "params": {
              // "ID_USUARIO": this.id,
              "USUARIO": this.username,
              "ID_ENTIDAD": this.entidad,
              "ID_EMPRESA": this.companiaModel == 'Todos' ? null : this.companiaModel,
              "ID_SERVICIO": this.serviciosModel,
              "FECHA_INI": this.fechaRango ? this.fechaRango[0].toISOString().slice(0, 10) : '',
              "FECHA_FIN": this.fechaRango ? this.fechaRango[1].toISOString().slice(0, 10) : ''
            }
          }
        }
        return {}
      }
      case 2: {
        this.filname = 'XT_RC04_RegistroRecargasVentas_202303';
        if (this.fechaRango) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RC04_RegistroRecargasVentas_202303",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TICKETING",
            "params": {
              "USUARIO": this.username,
              "ID_ENTIDAD": this.entidad,
              "FECHA_INI": this.fechaRango ? this.fechaRango[0].toISOString().slice(0, 10) : '',
              "FECHA_FIN": this.fechaRango ? this.fechaRango[1].toISOString().slice(0, 10) : ''
            }
          }
        }
        return {};
      }
      case 3: {
        this.filname = 'XT_RC03_TransaccionesPeriodo_202303';
        if ((this.movimiento || this.movimiento == null || this.movimiento == 0) && this.fechaRango) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RC03_TransaccionesPeriodo_202303",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TICKETING",
            "params": {
              "ID_USUARIO": this.id,
              "USUARIO": this.username,
              "TIPO_TRANSACCION": this.movimiento == 'Todos' ? null : this.movimiento,
              "FECHA_INI": this.fechaRango ? this.fechaRango[0].toISOString().slice(0, 10) : '',
              "FECHA_FIN": this.fechaRango ? this.fechaRango[1].toISOString().slice(0, 10) : ''
            }
          }
        }
        return {}
      }
      case 4: {
        this.filname = 'XT_RC01_HorariosAperturaCierre_202302';
        this.reporteInvalido = true;
        return {
          "fileName": "XT_RC01_HorariosAperturaCierre_202302",
          "type": "PDF",
          "typeDataSource": "CONN",
          "connect": "TICKETING",
          "params": {
            "ID_USUARIO": this.id,
            "USUARIO": this.username,
            "ID_ENTIDAD": this.entidad,
            // "ID_SERVICIO": this.serviciosModel,
          }
        }
      }
      case 5: {
        this.filname = 'XT_RC05_TarjetasVendidas_202303';
        if ((this.companiaModel) && this.fechaRango) {
          this.reporteInvalido = true;
          return {
            "fileName": "XT_RC05_TarjetasVendidas_202303",
            "type": "PDF",
            "typeDataSource": "CONN",
            "connect": "TICKETING",
            "params": {
              "ID_USUARIO": this.id,
              "USUARIO": this.username,
              "ID_ENTIDAD": this.entidad,
              "ID_EMPRESA": this.companiaModel == 'Todos' ? null : this.companiaModel,
              "FECHA_INI": this.fechaRango ? this.fechaRango[0].toISOString().slice(0, 10) : '',
              "FECHA_FIN": this.fechaRango ? this.fechaRango[1].toISOString().slice(0, 10) : ''
            }
          }
        }
        return {}
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
