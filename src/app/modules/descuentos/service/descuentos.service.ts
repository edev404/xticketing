import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DescuentosService {

  constructor(private api: ApiServiceService, private http: HttpClient) { }

  async create(endPoint, data) {
    return await this.api.post(endPoint, data);
  }

  async update(endPoint, data) {
    return await this.api.put(endPoint, data);
  }

  async findById(endPoint) {
    return this.api.get(endPoint);
  }

  async getList(endPoint) {
    return await this.api.get(endPoint)
  }

  async changeState(endpoint: string, value: boolean) {
    return this.api.put(endpoint, this.api.getParams({ state: value }));
  }

  async findAssignedDiscounts(endPoint: string): Promise<any> {
    return this.api.get(endPoint);
  }

  async changeStateDiscount(endPoint: string, state: boolean): Promise<any> {
    return await this.api.put(endPoint, this.api.getParams({ state: state }));
  }

  getListDiscount<T>(endPoint): Observable<T> {
    return this.http.get<T>(endPoint)
  }

  uploadImage(endpoint: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${endpoint}`, formData);
  }

  changeStateDiscountMaxive(endPoint, plantilla, descuento, id): Observable<any> {
    return this.http.put(`${endPoint}?plantilla=${plantilla}&descuento=${descuento}&id=${id}`, {});
  }

  downloadImageDiscount(endpoint: string, key: string): Observable<Blob> {
    const params = new HttpParams().set("key", key)
    return this.http.get(`${endpoint}`, { params, responseType: 'blob' });
  }

  downloadImageDiscountReports(body: any): Observable<Blob> {
    const headers = new HttpHeaders()
      .append("arn", "A")
      .append("arn", "hola")
      .append("region", "A")
      .append("region", "A")
      .append("typeDataSource", "CONN")
      .append("region", "hola");
    return this.http.post<Blob>(`${environment.apiFilesReports}`, body, { headers, responseType: 'blob' as 'json' });
  }

}
