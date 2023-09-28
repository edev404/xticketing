import { Injectable } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClearingServiceService {
  constructor(private api: AuthServiceService,public util: UtilsService,) {}

  getBaseListState(): any[] {
    return [{id: 4, name: 'Todas', code: undefined},
      {id: 5, name: 'Borrador', code: 'B'},
      {id: 3, name: 'Por revisión', code: 'P'},
      {id: 2, name: 'Rechazadas', code: 'R'},
      {id: 1, name: 'Anuladas', code: 'AN'}];
  }

  async getCities(endPoint) {
    return await this.api.get(endPoint);
  }

  async getCompanies(endPoint) {
    return await this.api.get(endPoint);
  }

  public async listCompanies(endPoint) {
    return await this.api.get(endPoint);
  }

  findAll(path) {
    return this.api.get(path);
  }

  findRechargeDetails(path) {
    return this.api.get(path);
  }

  // FINDINGS
  findDiscoverList(path: string) {
    return this.api.get(path);
  }

  findDiscoverTypes(path: string) {
    return this.api.get(path);
  }

  save(path: string, data: string) {
    return this.api.post(path, data, UtilsService.APPLICATION_JSON);
  }

  update(path: string, data: string) {
    return this.api.put(path, data, UtilsService.APPLICATION_JSON);
  }

  // DETAILS RECHARGE - PASSAGE
  findById(path) {
    return this.api.get(path);
  }

  findRechargeDetailsByBranchOffices(path) {
    return this.api.get(path);
  }

  changeState(path: string, data) {
    return this.api.put(path, this.api.getParams(data), UtilsService.APPLICATION_FORM_URLENCODED);
  }

  findRouteDetailsTickets(path) {
    return this.api.get(path);
  }

  findTravelDetails(path) {
    return this.api.get(path);
  }

  findVehicleDetails(path) {
    return this.api.get(path);
  }

  searchPassengerDetailsByTravel(path) {
    return this.api.get(path);
  }

  searchPassengerDetailsByVehicle(path) {
    return this.api.get(path);
  }

  findDistributionDetails(path) {
    return this.api.get(path);
  }

  findCollectsTickets(path) {
    return this.api.get(path);
  }
}
