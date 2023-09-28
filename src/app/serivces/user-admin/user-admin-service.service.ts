import { Injectable } from '@angular/core';
import {AuthServiceService} from '../../serivces/auth-service/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserAdminServiceService {

  constructor(private _api: AuthServiceService) { }

  public async getPermissionByUsers(endPoint) {
    return await this._api.get(endPoint);
  }


}
