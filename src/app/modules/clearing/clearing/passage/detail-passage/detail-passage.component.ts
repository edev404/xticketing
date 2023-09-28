import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClearingDataPassages, PassageDataSend, PresettlementFilter } from 'src/app/modules/clearing/models/models';
import { ClearingServiceService } from 'src/app/modules/clearing/services/clearing-service.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Component({
  selector: 'app-detail-passage',
  templateUrl: './detail-passage.component.html',
  styleUrls: ['./detail-passage.component.scss']
})
export class DetailPassageComponent implements OnInit {
  @Output() switchPanel = new EventEmitter<any>();
  @Output() switchPanelFinding = new EventEmitter<any>();
  @Input() clearingId!: number;
  @Input() isSettlement!: boolean;
  @Input() detailsSearch: any;

  @Input() pressettlementFilter!: PresettlementFilter;

  dataTimeOfSearch = {month: '', fromDate: '', toDate: '', year: ''};

  companyName!: string;

  PATH_CLEARING = 'clearing';
  PATH_RECHARGE = 'recharges';

  constructor(
    public util: UtilsService,
    public api: ClearingServiceService,
  ) { }

  async ngOnInit() {
    await this.findById();
    this.setDataTimeOfSearch();
    this.companyName = this.pressettlementFilter.company.name.toUpperCase()
  }

  cancelDetail() {
    this.switchPanel.emit(false);
  }

  setDataTimeOfSearch() {
    this.dataTimeOfSearch.month = this.util.getMonthByDate(this.util.getDateByFormat(this.pressettlementFilter.fromDate, '-'));
    this.dataTimeOfSearch.fromDate = this.util.getDaysByDate(this.util.getDateByFormat(this.pressettlementFilter.fromDate, '-'));
    this.dataTimeOfSearch.toDate = this.util.getDaysByDate(this.util.getDateByFormat(this.pressettlementFilter.toDate, '-'));
    this.dataTimeOfSearch.year = this.pressettlementFilter.fromDate.split('-')[0];
  }

  switchFinding() {
    this.switchPanel.emit(false);
    this.switchPanelFinding.emit({value: true, id: this.clearingId});
  }

  getTicketData(detailsSearch) {
    return {
      distributions: this.detailsSearch.distributions,
      collects: detailsSearch.collect.collects,
      routeCollects: detailsSearch.routesCollect,
      details: detailsSearch.detail.details,
      routeDetails: detailsSearch.routesDetail,
      filter: this.pressettlementFilter
    };
  }

  getDataSend(code: string) {
    delete this.detailsSearch.token;
    const dataSend: PassageDataSend = {};
    dataSend.state = this.api.getBaseListState().filter(value => value.code === code)[0];
    dataSend.companyId = this.pressettlementFilter.company.id;
    dataSend.ticket = this.getTicketData(this.detailsSearch);
    dataSend.startDate = this.pressettlementFilter.fromDate;
    dataSend.endDate = this.pressettlementFilter.toDate;
    dataSend.configId = this.pressettlementFilter.percentageSetting
    console.log(dataSend);
    
    return dataSend;
  }

  getClearingDataPassages(response) {
    const dataClearingPassages: ClearingDataPassages = {};
    dataClearingPassages.distributions = response.data.clearing.json.ticket.distributions;
    dataClearingPassages.collect = {collects: response.data.clearing.json.ticket.collects};
    dataClearingPassages.detail = {details: response.data.clearing.json.ticket.details};
    dataClearingPassages.company = response.data.clearing.company;
    dataClearingPassages.validityStartDate = response.data.clearing.validityStartDate;
    dataClearingPassages.validityEndDate = response.data.clearing.validityEndDate;
    return dataClearingPassages;
  }

  async changeState(code) {
    const response = await this.api.changeState(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.clearingId}`), {stateCode: code});
    if (response.status === this.util.successMessage) {
      await this.util.openSuccessAlert('Estado cambiado correctamente.');
      this.switchPanel.emit(false);
    } else if (response.showAlert){
      await this.util.openErrorAlert(response.message);
    }
  }

  async findById() {
    const response = await this.api.findById(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.clearingId}`));
    if (response.status === this.util.successMessage) {
      this.detailsSearch = this.getClearingDataPassages(response);
      if (this.detailsSearch){
        this.detailsSearch.state = response.data.clearing.state;        
        this.pressettlementFilter = response.data.clearing.json.ticket.filter;
      }
    } else if (response.showAlert){
      await this.util.getErrorModalOptions(response.message);
    }
  }

  async submit(code: string, codeRedirect: string) {
    const response = await this.api.save(this.util.getClearingEndPoint(this.PATH_CLEARING+'/'), JSON.stringify(this.getDataSend(code)));
    if (response.status === this.util.successMessage) {
      this.switchPanel.emit(false);
    } else if (response.showAlert) {
      await this.util.openErrorAlert(response.message);
    }
  }

}
