import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { RegistrarAnalisis, RegistrarSancion, EnviarNotificacion, UpdateNotificacion } from '../interfaces/analizar-acciones.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AnalizarFraudeService {

  /* Variable BehaviorSubject para emitir valores en pestañas de acciones */
  public tabAccionesSubject$ = new BehaviorSubject<number>(0);
  /* Variable observable de tabAccionesSubject$ */
  tabAccionesSubjectBehavior = this.tabAccionesSubject$.asObservable();

  /* Variable BehaviorSubject para emitir valores en pestañas de tablas */
  public tabTablasSubject$ = new BehaviorSubject<number>(0);
  /* Variable observable de tabTablasSubject$ */
  tabTablasSubjectBehavior = this.tabTablasSubject$.asObservable();

  /* Variable BehaviorSubject para emitir fraudes seleccionados */
  public fraudesPorAnalizar$ = new BehaviorSubject<any>([]);
  /* Variable observable de fraudesPorAnalizar$ */
  fraudesPorAnalizarBehavior = this.fraudesPorAnalizar$.asObservable();

  /* Variable BehaviorSubject para emitir los ID's de fraudes seleccionados */
  public idFraudesPorAnalizar$ = new BehaviorSubject<any>(new Set());
  /* Variable observable de idFraudesPorAnalizar$ */
  idFraudesPorAnalizarBehavior = this.idFraudesPorAnalizar$.asObservable();

  /* Variable BehaviorSubject para emitir los fraudes analizados */
  public fraudesAnalizados$ = new BehaviorSubject<any>([]);
  /* Variable observable de fraudesAnalizados$ */
  fraudesAnalizadosBehavior = this.fraudesAnalizados$.asObservable();

  /* Variable BehaviorSubject para emitir los fraudes sancionados */
  public fraudesSancionados$ = new BehaviorSubject<any>([]);
  /* Variable observable de fraudesSancionados$ */
  fraudesSancionadosBehavior = this.fraudesSancionados$.asObservable();

  /* Variable BehaviorSubject para emitir las notificaciones de fraudes */
  public notificacionesFraudes$ = new BehaviorSubject<any>([]);
  /* Variable observable de notificacionesFraudes$ */
  notificacionesFraudesBehavior = this.notificacionesFraudes$.asObservable();

  /* Variable BehaviorSubject para editar notificacion */
  public editarNotificacion$ = new BehaviorSubject<any>(undefined);
  /* Variable observable de editarNotificacion$ */
  editarNotificacionBehavior = this.editarNotificacion$.asObservable();

  /* Variable BehaviorSubject para habilitaar boton de enviar notificacion */
  public enableOrDisableBottomNotificacion$ = new BehaviorSubject<any>(false);
  /* Variable observable de enableOrDisableBottomNotificacion$ */
  enableOrDisableBottomNotificacionBehavior = this.enableOrDisableBottomNotificacion$.asObservable();

  constructor(private _api: AuthServiceService, private utils: UtilsService) { }

  /**
   * Registrar analisis de casos de posibles fraudes
   * @param registrarAnalisis: RegistrarAnalisis
   * @returns Promise<any>
   */
  async registerAnalisis(registrarAnalisis: RegistrarAnalisis[]): Promise<any> {
    return await this._api.post(this.utils.getBasicEndPoint(`analyze-fraud/create-resgistro`), registrarAnalisis, UtilsService.APPLICATION_JSON);
  }

  /**
   * Registra análisis agrupados para detección de fraude.
   * @param registrarAnalisisAgrupados - Lista de análisis agrupados a registrar.
   * @returns Una promesa que se resuelve con la respuesta del servidor.
   */
  async registrarAnalisisAgrupados(registrarAnalisisAgrupados: any): Promise<any> {
    try {
      const endpoint = this.utils.getBasicEndPoint(`analyze-fraud/create-registro-agrupado`);
      const response = await this._api.post(endpoint, registrarAnalisisAgrupados, UtilsService.APPLICATION_JSON);
      return response;
    } catch (error) {
      // Manejo de errores aquí, si es necesario.
      throw error;
    }
  }

  /**
   * Obtener lista de fraudes analizados asignados al usuario loggeado
   * @param idUsuario: number 
   * @returns Promise<any> 
   */
  async getFraudesAnalizados(idUsuario: number): Promise<any> {
    return this._api.get(this.utils.getBasicEndPoint(`analyze-fraud/list-analizar?id=${idUsuario}`));
  }

  /**
   * Registrar sancion de fraudes analizados
   * @param fraudeAnalizado: RegistrarSancion
   * @returns Promise<any>
   */
  async registerSanction(fraudeAnalizado: RegistrarSancion[]): Promise<any> {
    return await this._api.post(this.utils.getBasicEndPoint(`analyze-fraud/create-sanction`), fraudeAnalizado, UtilsService.APPLICATION_JSON);
  }

  /**
   * Obtener lista de fraudes analizados asignados al usuario loggeado
   * @param idUsuario: number 
   * @returns Promise<any> 
   */
  async getSancionesRegistradas(idUsuario: number, fraudes: number[]): Promise<any> {
    const listFraudes = fraudes.toString();
    return this._api.get(this.utils.getBasicEndPoint(`analyze-fraud/list-sancion?id=${idUsuario}&fraudes=${listFraudes}`));
  }

  /**
     * Enviar notificacion de sanciones
     * @param notificacion: EnviarNotificacion
     * @returns Promise<any>
     */
  async enviarNotificacion(notificacion: EnviarNotificacion[]): Promise<any> {
    return await this._api.post(this.utils.getBasicEndPoint(`analyze-fraud/create-notification`), notificacion, UtilsService.APPLICATION_JSON);
  }

  /**
   * Obtener lista de plantillas
   * @returns Promise<any> 
   */
  async getPlantillas(): Promise<any> {
    return this._api.get(this.utils.getBasicEndPoint(`plantilla`));
  }

  /**
   * Obtener lista de usuarios para notificar
   * @returns Promise<any> 
   */
  async getUsuariosNotificacion(idFraudes: number[]): Promise<any> {
    const idFraudesConParentesis = `(${idFraudes.join(',')})`;
    return this._api.get(this.utils.getBasicEndPoint(`analyze-fraud/list-user?fraudes=${idFraudesConParentesis}`));
  }

  /**
   * Obtener listar fraudes notificacion
   * @returns Promise<any> 
   */
  async getNotificacionesRegistradas(idUsuario: number): Promise<any> {
    return this._api.get(this.utils.getBasicEndPoint(`analyze-fraud/list-notificacion?id=${idUsuario}`));
  }

  /**
   * Editar notificacion
   * @returns Promise<any> 
   */
  async editNotificacion(updateNotificacion: UpdateNotificacion): Promise<any> {
    return this._api.put(this.utils.getBasicEndPoint(`analyze-fraud/update-notificacion`), updateNotificacion, UtilsService.APPLICATION_JSON);
  }

}
