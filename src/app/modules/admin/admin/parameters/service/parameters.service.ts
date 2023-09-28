import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';
import { environment } from 'src/environments/environment';
import { Notificacion, Plantilla, PlantillaEmail } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {

  constructor(
    private http: HttpClient,
    public utils: UtilsService,
    public _api: ApiServiceService
  ) { }

  async getList(endpoint: string) {
    return await this._api.get(endpoint);
  }

  getListPlantilla(endpoint: string): Observable<PlantillaEmail> {
    return this.http.get<PlantillaEmail>(endpoint);
  }
  
  async changeState(endpoint: string, value: boolean) {
    return this._api.put(endpoint, this._api.getParams({ state: value }));
  }

  async updateGeneralConfigAdmin(data, endPoint) {
    return await this._api.put(endPoint, data);
  }

  async getGeneralConfigAdmin(endPoint) {
    return await this._api.get(endPoint);
  }

  async getCollectTypes(endPoint) {
    return await this._api.get(endPoint);
  }

  async getCollectPassengersCant(endPoint) {
    return await this._api.get(endPoint);
  }

  async getMobileConfigAdmin(endPoint) {
    return await this._api.get(endPoint);
  }

  async updateMobileConfigAdmin(endPoint, data) {
    return await this._api.put(endPoint, data);
  }

  async createMobileConfigAdmin(endPoint, data) {
    return await this._api.post(endPoint, data);
  }

  getByIdList(id): Observable<any> {
    return this.http.get(environment.api + 'adminlist/' + id)
      .pipe(
        map((response: any) => response)
      )
  }

  getAllValuesByList(id): Observable<any> {
    return this.http.get(environment.api + 'listvalues/values/' + id + '/' + this.utils.getSelectedEntity(), this._api.getHeaders('application/x-www-form-urlencoded'))
      .pipe(
        map((response: any) => response)
      )
  }

  getByIdValues(id): Observable<any> {
    return this.http.get(environment.api + 'listvalues/' + id)
      .pipe(
        map((response: any) => response)
      )
  }

  putValues(data, id): Observable<any> {
    return this.http.put(environment.api + 'listvalues/' + id, data, this._api.getHeaders('application/x-www-form-urlencoded'))
      .pipe(
        map((response: any) => response)
      )
  }

  addNewList(data): Observable<any> {
    return this.http.post(environment.api + 'adminlist', data, this._api.getHeaders('application/x-www-form-urlencoded'))
      .pipe(
        map((response: any) => response)
      )
  }

  addNewValues(data): Observable<any> {
    return this.http.post(environment.api + 'listvalues', data, this._api.getHeaders('application/x-www-form-urlencoded'))
      .pipe(
        map((response: any) => response)
      )
  }

  subirPlantilla(json: Plantilla): Observable<any> {
    return this.http.post(`${environment.apiFiles}detailsTemplateFile`, json);
  }
  
  
  subirPlantillaNot(json: Notificacion): Observable<any> {
    return this.http.post(`${environment.api}plantilla`, json);
  }

  updatePlantillaNot(id: number, json: Notificacion): Observable<any> {
    return this.http.put(`${environment.api}plantilla/${id}`, json);
  }
}
