import { Injectable } from '@angular/core';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private _api: ApiServiceService) { }

  public async changeStateCompany(endPoint, state) {
    return await this._api.put(endPoint, this._api.getParams({ state: state }));
  }
  
  async getExternalCompanies(endPoint) {
    return await this._api.get(endPoint);
  }

  async addExternalCompany(endPoint: string, data: any) {
    return await this._api.post(endPoint, data);
  }

  async getCompanies(endPoint) {
    return await this._api.get(endPoint);
  }

  async getCompanyById(endPoint) {
    return await this._api.get(endPoint);
  }

  async list(endPoint) {
    return await this._api.get(endPoint)
  }

  async findAllTypesCompanies(endpoint: string) {
    return await this._api.get(endpoint);
  }

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

  async createMasiveList(data, endPoint) {
    return await this._api.post(endPoint, data);
  }
}
