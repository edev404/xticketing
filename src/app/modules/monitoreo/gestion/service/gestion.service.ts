import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Gestion } from '../models/gestion.interface';

@Injectable({
  providedIn: 'root'
})
export class GestionService {
  API_URL = environment.api;

  constructor( private _httpClient: HttpClient ) { }

  getGestionTrans(idEmpresa: number, page: number, size: number): Observable<Gestion[]> {
    return this._httpClient.get<Gestion[]>(`${this.API_URL}gestion/transaccional?idEmpresa=${idEmpresa}&page=${page}&size=${size}`);
  }
}
