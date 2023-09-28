import { Injectable } from '@angular/core';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import {UtilsService} from 'src/app/myUtils/utils.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewCollectionService {

  constructor(private _api: AuthServiceService,private http: HttpClient,private Utils: UtilsService,) { }

  async findAll(endPoint) {
    return await this._api.get(endPoint);
  }

  async findById(endPoint) {
    return await this._api.get(endPoint);
  }
/*
  async update(endPoint, data) {
    return await this._api.put(endPoint, data, UtilsService.APPLICATION_JSON);
  }*/

  async createTraceabilityCollect(endPoint, data) {
    return await this._api.post(endPoint, data, UtilsService.APPLICATION_JSON);
  }

  async getdCollectStates(endPoint) {
    return await this._api.get(endPoint);
  }

  async getCollectMotives(endPoint) {
    return await this._api.get(endPoint);
  }

  async getNovelties(endPoint) {
    return await this._api.get(endPoint);
  }

  
  async createLog(endpoint: string, data: any) {
    return await this._api.post(endpoint, data, UtilsService.APPLICATION_JSON);
  }

  getIPAddress(): Observable<any>{
    return this.http.get('http://api.ipify.org/?format=json');
  }

  getLista(path: string) {
    return this._api.get(path);
  }

  async changeState(endpoint: string) {
    return this._api.put(endpoint, this._api.getParams({state: true}));
  }

  update(path: string, data) {
    return this._api.put(path, data, UtilsService.APPLICATION_JSON);
  }

  updateRecaudo(path: string, data){
    return this._api.put(path, data, UtilsService.APPLICATION_JSON);
  }

  async save(endPoint, data ) {
    return await this._api.post(endPoint, data);
  }


}
