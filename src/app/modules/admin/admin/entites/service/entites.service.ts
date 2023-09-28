import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntitesService {

  constructor(
    private _api: ApiServiceService,
    private http: HttpClient,
    public utils: UtilsService,
  ) { }

  async getEntityByRelations(endpoint: string): Promise<any> {
    return this._api.get(endpoint);
  }

  async createRelationEntity(endpoint: string, data: any): Promise<any> {
    return this._api.post(endpoint, data);
  }

  async updateRelationEntity(endpoint: string, data: any): Promise<any> {
    return this._api.put(endpoint, data);
  }  

  async deleteRelationEntity(endpoint: string): Promise<any> {
    return this._api.delete(endpoint);
  }

  async getServices(endpoint: string): Promise<any> {
    return this._api.get(endpoint);
  }

  async changeState(endpoint: string, value: boolean) {
    return this._api.put(endpoint, this._api.getParams({ state: value }));
  }

  async getCountries(endPoint) {
    return await this._api.get(endPoint);
  }

  async getDeparments(endPoint) {
    return await this._api.get(endPoint);
  }
  
  async getCities(endPoint) {
    return await this._api.get(endPoint);
  }

  ListEntities(): Observable<any> {
    return this.http.get(environment.api + 'entities')
      .pipe(
        map((response: any) => response)
      )
  }

  getByIdEntities(id): Observable<any> {
    return this.http.get(environment.api + 'entities/' + id)
      .pipe(
        map((response: any) => response)
      )
  }
}
