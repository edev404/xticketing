import { Injectable } from "@angular/core";
import { UtilsService } from "src/app/myUtils/utils.service";
import { AuthServiceService } from "src/app/serivces/auth-service/auth-service.service";
import { BlockRequest } from "../models/BlockRequest";
import { Card } from "../models/Card";
import { UnsubscribeRequest } from "../models/UnsubscribeRequest";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { VentasValid, CardInfo } from '../models/Ventas.interface';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})

export class ApiServiceCardMethodPayment {

  private CARD_PATH = "cards"
  private INITIALIZAITION_PATH = "initialization"
  private REGISTRY_PATH = "registry"
  private COMPANIES_PATH = "companies"
  private DISTRIBUTION_PATH = "distribution"

  constructor(private api: AuthServiceService, private utils: UtilsService, private httpClient: HttpClient) { }

  async getCardList(idEntity) {
    const endpoint = this.utils.getBasicEndPoint(`${this.CARD_PATH}/${idEntity}/list`)
    return await this.api.get(endpoint)
  }

  async getDashboard(idEntity) {
    const endpoint = this.utils.getBasicEndPoint(`${this.CARD_PATH}/${idEntity}/dashboard`)
    return await this.api.get(endpoint)
  }

  async getRequestType() {
    const endpoint = this.utils.getBasicEndPoint(`${this.INITIALIZAITION_PATH}/requestTypes`)
    return await this.api.get(endpoint)
  }

  async getDrivers(id_company: number) {
    const endpoint = this.utils.getBasicEndPoint(`${this.INITIALIZAITION_PATH}/drivers/${id_company}`)
    return await this.api.get(endpoint)
  }

  async getInitUsers() {
    const endpoint = this.utils.getBasicEndPoint(`${this.INITIALIZAITION_PATH}/initusers`)
    return await this.api.get(endpoint)
  }

  async getHistorial(numeroTarjeta: string | undefined) {
    const endpoint = this.utils.getBasicEndPoint(`passengers/historial?numero=${numeroTarjeta}`)
    return await this.api.get(endpoint)
  }

  async getProviders() {
    return this.getProviderCompanies()
  }

  async getCardClasses() {
    const endpoint = this.utils.getBasicEndPoint(`${this.CARD_PATH}/classes`)
    return await this.api.get(endpoint)
  }

  async createRegistry(payload){
    const endpoint = this.utils.getBasicEndPoint(`${this.REGISTRY_PATH}/create`)
    return this.api.post(endpoint, payload)
  }

  async updateRegistry(payload) {
    const endpoint = this.utils.getBasicEndPoint(`${this.REGISTRY_PATH}/update`)
    return await this.api.post(endpoint, payload)
  }

  async getRegistryList(idEntidad: number) {
    const endpoint = this.utils.getBasicEndPoint(`${this.REGISTRY_PATH}/list/${idEntidad}`)
    return await this.api.get(endpoint)
  }

  async createInitializationRequest(json) {
    const endpoint = this.utils.getBasicEndPoint(`${this.INITIALIZAITION_PATH}/create`)
    return await this.api.post(endpoint, json, UtilsService.APPLICATION_JSON)
  }

  async getInitializationRequestList(id: number) {
    const endpoint = this.utils.getBasicEndPoint(`${this.INITIALIZAITION_PATH}/list-all/${id}`)
    return await this.api.get(endpoint)
  }

  async getInitializationRequestFilteredList(filter: string, entity: number) {
    const endpoint = this.utils.getBasicEndPoint(`${this.INITIALIZAITION_PATH}/list/filtered/${filter}/${entity}`)
    return await this.api.get(endpoint)
  }

  async getMappingList() {
    const endpoint = this.utils.getBasicEndPoint(`${this.INITIALIZAITION_PATH}/mapping/list`)
    return await this.api.get(endpoint)
  }

  async getRegistryDetail(id: number) {
    const endpoint = this.utils.getBasicEndPoint(`${this.REGISTRY_PATH}/${id}/detail`)
    return await this.api.get(endpoint)
  }

  async getRegistryDetailReasons() {
    const endpoint = this.utils.getBasicEndPoint(`${this.REGISTRY_PATH}/reasons`)
    return await this.api.get(endpoint)
  }

  async saveNewRegistryDetails(id: number, payload) {
    const endpoint = this.utils.getBasicEndPoint(`${this.REGISTRY_PATH}/${id}/detail/`)
    return await this.api.post(endpoint, payload)
  }

  async getCancellationReasonList() {
    const endpoint = this.utils.getBasicEndPoint(`${this.INITIALIZAITION_PATH}/cancellation-reasons`)
    return await this.api.get(endpoint)
  }

  async cancelRequest(id: number, json) {
    const endpoint = this.utils.getBasicEndPoint(`${this.INITIALIZAITION_PATH}/${id}/cancel`)
    return await this.api.put(endpoint, json)
  }

  async getReasignReasons() {
    const endpoint = this.utils.getBasicEndPoint(`${this.INITIALIZAITION_PATH}/reasign-reasons`)
    return await this.api.get(endpoint)
  }

