import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';
import { environment } from 'src/environments/environment';
import { Tipos } from '../models/reportes.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private _api: ApiServiceService, private httpClient: HttpClient) { }

  public async getActionsByModule(userId, moduleId) {
    return await this._api.get(`${environment.api}users/${userId}/modules/${moduleId}`);
  }

  getListarMovimientos(): Observable<Tipos> {
    return this.httpClient.get<Tipos>(`${environment.api}reports/tipos-movimiento`);
  }

}
