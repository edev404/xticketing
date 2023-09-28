import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { Dashboards } from '../models/dashboards-models';

@Injectable({
  providedIn: 'root'
})
export class DashboardsService {
  constructor(
    private _httpClient: HttpClient,
    private utils: UtilsService) {
  }

  listDashsboards(): Observable<Dashboards[]> {
      return this._httpClient.get<Dashboards[]>(this.utils.getBasicEndPoint("dashboards/list"));
  }

  listDashsboardsSubidos(): Observable<any> {
    return this._httpClient.get<any>(this.utils.getBasicEndPoint("dashboards/list-subidas"));
}
}
