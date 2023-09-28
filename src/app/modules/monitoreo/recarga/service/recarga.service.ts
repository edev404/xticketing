import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Recargas } from '../models/Recargas';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecargaService {

  API_URL: string = environment.api;

  constructor(private _httpClient: HttpClient) { }

  getListDashboardsRecargas(): Observable<Recargas[]> {
    return this._httpClient.get<Recargas[]>(`${this.API_URL}dashboards/list-recargas`)
  }

}
