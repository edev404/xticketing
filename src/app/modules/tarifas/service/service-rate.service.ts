import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceRateService {

  constructor(private api: ApiServiceService, private http: HttpClient) { }

  async getList(endPoint) {
    return await this.api.get(endPoint)
  }

  async getServiceList(endPoint) {
    return await this.api.get(endPoint)
  }

  async findById(endPoint) {
    return this.api.get(endPoint);
  }

  async create(endPoint, data) {
    return await this.api.post(endPoint, data);
  }

  async update(endPoint, data) {
    return await this.api.put(endPoint, data);
  }

  async changeState(endpoint: string, value: boolean) {
    return this.api.put(endpoint, this.api.getParams({ state: value }));
  }

  async getUsersEntitiesServicesCompanies(endpoint: string) {
    return await this.api.get(endpoint);
  }

  async getFile(key) {
    let response;
    try {
      response = this.http.get(`http://tools.extreme.com.co/s3uploader/api/file?key=${key}&bucket=extreme-test-images`).toPromise();
    } catch (e) {
      console.error(e);
    }
    return response;
  }

  async getMassiveDiscount(endPoint) {
    return await this.api.get(endPoint)
  }

  
}