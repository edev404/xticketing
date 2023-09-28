import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UtilsService } from 'src/app/myUtils/utils.service';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { AccionesEstados } from '../pqr/parametros-pqr/models/reporte.interface';

@Injectable({
  providedIn: 'root'
})
export class PqrServiceService {

  constructor(
    private authService:AuthServiceService, 
    private utilsService:UtilsService,
  ) { }

  PATH = 'pqr';
  CONTENT_TYPE = 'application/json';
  basicEndpoint = this.utilsService.getBasicEndPoint(this.PATH);

  async createPQR(body:any) {
    return await this.authService.post(this.basicEndpoint, JSON.stringify(body));
  }

  async listPQR(params:string) {
    return await this.authService.get(this.basicEndpoint + `/filtro?${params}`);
  }

  async listEstadosAcciones(entidad: number, idEstado: number = 0, activo: number = 1) {
    return await this.authService.get(this.basicEndpoint + `/obtener-estado?idEntidad=${entidad}&idAccion=${idEstado}&activo=${activo}`);
  }

  async listarPerfiles() {
    return await this.authService.get(`${this.basicEndpoint}/list-perfiles`);
  }
  async listarAcciones() {
    return await this.authService.get(`${this.basicEndpoint}/list-parametros`);
  }
  async listarEstados() {
    return await this.authService.get(`${this.basicEndpoint}/list-estados`);
  }

  async listarRelacionesPerfil() {
    return await this.authService.get(`${this.basicEndpoint}/perfiles/acciones-estados`);
  }

  async actualizarPerfilesEstAcc(body) {
    return await this.authService.put(`${this.basicEndpoint}/update/accion-estados`, body, 'application/json')
  }
  async actualizarAccion(body: any) {
    return await this.authService.put(`${this.basicEndpoint}/update/relacion-accion-estado`, body);
  }
  
  async responderPQR(body:any) {
    return await this.authService.put(this.basicEndpoint + "/respuesta", JSON.stringify(body));
  }
  
  async getRespuestaPQR(urlParams:string) {
    return await this.authService.get(this.basicEndpoint + "/respuesta/" + urlParams);
  }

  async getTipoDocumento() {
    return this.authService.get(this.utilsService.getBasicEndPoint("masters/identification-types"));
  }
  
  async getTipoPqr() {
    return this.authService.get(this.basicEndpoint + "/list/tipo");
  }
  
  async getMotivoPqr() {
    return this.authService.get(this.basicEndpoint + "/list/motivo");
  }

  async getMedioRecepcionPqr() {
    return this.authService.get(this.basicEndpoint + "/list/medio-recepcion");
  }

  async getGrupoCausalPqr() {
    return this.authService.get(this.basicEndpoint + "/list/grupocausal");
  }

  async getPassengerByDoc(document:number) {
    return this.authService.get(this.utilsService.getBasicEndPoint("") + "passengers/search?identi=" + document);
  }
  
  async getResponsablesPqr() {
    return this.authService.get(this.basicEndpoint + "/list/responsables");
  }

  async getEstadoFromAccion(urlParams:string) {
    return this.authService.get(this.basicEndpoint + "/obtener-estado?" + urlParams);
  }
  
  async getAccionesFromPerfil(urlParams:string) {
    return this.authService.get(this.basicEndpoint + "/acciones-autorizadas?" + urlParams);
  }
  
  async getEstadosPqrVisiblesFromPerfil(urlParams:string) {
    return this.authService.get(this.basicEndpoint + "/perfiles-estados?" + urlParams);
  }
  
  async getHistorialAcciones(urlParams:string) {
    return this.authService.get(this.basicEndpoint + "/list/acciones?" + urlParams);
  }
  
  getArchivosPqr(urlParams:string) {
    return this.authService.get(this.basicEndpoint + "/file/list-all?" + urlParams);
  }

  async subirArchivoPqr(urlParams:string, formData:FormData) {
    return this.authService.post(this.basicEndpoint + "/file/upload?" + urlParams, formData, "multipart/form-data");
  }

  enviarEmail(correo:string, asunto:string, mensaje:string) {
    let body = {
      "subject": asunto,
      "email": correo,
      "message": mensaje,
    };
    return this.authService.post(this.basicEndpoint + "/send-email", JSON.stringify(body)); 
  }

  getInfoUsuarioById(idUsuario:number) {
    return this.authService.get(this.utilsService.getBasicEndPoint("") + "users/info?id=" + idUsuario);
  }
  
  // ----------------------- acciones sobre las pqr -----------------------
  
  async ejecutarAccion(actionName:string, urlParams:string= "", body={}) {
    let path = "";

    switch (actionName) {
        case "rechazarPqr":
          path = "/rechazar?";
          break;
        case "asignarAbogado":
          path = "/asignar-responsable?";
          break;
        case "enviarANotificacion":
          path = "/enviar-notificacion?";
          break;
        case "citarUsuario":
          path = "/citar-usuario?";
          break;
        case "notificarUsuario":
          path = "/notificar?";
          break;
        case "notificarUsuarioPorAviso":
          path = "/notificar-aviso?";
          break;
        case "notificarUsuarioPorCorreo":
          path = "/notificar-correo?";
          break;
        case "notificarUsuarioProrroga":
          path = "/update/prorroga";
          break;
        case "cerrarPqr":
          path = "/cerrar?";
          break;

        default:
          path = "";
    }
    return this.authService.put(this.basicEndpoint + path + urlParams, body);
  }


  crearTipoPqr(body) {
    return this.authService.post(this.basicEndpoint + "/create/tipo", JSON.stringify(body));
  }


  actualizarTipoPqr(body) {
    return this.authService.put(this.basicEndpoint + "/update/tipo", JSON.stringify(body));
  }
  
  eliminarTipoPqr(id) {
    return this.authService.delete(this.basicEndpoint + `/delete/tipo/${id}`);
  }
  
  
  crearMotivoPqr(body) {
    return this.authService.post(this.basicEndpoint + "/create/motivo", JSON.stringify(body));
  }
  
  actualizarMotivoPqr(body) {
    return this.authService.put(this.basicEndpoint + "/update/motivo", JSON.stringify(body));
  }
  
  eliminarMotivoPqr(id) {
    return this.authService.delete(this.basicEndpoint + `/delete/motivo/${id}`);
  }

  getAllCompanies(urlParams:string) {
    return this.authService.get(this.utilsService.getBasicEndPoint("") + `companies?${urlParams}`);
  }


  actualizarEstadoPqr(urlParams:string) {
    return this.authService.put(this.basicEndpoint + `/update/descripcion/estados?${urlParams}`, {});
  }

}
