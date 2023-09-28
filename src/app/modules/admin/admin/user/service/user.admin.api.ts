import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { LoginServiceService } from 'src/app/serivces/login-service/login-service.service';
import { Logo } from 'src/app/shared/models/navbar.interface';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';


@Injectable({
  providedIn: 'root'
})

export class ApiServiceUserAdmin {

  constructor(
    private _api: ApiServiceService,
    private http: HttpClient,
    public utils: UtilsService,
  ) { }

  public async getListUsers(endPoint) {
    return await this._api.get(endPoint);
  }

  public async getUserById(endPoint) {
    return await this._api.get(endPoint);
  }

  public async changeStateUser(endPoint, state) {

    return await this._api.put(endPoint, this._api.getParams({ state: state }));
  }

  public async saveUser(data, endPoint) {
    return await this._api.post(endPoint, data);
  }

  public async updateUser(endPoint, data) {
    return await this._api.put(endPoint, data);
  }

  public async getPermissionByUsers(endPoint) {
    return await this._api.get(endPoint);
  }

  public async generateCode(endPoint, data) {
    return await this._api.post(endPoint, this._api.getParams(data));
  }

  public async checkCode(endPoint, data) {
    return await this._api.post(endPoint, this._api.getParams(data));
  }

  //PROFILE

  public async getProfileList(endPoint) {
    return await this._api.get(endPoint);
  }

  public async changeStateProfile(endPoint, state) {
    return await this._api.put(endPoint, this._api.getParams({ state: state }));
  }

  public async getMasterModules(endPoint) {
    return await this._api.get(endPoint);
  }

  public async saveProfile(data, endPoint) {
    return await this._api.post(endPoint, data);
  }

  public async getModulesByProfile(endPoint) {
    return await this._api.get(endPoint);
  }

  public async updateProfile(endPoint, data) {
    return await this._api.put(endPoint, data);
  }

  async getEntityServices(endpoint: string) {
    return await this._api.get(endpoint);
  }

  async getUsersEntitiesServicesCompanies(endpoint: string) {
    return await this._api.get(endpoint);
  }

  async getEntities(endpoint: string) {
    return await this._api.get(endpoint);
  }

  async entityDefault(endPoint: string, data: any) {
    return await this._api.put(endPoint, { value: data });
  }

  async getServicesByUser(endpoint: string) {
    return await this._api.get(endpoint);
  }

  async getCompaniesByUser(endpoint: string) {
    return await this._api.get(endpoint);
  }

  async addCompanyToUser(endPoint: string, data: any) {
    return await this._api.post(endPoint, data);
  }

  async removeCompanyToUser(endPoint: string, data: any) {
    return await this._api.post(endPoint, this._api.getParams(data));
  }

  async findAll(endpoint: string) {
    return await this._api.get(endpoint);
  }

  async findById(endpoint: string) {
    return this._api.get(endpoint);
  }

  async create(endpoint: string, data: any) {
    return this._api.post(endpoint, data);
  }

  async update(endpoint: string, data: any) {
    return this._api.put(endpoint, data);
  }

  getLogoEntities(id: string): Observable<Logo> {
    return this.http.get<Logo>(environment.api + `entities/logo?id=${id}`, )
  }
}