import { Injectable } from '@angular/core';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private _api: ApiServiceService) { }

  public async getlogList(endPoint) {
    return await this._api.get(endPoint);
  }
}
