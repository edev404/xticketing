import { Injectable } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { SearchControl } from '../interfaces/search-controles.interfaces';

@Injectable({
  providedIn: 'root'
})
export class SearchControlesService {

  constructor(private _api: AuthServiceService, private utils: UtilsService) { }

  /** Filtros de controles basicos y avanzados  */
  async getFiltroControles(data: SearchControl): Promise<any> {
    data.accion_resultante = data.accion_resultante.replace(/%/g, '%25').replace(/#/g, '%23');
    data.causa             = data.causa            .replace(/%/g, '%25').replace(/#/g, '%23');
    data.accion_eje        = data.accion_eje       .replace(/%/g, '%25').replace(/#/g, '%23');
    return this._api.get(this.utils.getBasicEndPoint(`controles/filtro?estado=${data.estado}&codigo=${data.codigo}&control=${data.control}&tipo_control=${data.tipo_control}&componente=${data.componente}&descripcion=${data.descripcion}&criticidad=${data.criticidad}&fuente=${data.fuente}&deteccion=${data.deteccion}&accion_resultante=${data.accion_resultante}&empresa=${data.empresa}&servicio=${data.servicio}&activo=${data.activo}&serviceac=${data.serviceac}&empreac=${data.empreac}&causa=${data.causa}&accion_eje=${data.accion_eje}&fecha_ini=${data.fecha_ini}&fecha_fin=${data.fecha_fin}`));
  }

  /** Obtener el detalle del control (servicios, empresas y trazabilidad) */
  async getDetailFindById(idControl: number): Promise<any> {
    return this._api.get(this.utils.getBasicEndPoint(`controles/all/${idControl}`));
  }

}
