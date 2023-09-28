import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginServiceService } from '../login-service/login-service.service';
import {UtilsService } from '../../myUtils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private httpHeaders: any;
  
  constructor(private http: HttpClient, private authService: LoginServiceService, private util: UtilsService) { 
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
  }

  public getParams(params: any) {
    return new HttpParams({
      fromObject: params,
    });
  }

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

  verifyClientsErrorStatus(response, err) {
    response.showAlert = err.status !== 401;
    response.error = err.status === 0 ? undefined : true;
    return response;
  }

  private error() {
    return {
      status: 'fail',
      message: 'No hubo comunicación con el servidor, revise su conexión a internet o llámenos a la línea de soporte.',
      showAlert: true
    };
  }

  private getHeaders(contentType) {
    const header= {};
    header['Content-Type'] = contentType;
    const auth = this.authService.getAuth();
    if (auth) {
      header['username'] = auth.user.username;
    }
    return {headers: header};
  }

  saveToken(response) {
    if (response) {
      if (response.status === 'success' && response.data.token) {
        this.authService.setToken(response.data.token);
      }
    }
    return response;
  }

  public async authenticateUser(user: any, password: any) {
    return await this.post(
      `${environment.api}users/authenticate`,
      this.getParams({user: user, password: password})
    );
  }

  public async restorePassword(data: string){
    return await this.put(
      `${environment.api}users/reset-password`,
      data
    );
  }

  public async enviarCorreo(user) {
    return await this.post(
      `${environment.api}users/password-recovery/${user}`,
      user
    );
  }

  public async listEntities(idUser) {
    return await this.get(`${environment.api}users/associated?id=${idUser}`);
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

}
