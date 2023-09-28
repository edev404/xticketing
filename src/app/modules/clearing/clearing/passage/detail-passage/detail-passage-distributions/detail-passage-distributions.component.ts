import { Component, Input, OnInit } from '@angular/core';
import { DetailsSelected, InvolvedDistribution, PresettlementFilter } from 'src/app/modules/clearing/models/models';
import { ClearingServiceService } from 'src/app/modules/clearing/services/clearing-service.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Component({
  selector: 'app-detail-passage-distributions',
  templateUrl: './detail-passage-distributions.component.html',
  styleUrls: ['./detail-passage-distributions.component.scss']
})
export class DetailPassageDistributionsComponent implements OnInit {
  @Input() detailsSearch!: InvolvedDistribution[];
  @Input() pressettlementFilter!: PresettlementFilter;
  @Input() dataTimeOfSearch!: any;

  detailSelected!: InvolvedDistribution;
  detailsInvolveds!: DetailsSelected[];
  detailsInvolvedsShower!: DetailsSelected[];
  groupBtn = [{id: 1, name: 'Semanal'}, {id: 2, name: 'Diario'}];

  periodSelected = 1;
  totalToDistribution: number | undefined = 0;

  PATH_CLEARING = 'clearing';
  PATH_TICKETS = 'tickets';

  constructor(
    public util: UtilsService,
    public api: ClearingServiceService,
  ) { }

  ngOnInit(): void { 
    this.setTotalToDistribution();   
  }

  setTotalToDistribution() {
    if (this.detailsSearch && this.detailsSearch.length > 0) {
      this.totalToDistribution = this.detailsSearch.map(value => value.valueToPay)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));
    }
  }

  setDetailsRangesDatesByInvolveds() {
    if (this.detailsInvolveds) {
      if (this.periodSelected === 1) {
        const auxList: DetailsSelected[] = [];
        const distinctWeek = this.detailsInvolveds.map(value => value.weekNumber)
          .filter((value, index, self) => self.indexOf(value) === index);
        distinctWeek.forEach(value => {
          const auxBranchOffices: DetailsSelected = {};
          const rowsByWeek = this.detailsInvolveds.filter(value1 => value1.weekNumber === value);
          auxBranchOffices.valueToPay = rowsByWeek.map(value1 => value1.valueToPay)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));
          auxBranchOffices.date = `${rowsByWeek[0].date} - ${rowsByWeek[rowsByWeek.length - 1].date}`;
          auxList.push(auxBranchOffices);
        });
        this.detailsInvolvedsShower = auxList;
      } else {
        this.detailsInvolvedsShower = this.detailsInvolveds;
      }
    }

  }

  async searchRowDetails() {
    const response = await this.api.findRechargeDetailsByBranchOffices(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/distribution/involveds/${this.detailSelected.involvedId}?startDate=${this.pressettlementFilter.fromDate}&endDate=${this.pressettlementFilter.toDate}&configId=${this.pressettlementFilter.percentageSetting}`));
    if (response.status === this.util.successMessage) {
      this.detailsInvolveds = response.data.distributions;
      this.setDetailsRangesDatesByInvolveds();
    } else if (response.showAlert){
      await this.util.openErrorAlert(response.message);
    }
  }
}
