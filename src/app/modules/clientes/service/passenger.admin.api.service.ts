import { Injectable } from '@angular/core';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PassengerAdminApiService {

  API_URL: string = environment.api + "passengers/account-movement";
  constructor(
    private _api: AuthServiceService,
    private httpClient: HttpClient
  ) { }

  // PASSENGER VIEW
  async loadPassengers(endPoint) {
    return this._api.get(endPoint);
  }

  async getList(endPoint) {
    return this._api.get(endPoint);
  }
  /*
    async changeStateClient(endPoint, state) {
      return this._api.put(endPoint, this._api.getParams({state: state}));
    }*/

  async getPassengerById(endPoint) {
    return this._api.get(endPoint);
  }
  /*
    async updatePassenger(data, endPoint) {
      return this._api.put(endPoint, data);
    }*/

  // PASSENGER MASTER
  async getCountries(endPoint) {
    return await this._api.get(endPoint);
  }

  async getDepartments(endPoint) {
    return await this._api.get(endPoint);
  }

  async getCities(endPoint) {
    return await this._api.get(endPoint);
  }

  async getIdentificationTypes(endPoint) {
    return await this._api.get(endPoint);
  }

  async getMaritalState(endPoint) {
    return await this._api.get(endPoint);
  }

  async getOccupations(endPoint) {
    return await this._api.get(endPoint);
  }

  async getGenders(endPoint) {
    return await this._api.get(endPoint);
  }

  async getProfiles(endPoint) {
    return await this._api.get(endPoint);
  }

  async createMasiveSucursales(data, endPoint) {
    return await this._api.post(endPoint, data);
  }

  // PASSENGER CREATE
  async createPassenger(data, endPoint) {
    return await this._api.post(endPoint, data);
  }

  async updatePassenger(data, endPoint) {
    return this._api.put(endPoint, data);
  }

  public async generateCode(endPoint, data) {
    return await this._api.post(endPoint, this._api.getParams(data));
  }

  public async checkCode(endPoint, data) {
    return await this._api.post(endPoint, this._api.getParams(data));
  }

  // CLIENTS
  async loadClients(endPoint, data) {
    return this._api.post(endPoint, data, UtilsService.APPLICATION_JSON);
  }

  async findAssignedDiscounts(endPoint: string): Promise<any> {
    return this._api.get(endPoint);
  }

  async updateStateClient(endpoint: string, idStateAccount: number, description: string) {
    return this._api.put(endpoint, this._api.getParams({ idStateAccount, description }));
  }

  movimientoCuenta(numeroCuenta: string): Observable<any> {
    return this.httpClient.get<any>(`${this.API_URL}?numeroCuenta=${numeroCuenta}`);
  }

  /*
    async updateStateClient(endpoint: string, idStateAccount: number, description: string) {
      return this._api.put(endpoint, this._api.getParams({idStateAccount, description}));
    }
  */
  // Vincular Tarjeta
  async validateCard(endPoint) {
    return await this._api.get(endPoint);
  }
  async validateCuenta(endPoint) {
    return await this._api.get(endPoint);
  }

  async getBalance(endPoint) {
    return await this._api.get(endPoint);
  }

  async vincularCard(endPoint, body) {
    return await this._api.post(endPoint, body);
  }

  async rechargeAccount(endPoint, data) {
    return this._api.post(endPoint, data, UtilsService.APPLICATION_JSON);
  }
  cargarPQR(idPasajero: number): Observable<any> {
    const params = new HttpParams().set("idPasajero", idPasajero)
    return this.httpClient.get(`${environment.api}pqr/list-pqr-pasajero`, { params });
  }

  async getFilteredCards(endPoint) {
    return await this._api.get(endPoint);
  }

}
