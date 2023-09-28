import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {

  constructor(private _httpClient: HttpClient) { }

  listAlertas(): Observable<any> {
    return this._httpClient.get(`${environment.api}alerta/refresh`);
  }

  updateAlertas(idAlerta: number, idUsuario: number): Observable<any> {
    return this._httpClient.put(`${environment.api}alerta/update-date?idUsuario=${idUsuario}&idAlerta=${idAlerta}`, {});
  }

  updateAlertasMassive(json: any, idUsuario: number): Observable<any> {
    return this._httpClient.put(`${environment.api}alerta/update-masively?idUsuario=${idUsuario}`, json);
  }
}
