import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { Observable } from 'rxjs';
import { LoginServiceService } from 'src/app/serivces/login-service/login-service.service';
import { environment } from 'src/environments/environment';
import { TmpDataFile, TmpTemplate } from 'src/app/modules/clientes/models/archivos.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfigFileService {
  private httpHeaders: any;

  corsAnywhere = '';
  //corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
  timeOut = 15000;

  constructor(
    private http: HttpClient,
    private Utils: UtilsService,
    private api: AuthServiceService,
    private authService: LoginServiceService
  ) {
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
  }
  // CONFIG HTTP
  private getHeaders(contentType) {
    const header = {};
    header['Content-Type'] = contentType;
    const auth = this.authService.getAuth();
    if (auth) {
      header['username'] = auth.user.username;
    }
    return { headers: header };
  }

  private getHeadersExternal(contentType) {
    const header = {};
    header['Content-Type'] = contentType;
    return { headers: header };
  }

  private error() {
    return {
      status: this.Utils.failMessage,
      message: this.Utils.errorGeneralMessage,
      showAlert: true
    };
  }

  verifyClientsErrorStatus(response, err) {
    response.showAlert = err.status !== 401;
    response.error = err.status === 0 ? undefined : true;
    return response;
  }

  saveToken(response) {
    if (response) {
      if (response.status === this.Utils.successMessage && response.data.token) {
        this.authService.setToken(response.data.token);
      }
    }
    return response;
  }

  // HTTP EXTRERNAL
  public async getExternal(
    endPoint,
    contentType = 'application/x-www-form-urlencoded'
  ) {
    let response;
    try {
      response = await this.http
        .get(endPoint, this.getHeadersExternal(contentType))
        .toPromise()
        .catch((e) => {
          return this.verifyClientsErrorStatus(this.error(), e);
        });
      response.showAlert = response.error === undefined;
    } catch (e) {
      response = this.verifyClientsErrorStatus(this.error(), e);
    }
    return this.saveToken(response);
  }

  public async postExternal(
    endPoint,
    params,
    contentType = UtilsService.APPLICATION_FORM_URLENCODED
  ) {
    let response;
    try {
      response = await this.http
        .post(endPoint, params, this.getHeadersExternal(contentType))
        .toPromise().catch(e => {
          return this.verifyClientsErrorStatus(this.error(), e);
        });
      response.showAlert = response.error === undefined;
    } catch (e) {
      response = this.verifyClientsErrorStatus(this.error(), e);
    }
    return this.saveToken(response);
  }

  public async putExternal(
    endPoint,
    params,
    contentType = UtilsService.APPLICATION_FORM_URLENCODED
  ) {
    let response;
    try {
      response = await this.http
        .put(endPoint, params, this.getHeadersExternal(contentType))
        .toPromise().catch(e => {
          return this.verifyClientsErrorStatus(this.error(), e);
        });
      response.showAlert = response.error === undefined;
    } catch (e) {
      response = this.verifyClientsErrorStatus(this.error(), e);
    }
    return this.saveToken(response);
  }

  public async deleteExternal(
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

  // METODS
  createConfigPlantilla(data): Observable<any> {
    return this.http.post<any>(`${environment.apiFiles}configFieldsFile`, data);
  }

  async getLista(listName) {
    const response = await this.api.get(this.Utils.getBasicEndPoint(`listvalues/list-motive?idEntidad=${this.Utils.getSelectedEntity()}&nameList='${listName}'&active=true`));
    if (response.status === this.Utils.successMessage) {
      if (response.data.value) {
        return response.data.value;
      }
    }
  }

  public async getListPlantillasConfig(endPoint) {
    return await this.api.get(endPoint);
  }
  public async getListPlantillas(endPoint) {
    return await this.api.get(endPoint);
  }
  downloadPlantillas(endPoint: string, file: string, contentType: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename=${file}.csv`
    });;
    return this.http.post<Blob>(endPoint, {}, { headers, responseType: 'blob' as 'json' });
  }
  createdPlantillas(endPoint: string, json: TmpTemplate ): Observable<any> {
    return this.http.post<any>(endPoint, json);
  }
  subirPlantillas(endPoint: string, json: TmpDataFile[] ): Observable<any> {
    return this.http.post<any>(endPoint, json);
  }
  updatePlantilla(endPoint: string, status: boolean): Observable<any> {
    const params = new HttpParams().set("status", status)
    return this.http.put(endPoint, {} ,{ params })
  }
}