  async reasignRequest(id:number,payload){
    const endpoint = this.utils.getBasicEndPoint(`${this.INITIALIZAITION_PATH}/${id}/reasign`)
    return await this.api.put(endpoint,payload)
   }

  async getRegistryListForInit() {
    const endpoint = this.utils.getBasicEndPoint(`batches/distribution/passenger`)
    return await this.api.get(endpoint)
  }

  async getListForInit() {
    const endpoint = this.utils.getBasicEndPoint(`batches/initialization`)
    return await this.api.get(endpoint)
  }

  async getFilteredCards(filterValue: string, id: number) {
    const endpoint = this.utils.getBasicEndPoint(`${this.CARD_PATH}/filter/${filterValue}/${id}`)
    return await this.api.get(endpoint)
  }

  async activate(cards: Card[]) {
    const endpoint = this.utils.getBasicEndPoint(`${this.CARD_PATH}/activate`)
    return await this.api.put(endpoint, cards, UtilsService.APPLICATION_JSON)
  }


  async block(blockRequest: BlockRequest) {
    const endpoint = this.utils.getBasicEndPoint(`${this.CARD_PATH}/block/`)
    return await this.api.put(endpoint, blockRequest, UtilsService.APPLICATION_JSON)
  }

  async getBlockReasons() {
    const endpoint = this.utils.getBasicEndPoint(`${this.CARD_PATH}/block-reasons`)
    return await this.api.get(endpoint)
  }

  async getUnsubcribeReasons() {
    const endpoint = this.utils.getBasicEndPoint(`${this.CARD_PATH}/unsubscribe-reasons`)
    return await this.api.get(endpoint)
  }

  async unsubscribe(unsubscribeRequest: UnsubscribeRequest) {
    const endpoint = this.utils.getBasicEndPoint(`${this.CARD_PATH}/unsubscribe/`)
    return await this.api.put(endpoint, unsubscribeRequest, UtilsService.APPLICATION_JSON)
  }

  async getCollectionCompanies() {
    return this.getCompanies(2)
  }

  async getProviderCompanies() {
    return this.getCompanies(3)
  }

  async getCompanies(companyType: number) {
    const endpoint = this.utils.getBasicEndPoint(`${this.COMPANIES_PATH}/?type-id=${companyType}`)
    return await this.api.get(endpoint)
  }

  async getInitListForDistribution(id: number) {
    const endpoint = this.utils.getBasicEndPoint(`${this.INITIALIZAITION_PATH}/list-for-distribution/${id}`)
    return await this.api.get(endpoint)
  }

  async createDistribution(json) {
    const endpoint = this.utils.getBasicEndPoint(`${this.DISTRIBUTION_PATH}/create`)
    return await this.api.post(endpoint, json, UtilsService.APPLICATION_JSON)
  }

  async loadDistributionList(id: number) {
    const endpoint = this.utils.getBasicEndPoint(`${this.DISTRIBUTION_PATH}/list/${id}`)
    return await this.api.get(endpoint)
  }

  async getDistributionDetail(id: number) {
    const endpoint = this.utils.getBasicEndPoint(`${this.DISTRIBUTION_PATH}/${id}/details`)
    return await this.api.get(endpoint)
  }

  async getCardHistory(id: number) {
    const endpoint = this.utils.getBasicEndPoint(`${this.CARD_PATH}/${id}/history`)
    return await this.api.get(endpoint)
  }

  async assignPassenger(card_id: number, passenger_id: number) {
    const endpoint = this.utils.getBasicEndPoint(`${this.CARD_PATH}/${card_id}/assignPassenger/${passenger_id}`)
    //const endpoint = `http://localhost:8080/xticketing/api/${this.CARD_PATH}/${card_id}/assignPassenger/${passenger_id}`
    return await this.api.get(endpoint)
  }

  async getDistributionDashboardDetail(id: number) {
    const endpoint = this.utils.getBasicEndPoint(`${this.DISTRIBUTION_PATH}/dashboard-detail/${id}`)
    return await this.api.get(endpoint)
  }

  async getStockDetail(id: number) {
    const endpoint = this.utils.getBasicEndPoint(`${this.CARD_PATH}/stock-details/${id}`)
    return await this.api.get(endpoint)
  }

  async loadActiveSummarizedCards(id: number) {
    const endpoint = this.utils.getBasicEndPoint(`${this.CARD_PATH}/actives-dashboard-detail/${id}`)
    return await this.api.get(endpoint)
  }

  async getLista(listName) {
    const response = await this.api.get(this.utils.getBasicEndPoint(`listvalues/list-motive?idEntidad=${this.utils.getSelectedEntity()}&nameList='${listName}'&active=true`));
    if (response.status === this.utils.successMessage) {
      if (response.data.value) {
        return response.data.value;
      }
    }
  }

  async createRecharge(endpoint: string , json: any) {
    return await this.api.post(endpoint, json, UtilsService.APPLICATION_JSON)
  }

  async getRecharge(endpoint: string) {
    return await this.api.get(endpoint)
  }


  validarCard(endpoint: string,body: VentasValid ):Observable<CardInfo> {
    return this.httpClient.post<CardInfo>(`${environment.apiGateway}/${endpoint}`, body);
  }

}
