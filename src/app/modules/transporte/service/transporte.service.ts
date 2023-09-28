import { Injectable } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class TransporteService {

  constructor(private _api: ApiServiceService, private utils: UtilsService) { }

  public async listRoutes(endPoint) {
    return await this._api.get(endPoint);
  }

  public async loadTrasnferRoutes(endPoint) {
    return await this._api.get(endPoint);
  }

  public async getTransferSettingItems(endPoint) {
    return await this._api.get(endPoint);
  }

  public async getRelatedRoutes(endPoint) {
    return await this._api.get(endPoint);
  }

  public async updateTransfer(data, allowedtransfer, endPoint) {
    return await this._api.put(endPoint, this._api.getParams({data: data, allowedtransfer: allowedtransfer}));
  }

  public async createTransfer(data, endPoint) {
    return await this._api.post(endPoint, data);
  }

  public async addTermTimeItem(data, endPoint) {
    return await this._api.post(endPoint, this._api.getParams({data: data}));
  }

  public async deleteSettingItem(endPoint) {
    return await this._api.delete(endPoint);
  }

  public async listRoutesToTransfer(endPoint) {
    return await this._api.get(endPoint);
  }

  public async changeStateRelate(endPoint) {
    return await this._api.put(endPoint, {});
  }

  public async getRelatedZone(endPoint) {
    return await this._api.get(endPoint);
  }

  public async approveOrRejectTransshipment(endPoint, data) {
    return await this._api.post(endPoint, this._api.getParams(data));
  }

  public async getCollect(endPoint, data) {
    return await this._api.post(endPoint, this._api.getParams(data));
  }

  public async linkedCharacteristic(endPoint,data){
    return await this._api.put(endPoint, data,  UtilsService.APPLICATION_JSON);
  }

  public async getVehicle(endPoint) {
    return await this._api.get(endPoint);
  }
}
