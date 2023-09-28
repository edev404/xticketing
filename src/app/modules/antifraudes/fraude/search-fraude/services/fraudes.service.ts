import { Injectable } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { AsignarFraudeUpdate, AgruparFraudeUpdate, CreateGrupo, DesagruparFraudeUpdate, DesasignarFraudeUpdate } from '../interfaces/fraudes-acciones';

@Injectable({
  providedIn: 'root'
})
export class FraudesService {

  constructor(private _api: AuthServiceService, private utils: UtilsService) { }

  /**
   * Asignar fraudes
   * @param fraudes: AsignarFraudeUpdate[]
   * @returns Promise<any>
   */
  async asignarFraudes(fraudes: AsignarFraudeUpdate[]): Promise<any> {
    return await this._api.put(this.utils.getBasicEndPoint(`fraude/actualizar/grupo?accion=1`), fraudes,  UtilsService.APPLICATION_JSON);
  }

  /**
   * Crear grupo para luego agrupar los fraudes con la foreing key del grupo
   * @param grupo: CreateGrupo
   * @returns Promise<any>
   */
  async crearGrupo(grupo: CreateGrupo): Promise<any> {
    return await this._api.post(this.utils.getBasicEndPoint(`grupofraude`), grupo,  UtilsService.APPLICATION_JSON);
  }

  /**
   * Agrupar fraudes
   * @param fraudes: AgruparFraudeUpdate[]
   * @returns Promise<any>
   */
  async agruparFraudes(fraudes: AgruparFraudeUpdate[]): Promise<any> {
    return await this._api.put(this.utils.getBasicEndPoint(`fraude/actualizar/grupo?accion=5`), fraudes,  UtilsService.APPLICATION_JSON);
  }

  /**
   * Desagrupar fraudes
   * @param fraudes: AgruparFraudeUpdate[]
   * @returns Promise<any>
   */
  async desagruparFraudes(fraudes: DesagruparFraudeUpdate[]): Promise<any> {
    return await this._api.put(this.utils.getBasicEndPoint(`fraude/actualizar/grupo?accion=3`), fraudes,  UtilsService.APPLICATION_JSON);
  }

  /**
   * Desasignar fraudes
   * @param fraudes: AgruparFraudeUpdate[]
   * @returns Promise<any>
   */
  async desasignarFraudes(fraudes: DesasignarFraudeUpdate[]): Promise<any> {
    return await this._api.put(this.utils.getBasicEndPoint(`fraude/actualizar/grupo?accion=2`), fraudes,  UtilsService.APPLICATION_JSON);
  }

  /**
   * Lista de usuarios de fraudes
   * @param endPoint: string
   * @returns 
   */
  public async getListUsersFraude(endPoint): Promise<any> {
    return await this._api.get(endPoint);
  }


}
