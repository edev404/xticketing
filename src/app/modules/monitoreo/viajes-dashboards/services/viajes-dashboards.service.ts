import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Viajes } from '../models/viajes.interface';

@Injectable({
  providedIn: 'root'
})
export class ViajesDashboardsService {

  API_URL: string = environment.api;

  constructor(private httpClient: HttpClient) {
   }

   getDashboardsViajes(): Observable<Viajes[]> {
    return this.httpClient.get<Viajes[]>(`${this.API_URL}dashboards/list-viajes`);
   }
}
