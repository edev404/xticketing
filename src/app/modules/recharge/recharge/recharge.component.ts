import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { Router } from '@angular/router';
import { RechargeServiceService } from '../services/recharge-service.service';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.scss']
})
export class RechargeComponent implements OnInit {

  main: boolean = false;
  isCreate: boolean = false;
  isFinding: boolean = false;
  isDetail: boolean = false;
  isSettlement!: boolean;

  idRecharge!: number;

  listOfData: any[] = [];

  datePlaceholder: any = ['Desde', 'Hasta']
  listOfDataFilter!: any[];
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  page: number = 1;
  numberRow: number = 5;

  dateRange: any;
  stateFilter: any = undefined;

  filterValue: string = '';
  titelFilter: string = 'Todas';
  titelBreadCrumb: string = 'Ver recargas';

  CLEARING_PATH = 'clearing';

  constructor(
    public util: UtilsService,
    public api: RechargeServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let url = this.router.url.split('/');
    switch (url[url.length - 1]) {
      case 'recharge':
        this.isSettlement = true;
        break;
      case 'recharge-settlement':
        this.isSettlement = false;
        break;
    }
  }

  changeFilter(data) {
    switch (data) {
      case 'tod': // todas
        this.stateFilter = 'T';
        this.titelFilter = 'Todas';
        break;
      case 'bor': // borrador
        this.stateFilter = 'B';
        this.titelFilter = 'Borrador';
        break;
      case 'prv': // por revicion
        this.stateFilter = 'P';
        this.titelFilter = 'Por revisión';
        break;
      case 'rec': // rechazadas
        this.stateFilter = 'R';
        this.titelFilter = 'Rechazadas';
        break;
      case 'anu': // anuladas
        this.stateFilter = 'AN';
        this.titelFilter = 'Anuladas';
        break;
    }
  }

  switchFinding(event) {
    this.isFinding = event.value
    this.main = event.value;
    this.idRecharge = event.id
    this.titelBreadCrumb = event.value ? 'Revisar - Registrar hallazgos' : 'Ver recargas';
  }

  search(): void {
    let data!: any[];
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.listOfData;
    }
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.listOfDataFilter.filter((current) => {

        return this.util.validateObject(current.date) && current.date!.toString().toUpperCase().includes(this.filterValue!.toUpperCase()) ||
          this.util.validateObject(current.city.name) && current.city.name!.toString().toUpperCase().includes(this.filterValue!.toUpperCase()) ||
          this.util.validateObject(current.company.name) && current.company.name!.toString().toUpperCase().includes(this.filterValue!.toUpperCase())
        // this.util.validateObject(current.validityStartDate)  && current.validityEndDate!     .toString().toUpperCase().includes(this.filterValue!.toUpperCase()) ||
        // this.util.validateObject(current.validityEndDate)    && current.validityEndDate!     .toString().toUpperCase().includes(this.filterValue!.toUpperCase())
      }
      );
      if (data) {
        this.listOfData = data;
      }
    } else {
      if (this.listOfDataFilter) {
        this.listOfData = this.listOfDataFilter;
        this.filterValue = ''
      }
    }
  }

  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

  async switchPanel(value, type, id) {
    switch (type) {
      case 'create':
        this.isCreate = value;
        this.main = value;
        this.titelBreadCrumb = value ? 'Crear pre-Liquidaciónes' : 'Ver recargas';
        this.listOfData = [];
        this.dateRange = [];
        break;
      case 'finding':
        this.isFinding = value
        this.main = value;
        this.idRecharge = id
        this.titelBreadCrumb = value ? 'Revisar - Registrar hallazgos' : 'Ver recargas';
        this.listOfData = [];
        this.dateRange = [];
        break;
      case 'detail':
        this.isDetail = value
        this.main = value;
        this.idRecharge = id
        this.titelBreadCrumb = value ? 'Liquidación de recargas' : 'Ver recargas';
        this.listOfData = [];
        this.dateRange = [];
        break;
    }
  }

  async loadData(date) {
    const fromDate = this.util.getDateByFormat(this.util.formatDate(date[0]), '-');
    const toDate = this.util.getDateByFormat(this.util.formatDate(date[1]), '-');
    let resp
    if (!date[0] || !date[1]) {
      this.util.openInfoAlert('Por favor seleccione una fecha valida')
      return;
    }

    // if (!this.util.meetDateLimit(fromDate, toDate, 30)) {
    //   await this.util.openInfoAlert('No puede excederse 30 días');
    //   return;
    // }

    if (this.isSettlement) {
      resp = await this.api.findAll(this.util.getClearingEndPoint(`${this.CLEARING_PATH}/recharges?completed=false${this.stateFilter ? `&stateCode=${this.stateFilter}` : ''}&startDate=${this.util.formatDate(date[0])}&endDate=${this.util.formatDate(date[1])}`));
    } else {
      resp = await this.api.findAll(this.util.getClearingEndPoint(`${this.CLEARING_PATH}/recharges?completed=true${this.stateFilter ? `&stateCode=${this.stateFilter}` : ''}&startDate=${this.util.formatDate(date[0])}&endDate=${this.util.formatDate(date[1])}`));
    }
    if (resp.status === this.util.successMessage) {
      this.listOfData = resp.data.clearings;
      this.listOfData = this.listOfData.sort((a: any, b: any) => (a.date!.valueOf() > b.date!.valueOf() ? 1 : -1))
    } else if (resp.showAlert) {
      await this.util.openErrorAlert(resp.message);
    }
  }
}
