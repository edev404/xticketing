import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {AuthServiceService} from '../../serivces/auth-service/auth-service.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoginServiceService } from '../login-service/login-service.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(
    private _api: AuthServiceService,
    private http: HttpClient,
    private authService: LoginServiceService,
    private util: UtilsService
  ) { }

  verifyClientsErrorStatus(response, err) {
    response.showAlert = err.status !== 401;
    response.error = err.status === 0 ? undefined : true;
    return response;
  }

  saveToken(response) {
    if (response) {
      if (response.status === 'success' && response.data.token) {
        this.authService.setToken(response.data.token);
      }
    }
    return response;
  }

  public getParams(params: any) {
    return new HttpParams({
      fromObject: params,
    });
  }

  public getHeaders(contentType) {
    const header= {};
    header['Content-Type'] = contentType;
    const auth = this.authService.getAuth();
    if (auth) {
      header['username'] = auth.user.username;
    }
    return {headers: header};
  }

  private error() {
    return {
      status: 'fail',
      message: this.util.errorGeneralMessage,
      showAlert: true
    };
  }
  
  // http
  public async post(
    endPoint: any,
    params: any,
    contentType = 'application/x-www-form-urlencoded'
  ) {
    let response;
    try {
      response = await this.http
        .post(endPoint, params, this.getHeaders(contentType))
        .toPromise().catch(e => {
          return this.verifyClientsErrorStatus(this.error(), e);
        });
      response.showAlert = response.error === undefined;
    } catch (e) {
      response = this.verifyClientsErrorStatus(this.error(), e);
    }
    return this.saveToken(response);
  }

  public async get(
    endPoint,
    contentType = 'application/x-www-form-urlencoded',
  ) {
    let response;
    try {
      response = await this.http
        .get(endPoint, this.getHeaders(contentType))
        .toPromise().catch(e => {
          return this.verifyClientsErrorStatus(this.error(), e);
        });        
      response.showAlert = response.error === undefined;
    } catch (e) {
      response = this.verifyClientsErrorStatus(this.error(), e);
    }
    return this.saveToken(response);
  }

  public async put(
    endPoint,
    params,
    contentType = 'application/x-www-form-urlencoded',
  ) {
    let response;
    try {
      response = await this.http
        .put(endPoint, params, this.getHeaders(contentType))
        .toPromise().catch(e => {
          return this.verifyClientsErrorStatus(this.error(), e);
        });
      response.showAlert = response.error === undefined;
    } catch (e) {
      response = this.verifyClientsErrorStatus(this.error(), e);
    }
    return this.saveToken(response);
  }

  public async delete(
    endPoint,
    contentType = UtilsService.APPLICATION_FORM_URLENCODED
  ) {
    let response;
    try {
      response = await this.http
        .delete(endPoint, this.getHeaders(contentType))
        .toPromise().catch(e => {
          return this.verifyClientsErrorStatus(this.error(), e);
        });
      response.showAlert = response.error === undefined;
    } catch (e) {
      response = this.verifyClientsErrorStatus(this.error(), e);
    }
    return this.saveToken(response);
  }

  public async getFile(endPoint) {
    let response;
    try {
      let  httpOptions =  {'responseType'  : 'arraybuffer' as 'json'};
      response = await this.http
        .get(endPoint, httpOptions)
        .toPromise().catch(e => {
          return this.verifyClientsErrorStatus(this.error(), e);
        });
      response.showAlert = response.error === undefined;
    } catch (e) {
      response = this.verifyClientsErrorStatus(this.error(), e);
    }
    return this.saveToken(response);

  }

  public async getActionsByModule(userId, moduleId) {
    return await this.get(`${environment.api}users/${userId}/modules/${moduleId}`);
  }

  /**
   * @name get by José Ramírez
   * @brief Obtener listas tipos para campos selects
   * @param listName: string
   * @returns Promise<any>
   */
  async getLista(listName: string): Promise<any> {
    const response = await this.get(this.util.getBasicEndPoint(`listvalues/list-motive?idEntidad=${this.util.getSelectedEntity()}&nameList='${listName}'&active=true`));
    if (response.status === this.util.successMessage) {
      if (response.data.value) {
        return response.data.value;
      }
    }
  }

  // deprecar
  public async getWithList(endPoint) {
    return await this._api.get(endPoint);
  }

  public async getGrayList(endPoint) {
    return await this._api.get(endPoint);
  }

  public async getBlackList(endPoint) {
    return await this._api.get(endPoint);
  }

}
