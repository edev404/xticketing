import { Component, Input, OnInit } from '@angular/core';
import { DetailsClearingPassages, PresettlementFilter, RoutesDetailsClearingPassages, TravelDetailsClearingPassages, VehicleDetailsClearingPassages } from 'src/app/modules/clearing/models/models';
import { ClearingServiceService } from 'src/app/modules/clearing/services/clearing-service.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Component({
  selector: 'app-detail-passage-general',
  templateUrl: './detail-passage-general.component.html',
  styleUrls: ['./detail-passage-general.component.scss']
})
export class DetailPassageGeneralComponent implements OnInit {
  @Input() clearingDetailsData!: any;
  @Input() pressettlementFilter!: PresettlementFilter;
  @Input() dataTimeOfSearch!: any;
  
  dataGeneralDetail: DetailsClearingPassages = {};

  dataDateShower: any[] = [];
  groupBtn = [{id: 1, name: 'Semanal'}, {id: 2, name: 'Diario'}];
  
  periodSelected = 1;

  resizeLeft!: boolean;
  resizeRight!: boolean;


  PATH_TICKETS = 'tickets';
  PATH_CLEARING = 'clearing';

  constructor(
    public util: UtilsService,
    public api: ClearingServiceService,
  ) { }

  async ngOnInit() {
    await this.checkPeriodSelected();
    await this.setDataGeneralCollect();
  }

