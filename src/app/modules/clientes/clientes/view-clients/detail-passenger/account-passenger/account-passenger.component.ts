import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IexportDetailAccount, IhistoricalState, IPassengerAccount, IStatementAccount, IStatePassengerAccount } from 'src/app/modules/clientes/models/client';
import { Motivos } from 'src/app/modules/clientes/models/motivos';
import { IPassenger } from 'src/app/modules/clientes/models/passenger';
import { PassengerAdminApiService } from 'src/app/modules/clientes/service/passenger.admin.api.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment.prod';
import { filter } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexDataLabels,
  ApexGrid,
  ApexStroke,
  ApexTitleSubtitle,
  ApexPlotOptions,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};
interface IntervalData {
  tipo: string;
  monto: number;
}

@Component({
  selector: 'app-account-passenger',
  templateUrl: './account-passenger.component.html',
  styleUrls: ['./account-passenger.component.scss']
})
export class AccountPassengerComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  graficaMovimiento: IntervalData[] = [];


  @Input() client: any;

  passenger!: IPassenger;
  accountMovenent!: any;
  accountMovenentCopy!: any;

  exportDetailAccount: IexportDetailAccount = {};
  dataTableHistoricalState: IhistoricalState[] = [];
  dataTableStatementAccount: any[] = [];
  dataTableStatementCopy: IStatementAccount[] = [];
  dataTableCopy!: IStatementAccount[];
  passengerAccount!: IPassengerAccount;
  idStateAccount!: number;
  idStateAccountOld!: number;
  motivos!: Motivos[];
  stateAccountForm!: IStatePassengerAccount;

  mostrarGrafica: boolean = false;

  // NG-MODEL
  filterValue!: string;

  // Modal
  modalChangeState: boolean = false;
  // @ViewChild('modalExportData') modalExportData;

  // Master combo
  stateCombo!: any[];
  clientsProfiles!: any[];
  typeAccount!: any[];
  public toDate;
  public tipoCuenta;

  // Ordenar Ascendente y Descendente
  isAsc: boolean = false;
  propertyCopy: string = '';

  // permission
  changeState!: boolean;

  private PATH_MOTIVOS = 'listvalues';

  constructor(
    public utils: UtilsService,
    private api: PassengerAdminApiService,
  ) {
    this.initObject();
  }

  async ngOnInit() {
    await this.checkPermissions();
    if (this.client) {
      this.passenger = this.client;
      this.loadTypeAccount();
      this.loadStateAccount();
      this.loadClientProfile();
      this.loadHistoricalState();
      this.getMotivos();
      if (this.passenger.idStateAccount) {
        this.idStateAccountOld = this.passenger.idStateAccount;
      }
      if (this.passenger.idSavings) {
        await this.loadNumberAccountCoreBanking(this.passenger.idSavings);
        await this.loadStatementAccount(this.passenger.idSavings);
      }
      if (this.passenger.idClientExternal) {
        this.passengerAccount.accountNo = this.passengerAccount.accountNo ? `${this.passengerAccount.accountNo} - ${this.passenger.idClientExternal}` :
          `${this.passenger.idClientExternal}`;
      }
    }
  }

  async initObject() {
    this.passenger = { phone: '' };
    this.passengerAccount = { accountNo: '', summary: { accountBalance: 0 } };
    this.stateAccountForm = {};
  }

  async checkPermissions() {
    this.changeState = await this.utils.existTypeAction(UtilsService.CHANGE_STATE_ACCOUNT);
  }

  async loadTypeAccount() {
    const response = await this.api.getList(this.utils.getBasicEndPoint(`passengers/typeAccount/${this.client.id}`));
    if (response && response.status === this.utils.successMessage) {
      this.typeAccount = response.data.accountsData;
      this.toDate = moment(this.typeAccount[0]?.creationDate).format('MM/DD/YYYY');
      this.tipoCuenta = this.typeAccount[0]?.name;
    }
  }

  async loadStateAccount() {
    const response = await this.api.getList(this.utils.getBasicEndPoint(`passengers/stateAccount`));
    if (response && response.status === this.utils.successMessage) {
      this.stateCombo = response.data.accountsData;
    }
  }

  async loadClientProfile() {
    const response = await this.api.getList(this.utils.getBasicEndPoint('clientprofile/clientProfileAll'));
    if (response && response.status === this.utils.successMessage) {
      this.clientsProfiles = response.data.service;
    }
  }

  async loadHistoricalState() {
    if (this.passenger.id) {
      const response = await this.api.getList(this.utils.getBasicEndPoint(`passengers/historical/${this.passenger.id}`));
      if (response && response.status === this.utils.successMessage) {
        this.dataTableHistoricalState = response.data.accountsData;
        this.dataTableHistoricalState = this.dataTableHistoricalState.sort((a: IhistoricalState, b: IhistoricalState) => (a.dateCreation.valueOf() > b.dateCreation.valueOf() ? -1 : 1))
      } else {
        this.utils.openErrorAlert(response.message);
      }
    }
  }

  async loadNumberAccountCoreBanking(idSavings: number) {
    const response = await this.api.getList(`${environment.apiCoreBanking}account/id/${idSavings}`);
    if (response && response.status === 'Success') {
      this.passengerAccount = response.data;
      this.passengerAccount.accountNo = `#${this.passengerAccount.accountNo}`;
      this.exportDetailAccount.numberAccount = this.passengerAccount.accountNo;
    }
  }

  async loadStatementAccount(idSavings: number) {
    const response = await this.api.getList(`${environment.apiCoreBanking}account/transactions/${idSavings}`);
    if (response && response.status === 'Success') {
      this.dataTableStatementAccount = response.data;
      if (this.dataTableStatementAccount) {
        this.dataTableStatementCopy = this.dataTableStatementAccount.map(data => {
          return {
            id: data.transactionType?.id,
            date: `${data.date[2]}/${data.date[1]}/${data.date[0]}`,
            lugar: '-',
            transferdescription: data.transfer?.transferDescription ? data.transfer?.transferDescription : '',
            trasferid: data.transfer?.id ? data.transfer?.id : '',
            amount: data.amount,
            transactionType: data.transactionType
          };
        });
        console.log(this.dataTableStatementAccount)
        console.log(this.dataTableStatementCopy)
      }
    }
  }

  async getMotivos() {
    const response = await this.api.getList(this.utils.getBasicEndPoint(`${this.PATH_MOTIVOS}/values/109/${this.utils.getSelectedEntity()}`));
    if (response.status === this.utils.successMessage) {
      if (response.data.valores) {
        this.motivos = response.data.valores;
      }
    }
  }

  async openModalChangeStateAccount(idState: number) {
    this.idStateAccount = idState;
    this.modalChangeState = true;
  }

  async changeStateAccount() {
    if (!this.stateAccountForm.motiveId || !this.stateAccountForm.description) {
      this.utils.openErrorAlert('Debe ingresar todos los campos.');
      return;
    }
    if (this.idStateAccount == 2 && (this.passengerAccount.accountNo || this.passengerAccount.summary.accountBalance > 0)) {
      await this.utils.openInfoAlert('Las tarjetas y saldo asociadas al cliente no se podrán usar hasta activarlas nuevamente.');
    }
    if (this.idStateAccount == 3 && (this.passengerAccount.accountNo || this.passengerAccount.summary.accountBalance > 0)) {
      await this.utils.openInfoAlert('Las tarjetas y saldo asociadas al cliente no se podrán usar hasta que termine el periodo de revisión de la cuenta.');
    }
    if (this.passenger.id) {
      const response = await this.api.updateStateClient(
        this.utils.getBasicEndPoint(`passengers/stateAccount/${this.passenger.id}/${this.stateAccountForm.motiveId}`),
        this.idStateAccount, this.stateAccountForm.description
      );
      if (response && response.status === this.utils.successMessage) {
        await this.utils.openSuccessAlert('Estado de cuenta actualizado correctamente.').then(async () => {
          this.idStateAccountOld = this.idStateAccount;
          this.loadHistoricalState();
          this.modalChangeState = false
          this.stateAccountForm = {};
        });
      } else {
        this.utils.openErrorAlert(response.message);
      }
    }
  }

  async closeModalChange() {
    this.stateAccountForm = {};
    this.passenger.idStateAccount = this.idStateAccountOld;
    this.modalChangeState = false;
  }

  async exportData(data: IexportDetailAccount) {
    data.numberAccount = data.numberAccount!.replace('#', '');
    if (!data.formatFile) {
      await this.utils.openErrorAlert('Debe seleccionar un formato.');
      return;
    }
    if (!data.dateInit || !data.datEnd) {
      await this.utils.openErrorAlert('Debe seleccionar ambas fechas.');
      return;
    }
    if (data.dateInit > data.datEnd) {
      await this.utils.openErrorAlert('La fecha inicio no puede ser mayor a la fecha fin.');
      return;
    }
  }

  orderColumn(property: string) {
    if (this.propertyCopy !== '' && this.propertyCopy !== property) {
      this.isAsc = false;
    }
    if (!this.isAsc) {
      this.isAsc = true;
      this.dataTableStatementCopy.sort((a, b) => a[`${property}`].toString().toLowerCase() < b[`${property}`].toString().toLowerCase() ? -1 :
        a[`${property}`].toString().toLowerCase() > b[`${property}`].toString().toLowerCase() ? 1 : 0);
    } else {
      this.isAsc = false;
      this.dataTableStatementCopy.sort((a, b) => a[`${property}`].toString().toLowerCase() < b[`${property}`].toString().toLowerCase() ? 1 :
        a[`${property}`].toString().toLowerCase() > b[`${property}`].toString().toLowerCase() ? -1 : 0);
    }
    this.propertyCopy = property;
  }

  search() {
    if (!this.dataTableCopy) {
      this.dataTableCopy = this.dataTableStatementCopy;
    }
    let data;
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.dataTableCopy.filter(
        (current) => {
          return this.utils.validateObject(current.id) && current.id!
            .toString()
            .toUpperCase()
            .includes(this.filterValue.includes('deposito') ? '1' :
              this.filterValue.includes('retirada') ? '2' :
                this.filterValue.includes('retener cantidad') ? '3' : this.filterValue.toUpperCase()) ||
            this.utils.validateObject(current.date) && current.date!
              .toString()
              .toUpperCase()
              .includes(this.filterValue.toUpperCase()) ||
            this.utils.validateObject(current.lugar) && current.lugar!
              .toString()
              .toUpperCase()
              .includes(this.filterValue.toUpperCase()) ||
            this.utils.validateObject(current.transferdescription) && current.transferdescription!
              .toString()
              .toUpperCase()
              .includes(this.filterValue.toUpperCase()) ||
            this.utils.validateObject(current.trasferid) && current.trasferid!
              .toString()
              .toUpperCase()
              .includes(this.filterValue.toUpperCase()) ||
            this.utils.validateObject(current.amount) && current.amount!
              .toString()
              .toUpperCase()
              .includes(this.filterValue.toUpperCase());
        }
      );
      if (data) {
        this.dataTableStatementCopy = data;
      }
    } else {
      if (this.dataTableCopy) {
        this.dataTableStatementCopy = this.dataTableCopy;
        // this.dataTableCopy = undefined;
      }
    }
  }

  cargarDashboards(tipos, valor) {
    this.chartOptions = {
      series: [
        {
          name: "Movimientos de la cuenta",
          data: []
        }
      ],
      chart: {
        height: 350,
        width: "88%",
        type: "bar",
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          }
        }
      },
      colors: [
        "#005536"
      ],
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: true
      },
      legend: {
        show: true
      },
      grid: {
        show: true
      },
      xaxis: {
        categories: [
        ],
        labels: {
          style: {
            colors: [
              "#000",
            ],
            fontSize: "12px"
          }
        }
      },
      title: {
        text: "Movimientos de la cuenta",
        align: "center",
        style: {
          color: "#444"
        }
      }
    };
    this.chartOptions.xaxis!.categories = tipos.map(element => element);
    this.chartOptions.series![0].data = valor.map(element => element);

  }

  public generateDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    var series: any[] = [];
    while (i < count) {
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([baseval, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  movimientosCuentas() {
    this.mostrarGrafica = true;
    this.api.movimientoCuenta((this.exportDetailAccount.numberAccount!).slice(1))
      .subscribe(
        {
          next: (value: any) => {
            this.accountMovenent = value.data.cuenta;
            console.log(this.accountMovenent)
            let tipos: any[] = [];
            this.accountMovenent.forEach(element => {
              tipos.push(element.tipo)
            });
            tipos = Array.from(new Set(tipos));
            let cargarDashboards = {}
            tipos.forEach((element) => {
              cargarDashboards[element] = 0;
            })
            let valor: any = [];
            this.accountMovenent.forEach(elements => {
              tipos.forEach((element) => {
                if (element == elements.tipo) {
                  cargarDashboards[element] = (cargarDashboards[element] + elements.monto);
                }
              })
            });
            tipos.forEach((element) => {
              valor.push(cargarDashboards[element]);
            })
            this.cargarDashboards(tipos, valor);
          },
          error: (err: any) => {

          }
        }
      )
  }
}