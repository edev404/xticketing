import { Component, Input, OnInit } from '@angular/core';
import { ClearingCollectsData, CollectsClearingPassages, PresettlementFilter, RoutesCollectsClearingPassages, TravelCollectsClearingPassages, VehicleCollectsClearingPassages } from 'src/app/modules/clearing/models/models';
import { ClearingServiceService } from 'src/app/modules/clearing/services/clearing-service.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Component({
  selector: 'app-detail-passage-collection',
  templateUrl: './detail-passage-collection.component.html',
  styleUrls: ['./detail-passage-collection.component.scss']
})
export class DetailPassageCollectionComponent implements OnInit {
  @Input() clearingCollectsData!: any;
  @Input() pressettlementFilter!: PresettlementFilter;
  @Input() dataTimeOfSearch!: any;

  dataGeneralCollect: CollectsClearingPassages = {};

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
    if (this.clearingCollectsData.routesCollect) {
      if (this.periodSelected === 1) {
        const auxList: RoutesCollectsClearingPassages[] = [];
        const distinctWeek = this.clearingCollectsData.routesCollect.map(value => value.weekNumber)
          .filter((value, index, self) => self.indexOf(value) === index);
        distinctWeek.forEach(valueWeek => {
          const rowsByWeek = this.clearingCollectsData.routesCollect.filter(value1 => value1.weekNumber === valueWeek);

          const distinctRoutes = rowsByWeek.map(value => value.routeId)
            .filter((value, index, self) => self.indexOf(value) === index);
          distinctRoutes.forEach((value, index, array) => {
            const auxRoutesDetailsClearingPassages: RoutesCollectsClearingPassages = {};
            const rowsByRoutes = rowsByWeek.filter(value1 => value1.routeId === value);
            // suma de los valores de tarjetas

            auxRoutesDetailsClearingPassages.cardValue = rowsByRoutes.map(value1 => value1.cardValue)
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

            // suma de los valores de total de qr

            auxRoutesDetailsClearingPassages.qrValue = rowsByRoutes.map(value1 => value1.qrValue)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            // suma de los valores de total de efectivo

            auxRoutesDetailsClearingPassages.cashValue = rowsByRoutes.map(value1 => value1.cashValue)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            auxRoutesDetailsClearingPassages.date = `${rowsByWeek[0].date} - ${rowsByWeek[rowsByWeek.length - 1].date}`;

            auxRoutesDetailsClearingPassages.weekNumber = valueWeek;
            auxRoutesDetailsClearingPassages.routeName = rowsByRoutes[0].routeName;
            auxRoutesDetailsClearingPassages.routeId = rowsByRoutes[0].routeId;

            auxRoutesDetailsClearingPassages.qrCant = rowsByRoutes.map(value1 => value1.qrCant)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            auxRoutesDetailsClearingPassages.cashCant = rowsByRoutes.map(value1 => value1.cashCant)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            auxRoutesDetailsClearingPassages.cardCant = rowsByRoutes.map(value1 => value1.cardCant)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            auxRoutesDetailsClearingPassages.totalCant =
              (auxRoutesDetailsClearingPassages.qrCant! + auxRoutesDetailsClearingPassages.cashCant! +
                auxRoutesDetailsClearingPassages.cardCant!);

            auxList.push(auxRoutesDetailsClearingPassages);
          });

        });
        this.clearingCollectsData.routesShower = auxList;
      } else {
        this.clearingCollectsData.routesShower = this.clearingCollectsData.routesCollect;
      }
    }

  }

  setDataTravelByRoutes() {
    if (this.clearingCollectsData.travelsCollect) {
      if (this.periodSelected === 1) {

        const auxList: TravelCollectsClearingPassages[] = [];
        const distinctWeek = this.clearingCollectsData.travelsCollect.map(value => value.weekNumber)
          .filter((value, index, self) => self.indexOf(value) === index);
        distinctWeek.forEach(valueWeek => {
          const auxTravelClearingPassages: TravelCollectsClearingPassages = {};
          const rowsByWeek = this.clearingCollectsData.travelsCollect.filter(value1 => value1.weekNumber === valueWeek);

          // suma de los valores de tarjetas

          auxTravelClearingPassages.cardValue = rowsByWeek.map(value1 => value1.cardValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de descuentos

          auxTravelClearingPassages.discountValue = rowsByWeek.map(value1 => value1.discountValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de total recaudado

          auxTravelClearingPassages.totalCollected = rowsByWeek.map(value1 => value1.totalCollected)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de total a repartir

          auxTravelClearingPassages.distributionTotal = rowsByWeek.map(value1 => value1.distributionTotal)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de total de qr

          auxTravelClearingPassages.qrValue = rowsByWeek.map(value1 => value1.qrValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de total de efectivo

          auxTravelClearingPassages.cashValue = rowsByWeek.map(value1 => value1.cashValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          auxTravelClearingPassages.date = `${rowsByWeek[0].date}`;

          auxTravelClearingPassages.weekNumber = valueWeek;

          auxTravelClearingPassages.qrCant = rowsByWeek.map(value1 => value1.qrCant)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          auxTravelClearingPassages.cashCant = rowsByWeek.map(value1 => value1.cashCant)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          auxTravelClearingPassages.cardCant = rowsByWeek.map(value1 => value1.cardCant)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          auxTravelClearingPassages.totalCant =
            (auxTravelClearingPassages.qrCant! + auxTravelClearingPassages.cashCant! + auxTravelClearingPassages.cardCant!);

          auxTravelClearingPassages.travelId = rowsByWeek[0].travelId;

          auxList.push(auxTravelClearingPassages);
        });
        this.clearingCollectsData.travelsShower = auxList;

      } else {
        this.clearingCollectsData.travelsShower = this.clearingCollectsData.travelsCollect;
      }
    }

  }

  setDataVehicleByRoutes() {
    this.clearingCollectsData.vehiclesCollect = this.util.filterNull(this.clearingCollectsData.vehiclesCollect);
    if (this.clearingCollectsData.vehiclesCollect && this.clearingCollectsData.vehiclesCollect.length > 0) {
      if (this.periodSelected === 1) {
        const auxList: VehicleCollectsClearingPassages[] = [];
        const distinctWeek = this.clearingCollectsData.vehiclesCollect.map(value => value.weekNumber)
          .filter((value, index, self) => self.indexOf(value) === index);
        distinctWeek.forEach(valueWeek => {
          const rowsByWeek = this.clearingCollectsData.vehiclesCollect.filter(value1 => value1.weekNumber === valueWeek);

          const distinctVehicle = rowsByWeek.map(value => value.vehicleId)
            .filter((value, index, self) => self.indexOf(value) === index);
          distinctVehicle.forEach((value) => {
            const auxVehiclesClearingPassages: VehicleCollectsClearingPassages = {};
            const rowsByVehicle = rowsByWeek.filter(value1 => value1.vehicleId === value);
            // suma de los valores de tarjetas

            auxVehiclesClearingPassages.cardValue = rowsByVehicle.map(value1 => value1.cardValue)
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

            // suma de los valores de total de qr

            auxVehiclesClearingPassages.qrValue = rowsByVehicle.map(value1 => value1.qrValue)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            // suma de los valores de total de efectivo

            auxVehiclesClearingPassages.cashValue = rowsByVehicle.map(value1 => value1.cashValue)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            auxVehiclesClearingPassages.date = `${rowsByWeek[0].date} - ${rowsByWeek[rowsByWeek.length - 1].date}`;

            auxVehiclesClearingPassages.weekNumber = valueWeek;
            auxVehiclesClearingPassages.plate = rowsByVehicle[0].plate;
            auxVehiclesClearingPassages.vehicleId = rowsByVehicle[0].vehicleId;
            auxVehiclesClearingPassages.internalNumber = rowsByVehicle[0].internalNumber;

            auxVehiclesClearingPassages.qrCant = rowsByVehicle.map(value1 => value1.qrCant)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            auxVehiclesClearingPassages.cashCant = rowsByVehicle.map(value1 => value1.cashCant)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            auxVehiclesClearingPassages.cardCant = rowsByVehicle.map(value1 => value1.cardCant)
              .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

            auxVehiclesClearingPassages.totalCant =
              (auxVehiclesClearingPassages.qrCant! + auxVehiclesClearingPassages.cashCant! +
                auxVehiclesClearingPassages.cardCant!);

            auxList.push(auxVehiclesClearingPassages);
          });

        });
        this.clearingCollectsData.vehiclesShower = auxList;
      } else {
        this.clearingCollectsData.vehiclesShower = this.clearingCollectsData.vehiclesCollect;
      }
    }


  }

  async checkPeriodSelected() {
    if (this.clearingCollectsData.collects) {
      this.dataDateShower = [];
      if (this.periodSelected === 1) {

        const auxList: CollectsClearingPassages[] = [];
        const distinctWeek = this.clearingCollectsData.collects.map(value => value.weekNumber)
          .filter((value, index, self) => self.indexOf(value) === index);
        distinctWeek.forEach(valueWeek => {
          const auxCollectsClearingPassages: CollectsClearingPassages = {};
          const rowsByWeek = this.clearingCollectsData.collects!.filter(value1 => value1.weekNumber === valueWeek);

          // suma de los valores de tarjetas

          auxCollectsClearingPassages.cardValue = rowsByWeek.map(value1 => value1.cardValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de descuentos

          auxCollectsClearingPassages.discountValue = rowsByWeek.map(value1 => value1.discountValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de total recaudado

          auxCollectsClearingPassages.totalCollected = rowsByWeek.map(value1 => value1.totalCollected)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de total a repartir

          auxCollectsClearingPassages.distributionTotal = rowsByWeek.map(value1 => value1.distributionTotal)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de total de qr

          auxCollectsClearingPassages.qrValue = rowsByWeek.map(value1 => value1.qrValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          // suma de los valores de total de efectivo

          auxCollectsClearingPassages.cashValue = rowsByWeek.map(value1 => value1.cashValue)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          auxCollectsClearingPassages.date = `${rowsByWeek[0].date} - ${rowsByWeek[rowsByWeek.length - 1].date}`;

          auxCollectsClearingPassages.weekNumber = valueWeek;

          auxCollectsClearingPassages.qrCant = rowsByWeek.map(value1 => value1.qrCant)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          auxCollectsClearingPassages.cashCant = rowsByWeek.map(value1 => value1.cashCant)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          auxCollectsClearingPassages.cardCant = rowsByWeek.map(value1 => value1.cardCant)
            .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

          auxCollectsClearingPassages.totalCant =
            (auxCollectsClearingPassages.qrCant! + auxCollectsClearingPassages.cashCant! + auxCollectsClearingPassages.cardCant!);

          auxList.push(auxCollectsClearingPassages);
          this.dataDateShower.push({date: auxCollectsClearingPassages.date, weekNumber: valueWeek});
        });
        this.clearingCollectsData.collectsShower = auxList;

      } else {
        this.clearingCollectsData.collectsShower = this.clearingCollectsData.collects;
        this.clearingCollectsData.collectsShower.forEach(value => this.dataDateShower.push({
          date: value.date,
          weekNumber: value.weekNumber
        }));
      }
    }
  }

  async setDataGeneralCollect() {
    this.dataGeneralCollect = {};
    if (this.clearingCollectsData.collects) {
      this.dataGeneralCollect.cardValue = this.clearingCollectsData.collects.map(value1 => value1.cardValue)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralCollect.cashValue = this.clearingCollectsData.collects.map(value1 => value1.cashValue)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralCollect.discountValue = this.clearingCollectsData.collects.map(value1 => value1.discountValue)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralCollect.totalCollected = this.clearingCollectsData.collects.map(value1 => value1.totalCollected)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralCollect.distributionTotal = this.clearingCollectsData.collects.map(value1 => value1.distributionTotal)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralCollect.qrValue = this.clearingCollectsData.collects.map(value1 => value1.qrValue)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralCollect.date = `${this.pressettlementFilter.fromDate} - ${this.pressettlementFilter.toDate}`;

      this.dataGeneralCollect.qrCant = this.clearingCollectsData.collects.map(value1 => value1.qrCant)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralCollect.cashCant = this.clearingCollectsData.collects.map(value1 => value1.cashCant)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralCollect.cardCant = this.clearingCollectsData.collects.map(value1 => value1.cardCant)
        .reduce((previousValue, currentValue) => this.util.reducer(previousValue, currentValue));

      this.dataGeneralCollect.totalCant =
        (this.dataGeneralCollect.qrCant! + this.dataGeneralCollect.cashCant! + this.dataGeneralCollect.cardCant!);
    }
  }

  async searchTravelVehicleDetails() {
    try {
      await this.searchTravelDetails();
      await this.searchVehicleDetails();
    } catch (e) {
      await this.util.openErrorAlert('¡No se encontraron rutas y vehículos relacionados!');
    }
  }

  async searchTravelDetails() {
    let response;
    if (this.periodSelected === 1) {
      const dateSplit = this.clearingCollectsData.collectSelected.date.split(' - ');
      response = await this.api.findTravelDetails(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/collects/routes/${this.clearingCollectsData.routesCollectSelected.routeId}/travels?startDate=${dateSplit[0].trim()}&endDate=${dateSplit[1].trim()}`));
    } else {
      response = await this.api.findTravelDetails(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/collects/routes/${this.clearingCollectsData.routesCollectSelected.routeId}/travels?startDate=${this.clearingCollectsData.routesCollectSelected.date}&endDate=${this.clearingCollectsData.routesCollectSelected.date}`));
    }
    if (response.status === this.util.successMessage) {
      this.clearingCollectsData.travelsCollect = response.data.travels;
      this.setDataTravelByRoutes();
    } else if (response.showAlert) {
      await this.util.openErrorAlert(response.message);
    }

  }

  async searchVehicleDetails() {
    let response;
    if (this.periodSelected === 1) {
      const dateSplit = this.clearingCollectsData.collectSelected.date.split(' - ');
      response = await this.api.findVehicleDetails(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/collects/routes/${this.clearingCollectsData.routesCollectSelected.routeId}/vehicles?startDate=${dateSplit[0].trim()}&endDate=${dateSplit[1].trim()}`));
    } else {
      response = await this.api.findVehicleDetails(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/collects/routes/${this.clearingCollectsData.routesCollectSelected.routeId}/vehicles?startDate=${this.clearingCollectsData.routesCollectSelected.date}&endDate=${this.clearingCollectsData.routesCollectSelected.date}`));
    }
    if (response.status === this.util.successMessage) {
      this.clearingCollectsData.vehiclesCollect = response.data.vehicles;
      this.setDataVehicleByRoutes();
    } else if (response.showAlert){
      await this.util.openErrorAlert(response.message);
    }
  }

  async searchRouteDetails() {
    let response;
    if (this.periodSelected === 1) {
      const dateSplit = this.clearingCollectsData.collectSelected.date.split(' - ');
      response = await this.api.findRouteDetailsTickets(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/collects/routes?startDate=${dateSplit[0].trim()}&endDate=${dateSplit[1].trim()}&companyId=${this.pressettlementFilter.company.id}`));
    } else {
      response = await this.api.findRouteDetailsTickets(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/collects/routes?startDate=${this.clearingCollectsData.collectSelected.date}&endDate=${this.clearingCollectsData.collectSelected.date}&companyId=${this.pressettlementFilter.company.id}`));
    }
    if (response.status === this.util.successMessage) {
      this.clearingCollectsData.routesCollect = response.data.routeCollects;
      this.setDataDateByRoutes();
    } else if (response.showAlert) {
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
    const response = await this.api.searchPassengerDetailsByTravel(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/collects/routes/${this.clearingCollectsData.routesCollectSelected.routeId}/travels/${this.clearingCollectsData.travelCollectSelected.travelId}/passengers`));
    if (response.status === this.util.successMessage) {
      this.clearingCollectsData.passenger = response.data.passengers;
    } else if (response.showAlert) {
      await this.util.openErrorAlert(response.message);
    }
  }

  async searchPassengerDetailsByVehicle() {
    let response;
    if (this.periodSelected === 1) {
      const dateSplit = this.clearingCollectsData.collectSelected.date.split(' - ');
      response = await this.api.searchPassengerDetailsByVehicle(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/collects/routes/${this.clearingCollectsData.routesCollectSelected.routeId}/vehicles/${this.clearingCollectsData.vehicleCollectSelected.vehicleId}/passengers?startDate=${dateSplit[0].trim()}&endDate=${dateSplit[1].trim()}`));
    } else {
      response = await this.api.searchPassengerDetailsByVehicle(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/collects/routes/${this.clearingCollectsData.routesCollectSelected.routeId}/vehicles/${this.clearingCollectsData.vehicleCollectSelected.vehicleId}/passengers?startDate=${this.clearingCollectsData.routesCollectSelected.date}&endDate=${this.clearingCollectsData.routesCollectSelected.date}`));
    }
    if (response.status === this.util.successMessage) {
      this.clearingCollectsData.passenger = response.data.passengers;
    } else if (response.showAlert){
      await this.util.openErrorAlert(response.message);
    }
  }
}
