import { Injectable } from '@angular/core';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class ClearingAdminService {

  constructor(private _api: ApiServiceService,) { }

  async findAll(endpoint: string) {
    return await this._api.get(endpoint);
  }

  async findById(endpoint: string) {
    return this._api.get(endpoint);
  }

  async create(endpoint: string, data: any) {
    return this._api.post(endpoint, data);
  }

  async update(endpoint: string, data: any) {
    return this._api.put(endpoint, data);
  }

  async createObj(endpoint: string, data: any) {
    return this._api.post(endpoint, data, 'application/json');
  }

  async updateObj(endpoint: string, data: any) {
    return this._api.put(endpoint, data, 'application/json');
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

  async changeState(endpoint: string, value: boolean) {
    return this._api.put(endpoint, this._api.getParams({ state: value }));
  }

  async save(path: string, data: string) {
    return this._api.post(path, data);
  }

  async findByCompany(endPoint: string) {
    return this._api.get(endPoint);
  }

  async findCompanies(endPoint) {
    return this._api.get(endPoint);
  }

  findDiscoverTypes(path: string) {
    return this._api.get(path);
  }
}
