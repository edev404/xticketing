import { Injectable } from '@angular/core';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private _api: ApiServiceService) { }

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

  async findByIdCharacteristcs(endpoint: string) {
    return await this._api.get(endpoint);
  }

  async changeState(endpoint: string, value: boolean) {
    return this._api.put(endpoint, this._api.getParams({ state: value }));
  }
}