  setDataDateByRoutes() {
    if (this.clearingDetailsData.routesDetail) {
      if (this.periodSelected === 1) {
        const auxList: RoutesDetailsClearingPassages[] = [];
        const distinctWeek = this.clearingDetailsData.routesDetail.map(value => value.weekNumber)
          .filter((value, index, self) => self.indexOf(value) === index);
        distinctWeek.forEach(valueWeek => {
          const rowsByWeek = this.clearingDetailsData.routesDetail.filter(value1 => value1.weekNumber === valueWeek);

          const distinctRoutes = rowsByWeek.map(value => value.routeId)
            .filter((value, index, self) => self.indexOf(value) === index);

          distinctRoutes.forEach((value, index, array) => {
            const auxRoutesDetailsClearingPassages: RoutesDetailsClearingPassages = {};
            const rowsByRoutes = rowsByWeek.filter(value1 => value1.routeId === value);
            // suma de los valores de tarjetas

            auxRoutesDetailsClearingPassages.collectValue = rowsByRoutes.map(value1 => value1.collectValue)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            // suma de los valores de total de qr

            auxRoutesDetailsClearingPassages.transferValue = rowsByRoutes.map(value1 => value1.transferValue)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            // suma de los valores de total de efectivo

            auxRoutesDetailsClearingPassages.discountPayedValue = rowsByRoutes.map(value1 => value1.discountPayedValue)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            // suma de los valores de descuentos

            auxRoutesDetailsClearingPassages.discountValue = rowsByRoutes.map(value1 => value1.discountValue)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            // suma de los valores de total recaudado

            auxRoutesDetailsClearingPassages.totalCollected = rowsByRoutes.map(value1 => value1.totalCollected)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            // suma de los valores de total a repartir

            auxRoutesDetailsClearingPassages.distributionTotal = rowsByRoutes.map(value1 => value1.distributionTotal)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));


            auxRoutesDetailsClearingPassages.date = `${rowsByWeek[0].date} - ${rowsByWeek[rowsByWeek.length - 1].date}`;

            auxRoutesDetailsClearingPassages.weekNumber = valueWeek;
            auxRoutesDetailsClearingPassages.routeName = rowsByRoutes[0].routeName;
            auxRoutesDetailsClearingPassages.routeId = rowsByRoutes[0].routeId;

            auxRoutesDetailsClearingPassages.collectCant = rowsByRoutes.map(value1 => value1.collectCant)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            auxRoutesDetailsClearingPassages.transferCant = rowsByRoutes.map(value1 => value1.transferCant)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            auxRoutesDetailsClearingPassages.discountPayedCant = rowsByRoutes.map(value1 => value1.discountPayedCant)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            auxRoutesDetailsClearingPassages.totalCant =
              (auxRoutesDetailsClearingPassages.collectCant! + auxRoutesDetailsClearingPassages.transferCant! +
                auxRoutesDetailsClearingPassages.discountPayedCant!);

            auxList.push(auxRoutesDetailsClearingPassages);
          });

        });
        this.clearingDetailsData.routesShower = auxList;
      } else {
        this.clearingDetailsData.routesShower = this.clearingDetailsData.routesDetail;
      }
    }
  }

  setDataTravelByRoutes() {
    if (this.clearingDetailsData.travelsDetail) {
      if (this.periodSelected === 1) {

        const auxList: TravelDetailsClearingPassages[] = [];
        const distinctWeek = this.clearingDetailsData.travelsDetail.map(value => value.weekNumber)
          .filter((value, index, self) => self.indexOf(value) === index);
        distinctWeek.forEach(valueWeek => {
          const auxDetailsClearingPassages: TravelDetailsClearingPassages = {};
          const rowsByWeek = this.clearingDetailsData.travelsDetail.filter(value1 => value1.weekNumber === valueWeek);

          // suma de los valores de recaudo

          auxDetailsClearingPassages.collectValue = rowsByWeek.map(value1 => value1.collectValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de transbordos

          auxDetailsClearingPassages.transferValue = rowsByWeek.map(value1 => value1.transferValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de total descuentos

          auxDetailsClearingPassages.discountPayedValue = rowsByWeek.map(value1 => value1.discountPayedValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de recuperacion de descuentos

          auxDetailsClearingPassages.discountValue = rowsByWeek.map(value1 => value1.discountValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de total recaudado

          auxDetailsClearingPassages.totalCollected = rowsByWeek.map(value1 => value1.totalCollected)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de total a repartir

          auxDetailsClearingPassages.distributionTotal = rowsByWeek.map(value1 => value1.distributionTotal)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));


          auxDetailsClearingPassages.date = `${rowsByWeek[0].date}`;

          auxDetailsClearingPassages.weekNumber = valueWeek;

          auxDetailsClearingPassages.collectCant = rowsByWeek.map(value1 => value1.collectCant)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          auxDetailsClearingPassages.transferCant = rowsByWeek.map(value1 => value1.transferCant)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          auxDetailsClearingPassages.discountPayedCant = rowsByWeek.map(value1 => value1.discountPayedCant)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          auxDetailsClearingPassages.totalCant =
            (auxDetailsClearingPassages.collectCant! + auxDetailsClearingPassages.transferCant!
              + auxDetailsClearingPassages.discountPayedCant!);

          auxDetailsClearingPassages.travelId = rowsByWeek[0].travelId;
          auxList.push(auxDetailsClearingPassages);
        });
        this.clearingDetailsData.travelsShower = auxList;

      } else {
        this.clearingDetailsData.travelsShower = this.clearingDetailsData.travelsDetail;
      }
    }
  }

  setDataVehicleByRoutes() {
    this.clearingDetailsData.vehiclesDetail = this.util.filterNull(this.clearingDetailsData.vehiclesDetail);
    if (this.clearingDetailsData.vehiclesDetail && this.clearingDetailsData.vehiclesDetail.length > 0) {
      if (this.periodSelected === 1) {
        const auxList: VehicleDetailsClearingPassages[] = [];
        const distinctWeek = this.clearingDetailsData.vehiclesDetail.map(value => value.weekNumber)
          .filter((value, index, self) => self.indexOf(value) === index);
        distinctWeek.forEach(valueWeek => {
          const rowsByWeek = this.clearingDetailsData.vehiclesDetail.filter(value1 => value1.weekNumber === valueWeek);

          const distinctVehicle = rowsByWeek.map(value => value.vehicleId)
            .filter((value, index, self) => self.indexOf(value) === index);
          distinctVehicle.forEach((value) => {
            const auxVehiclesClearingPassages: VehicleDetailsClearingPassages = {};
            const rowsByVehicle = rowsByWeek.filter(value1 => value1.vehicleId === value);

            // suma de los valores de recaudo

            auxVehiclesClearingPassages.collectValue = rowsByVehicle.map(value1 => value1.collectValue)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            // suma de los valores de transbordo

            auxVehiclesClearingPassages.transferValue = rowsByVehicle.map(value1 => value1.transferValue)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            // suma de los valores de descuento por pagar

            auxVehiclesClearingPassages.discountPayedValue = rowsByVehicle.map(value1 => value1.discountPayedValue)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            // suma de los valores de descuentos

            auxVehiclesClearingPassages.discountValue = rowsByVehicle.map(value1 => value1.discountValue)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            // suma de los valores de total recaudado

            auxVehiclesClearingPassages.totalCollected = rowsByVehicle.map(value1 => value1.totalCollected)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            // suma de los valores de total a repartir

            auxVehiclesClearingPassages.distributionTotal = rowsByVehicle.map(value1 => value1.distributionTotal)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));


            auxVehiclesClearingPassages.date = `${rowsByWeek[0].date} - ${rowsByWeek[rowsByWeek.length - 1].date}`;

            auxVehiclesClearingPassages.weekNumber = valueWeek;
            auxVehiclesClearingPassages.plate = rowsByVehicle[0].plate;
            auxVehiclesClearingPassages.vehicleId = rowsByVehicle[0].vehicleId;
            auxVehiclesClearingPassages.internalNumber = rowsByVehicle[0].internalNumber;

            auxVehiclesClearingPassages.collectCant = rowsByVehicle.map(value1 => value1.collectCant)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            auxVehiclesClearingPassages.transferCant = rowsByVehicle.map(value1 => value1.transferCant)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            auxVehiclesClearingPassages.discountPayedCant = rowsByVehicle.map(value1 => value1.discountPayedCant)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            auxVehiclesClearingPassages.totalCant =
              (auxVehiclesClearingPassages.collectCant!! + auxVehiclesClearingPassages.transferCant!! +
                auxVehiclesClearingPassages.discountPayedCant!!);

            auxList.push(auxVehiclesClearingPassages);
          });

        });
        this.clearingDetailsData.vehiclesShower = auxList;
      } else {
        this.clearingDetailsData.vehiclesShower = this.clearingDetailsData.vehiclesDetail;
      }
    }


  }

  async setDataGeneralCollect() {
    this.dataGeneralDetail = {};
    if (this.clearingDetailsData.details) {
      this.dataGeneralDetail.collectValue = this.clearingDetailsData.details.map(value1 => value1.collectValue)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralDetail.transferValue = this.clearingDetailsData.details.map(value1 => value1.transferValue)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralDetail.discountPayedValue = this.clearingDetailsData.details.map(value1 => value1.discountPayedValue)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralDetail.discountValue = this.clearingDetailsData.details.map(value1 => value1.discountValue)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralDetail.totalCollected = this.clearingDetailsData.details.map(value1 => value1.totalCollected)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralDetail.distributionTotal = this.clearingDetailsData.details.map(value1 => value1.distributionTotal)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));


      this.dataGeneralDetail.date = `${this.pressettlementFilter.fromDate} - ${this.pressettlementFilter.toDate}`;

      this.dataGeneralDetail.collectCant = this.clearingDetailsData.details.map(value1 => value1.collectCant)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralDetail.transferCant = this.clearingDetailsData.details.map(value1 => value1.transferCant)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralDetail.discountPayedCant = this.clearingDetailsData.details.map(value1 => value1.discountPayedCant)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralDetail.totalCant =
        (this.dataGeneralDetail.collectCant! + this.dataGeneralDetail.transferCant! + this.dataGeneralDetail.discountPayedCant!);
    }

  }

  async checkPeriodSelected() {
    if (this.clearingDetailsData.details) {
      this.dataDateShower = [];
      if (this.periodSelected === 1) {

        const auxList: DetailsClearingPassages[] = [];
        const distinctWeek = this.clearingDetailsData.details.map(value => value.weekNumber)
          .filter((value, index, self) => self.indexOf(value) === index);
        distinctWeek.forEach(valueWeek => {
          const auxDetailsClearingPassages: DetailsClearingPassages = {};
          const rowsByWeek = this.clearingDetailsData.details.filter(value1 => value1.weekNumber === valueWeek);

          // suma de los valores de recaudo

          auxDetailsClearingPassages.collectValue = rowsByWeek.map(value1 => value1.collectValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de transbordos

          auxDetailsClearingPassages.transferValue = rowsByWeek.map(value1 => value1.transferValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de total descuentos

          auxDetailsClearingPassages.discountPayedValue = rowsByWeek.map(value1 => value1.discountPayedValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de recuperacion de descuentos

          auxDetailsClearingPassages.discountValue = rowsByWeek.map(value1 => value1.discountValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de total recaudado

          auxDetailsClearingPassages.totalCollected = rowsByWeek.map(value1 => value1.totalCollected)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de total a repartir

          auxDetailsClearingPassages.distributionTotal = rowsByWeek.map(value1 => value1.distributionTotal)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));


          auxDetailsClearingPassages.date = `${rowsByWeek[0].date} - ${rowsByWeek[rowsByWeek.length - 1].date}`;

          auxDetailsClearingPassages.weekNumber = valueWeek;

          auxDetailsClearingPassages.collectCant = rowsByWeek.map(value1 => value1.collectCant)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          auxDetailsClearingPassages.transferCant = rowsByWeek.map(value1 => value1.transferCant)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          auxDetailsClearingPassages.discountPayedCant = rowsByWeek.map(value1 => value1.discountPayedCant)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          auxDetailsClearingPassages.totalCant =
            (auxDetailsClearingPassages.collectCant! + auxDetailsClearingPassages.transferCant!
              + auxDetailsClearingPassages.discountPayedCant!);

          auxList.push(auxDetailsClearingPassages);
          this.dataDateShower.push({date: auxDetailsClearingPassages.date, weekNumber: valueWeek});
        });
        this.clearingDetailsData.detailsShower = auxList;

      } else {
        this.clearingDetailsData.detailsShower = this.clearingDetailsData.details;
        this.clearingDetailsData.detailsShower.forEach(value => this.dataDateShower.push({
          date: value.date,
          weekNumber: value.weekNumber
        }));
      }
    }
  }

  async searchRouteDetails() {
    let response;
    if (this.periodSelected === 1) {
      const dateSplit = this.clearingDetailsData.detailsSelected.date.split(' - ');
      response = await this.api.findRouteDetailsTickets(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/details/routes?startDate=${dateSplit[0].trim()}&endDate=${dateSplit[1].trim()}&companyId=${this.pressettlementFilter.company.id}`));
    } else {
      response = await this.api.findRouteDetailsTickets(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/details/routes?startDate=${this.clearingDetailsData.detailsSelected.date}&endDate=${this.clearingDetailsData.detailsSelected.date}&companyId=${this.pressettlementFilter.company.id}`));
    }
    if (response.status === this.util.successMessage) {
      this.clearingDetailsData.routesDetail = response.data.routeDetails;
      this.setDataDateByRoutes();
    } else if (response.showAlert) {
      await this.util.openErrorAlert(response.message);
    }
  }

  async searchTravelVehicleDetails() {
    try {
      await this.searchTravelDetails();
      await this.searchVehicleDetails();
    } catch (e) {
      await this.util.openErrorAlert(this.util.errorGeneralMessage);
    }
  }

  async searchTravelDetails() {
    let response;
    if (this.periodSelected === 1) {
      const dateSplit = this.clearingDetailsData.detailsSelected.date.split(' - ');
      response = await this.api.findTravelDetails(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/details/routes/${this.clearingDetailsData.routesDetailSelected.routeId}/travels?startDate=${dateSplit[0].trim()}&endDate=${dateSplit[1].trim()}`));
    } else {
      response = await this.api.findTravelDetails(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/details/routes/${this.clearingDetailsData.routesDetailSelected.routeId}/travels?startDate=${this.clearingDetailsData.routesDetailSelected.date}&endDate=${this.clearingDetailsData.routesDetailSelected.date}`));
    }

    if (response.status === this.util.successMessage) {
      this.clearingDetailsData.travelsDetail = response.data.travels;
      this.setDataTravelByRoutes();
    } else if (response.message){
      await this.util.openErrorAlert(response.message);
    }
  }

  async searchVehicleDetails() {
    let response;
    if (this.periodSelected === 1) {
      const dateSplit = this.clearingDetailsData.detailsSelected.date.split(' - ');
      response = await this.api.findVehicleDetails(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/details/routes/${this.clearingDetailsData.routesDetailSelected.routeId}/vehicles?startDate=${dateSplit[0].trim()}&endDate=${dateSplit[1].trim()}`));
    } else {
      response = await this.api.findVehicleDetails(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/details/routes/${this.clearingDetailsData.routesDetailSelected.routeId}/vehicles?startDate=${this.clearingDetailsData.routesDetailSelected.date}&endDate=${this.clearingDetailsData.routesDetailSelected.date}`));
    }
    if (response.status === this.util.successMessage) {
      this.clearingDetailsData.vehiclesDetail = response.data.vehicles;
      this.setDataVehicleByRoutes();
    } else if (response.showAlert){
      await this.util.openErrorAlert(response.message);
    }
  }

  async searchPassengerDetails(isTravel: boolean) {
    if (isTravel) {
      await this.searchPassengerDetailsByTravel();
    } else {
      await this.searchPassengerDetailsByVehicle();
    }
  }

  async searchPassengerDetailsByTravel() {
    const response = await this.api.searchPassengerDetailsByTravel(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/details/routes/${this.clearingDetailsData.routesDetailSelected.routeId}/travels/${this.clearingDetailsData.travelDetailSelected.travelId}/passengers`));
    if (response.status === this.util.successMessage) {
      this.clearingDetailsData.passenger = response.data.passengers;
    } else if (response.showAlert){
      await this.util.openErrorAlert(response.message);
    }
  }

  async searchPassengerDetailsByVehicle() {
    let response;
    if (this.periodSelected === 1) {
      const dateSplit = this.clearingDetailsData.detailsSelected.date.split(' - ');
      response = await this.api.searchPassengerDetailsByVehicle(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/details/routes/${this.clearingDetailsData.routesDetailSelected.routeId}/vehicles/${this.clearingDetailsData.vehicleDetailSelected.vehicleId}/passengers?startDate=${dateSplit[0].trim()}&endDate=${dateSplit[1].trim()}`));
    } else {
      response = await this.api.searchPassengerDetailsByVehicle(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/details/routes/${this.clearingDetailsData.routesDetailSelected.routeId}/vehicles/${this.clearingDetailsData.vehicleDetailSelected.vehicleId}/passengers?startDate=${this.clearingDetailsData.routesDetailSelected.date}&endDate=${this.clearingDetailsData.routesDetailSelected.date}`));
    }

    if (response.status === this.util.successMessage) {
      this.clearingDetailsData.passenger = response.data.passengers;
    } else if (response.showAlert){
      await this.util.openErrorAlert(response.message);
    }
  }

}
