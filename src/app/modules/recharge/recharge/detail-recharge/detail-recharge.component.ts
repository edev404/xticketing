import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DetailsSelected, PassageDataSend, PresettlementFilter, RechargeDataSend } from 'src/app/modules/clearing/models/models';
import { ClearingServiceService } from 'src/app/modules/clearing/services/clearing-service.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Component({
  selector: 'app-detail-recharge',
  templateUrl: './detail-recharge.component.html',
  styleUrls: ['./detail-recharge.component.scss']
})
export class DetailRechargeComponent implements OnInit {
  @Output() switchPanel = new EventEmitter<any>();
  @Output() switchPanelFinding = new EventEmitter<any>();

  @Input() clearingId!: number;
  @Input() detailsSearch: any;
  @Input() isSettlement!: boolean;
  @Input() pressettlementFilter!: PresettlementFilter;

  detailSelected!: DetailsSelected;
  detailsBranchOffices!: DetailsSelected[];
  detailsBranchOfficesShower!: DetailsSelected[];

  companyName!: string;

  totalRecaudo: number = 0;
  totalAPagar: number = 0;

  periodSelected = 1;

  groupBtn = [{ id: 1, name: 'Semanal' }, { id: 2, name: 'Diario' }];
  dataTimeOfSearch = { month: '', fromDate: '', toDate: '', year: '' };

  PATH_CLEARING = 'clearing';
  PATH_RECHARGE = 'recharges';

  constructor(
    public util: UtilsService,
    public api: ClearingServiceService,
  ) { }

  async ngOnInit() {
    if (!this.detailsSearch) await this.findById();
    this.setDataTimeOfSearch();
    this.companyName = this.detailsSearch.detail.companyName.toUpperCase();
    console.log(this.detailsSearch)
    this.detailsSearch.branchOffices.forEach(element => {
      this.totalRecaudo += element.totalcollect;
      this.totalAPagar += element.valueToPay
    });
  }

  cancelDetail() {
    this.switchPanel.emit(false);
  }

  switchFinding() {
    this.switchPanel.emit(false);
    this.switchPanelFinding.emit({ value: true, id: this.clearingId });
  }

  setDataTimeOfSearch() {
    this.dataTimeOfSearch.month = this.util.getMonthByDate(this.util.getDateByFormat(this.pressettlementFilter.fromDate, '-'));
    this.dataTimeOfSearch.fromDate = this.util.getDaysByDate(this.util.getDateByFormat(this.pressettlementFilter.fromDate, '-'));
    this.dataTimeOfSearch.toDate = this.util.getDaysByDate(this.util.getDateByFormat(this.pressettlementFilter.toDate, '-'));
    this.dataTimeOfSearch.year = this.pressettlementFilter.fromDate.split('-')[0];
  }

  setDetailsRechargeByBranchOffices() {
    if (this.detailsBranchOffices) {
      if (this.periodSelected === 1) {
        const auxList: DetailsSelected[] = [];
        const distinctWeek = this.detailsBranchOffices.map(value => value.weekNumber)
          .filter((value, index, self) => self.indexOf(value) === index);
        distinctWeek.forEach(value => {
          const auxBranchOffices: DetailsSelected = {};
          const rowsByWeek = this.detailsBranchOffices.filter(value1 => value1.weekNumber === value);
          auxBranchOffices.valueToPay = rowsByWeek.map(value1 => value1.valueToPay)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));
          auxBranchOffices.collectedValue = rowsByWeek.map(value1 => value1.collectedValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));
          auxBranchOffices.totalcollect = rowsByWeek.map(value1 => value1.totalcollect)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));
            auxBranchOffices.collectCard = rowsByWeek.map(value1 => value1.collectCard)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));
          auxBranchOffices.date = `${rowsByWeek[0].date} - ${rowsByWeek[rowsByWeek.length - 1].date}`;
          auxList.push(auxBranchOffices);
        });
        console.log("---------------")
        console.log(auxList)
        this.detailsBranchOfficesShower = auxList;
      } else {
        this.detailsBranchOfficesShower = this.detailsBranchOffices;
      }
    }
  }

  getDataSend(code: string) {
    delete this.detailsSearch.token;
    const dataSend: RechargeDataSend = {};
    dataSend.state = this.api.getBaseListState().filter(value => value.code === code)[0];
    dataSend.companyId = this.pressettlementFilter.company.id;
    this.detailsSearch.filter = this.pressettlementFilter;
    dataSend.recharge = this.detailsSearch;
    dataSend.startDate = this.pressettlementFilter.fromDate;
    dataSend.endDate = this.pressettlementFilter.toDate;
    dataSend.configId = this.pressettlementFilter.percentageSetting
    return dataSend;
  }

  async findById() {
    const response = await this.api.findById(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.clearingId}`));
    if (response.status === this.util.successMessage) {
      this.detailsSearch = response.data.clearing.json.recharge;
      console.log(this.detailsSearch)
      if (this.detailsSearch) {
        this.detailsSearch.state = response.data.clearing.state;
        this.detailsSearch.company = response.data.clearing.company;
        this.detailsSearch.validityStartDate = response.data.clearing.validityStartDate;
        this.detailsSearch.validityEndDate = response.data.clearing.validityEndDate;
        this.pressettlementFilter = response.data.clearing.json.recharge.filter;
      }

    } else if (response.showAlert) {
      await this.util.getErrorModalOptions(response.message);
    }
  }

  async searchRowDetails() {
    const response = await this.api.findRechargeDetailsByBranchOffices(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_RECHARGE}/details/branch-offices/${this.detailSelected.id}?startDate=${this.pressettlementFilter.fromDate}&endDate=${this.pressettlementFilter.toDate}&configId=${this.pressettlementFilter.percentageSetting}`));
    if (response.status === this.util.successMessage) {
      this.detailsBranchOffices = response.data.details;
      this.setDetailsRechargeByBranchOffices();
    } else if (response.showAlert) {
      await this.util.openErrorAlert(response.message);
    }
  }

  async changeState(code) {
    const response = await this.api.changeState(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.clearingId}`), { stateCode: code });
    if (response.status === this.util.successMessage) {
      await this.util.openSuccessAlert('Estado cambiado correctamente.');
      this.switchPanel.emit(false);
    } else if (response.showAlert) {
      await this.util.openErrorAlert(response.message);
    }
  }

  async submit(code: string, codeRedirect: string) {
    const response = await this.api.save(this.util.getClearingEndPoint(this.PATH_CLEARING + '/'), JSON.stringify(this.getDataSend(code)));
    if (response.status === this.util.successMessage) {
      await this.util.openSuccessAlert('Se registro el clearing correctamente');
      this.switchPanel.emit(false);
    } else if (response.showAlert) {
      await this.util.openErrorAlert(response.message);
    }
  }

}
