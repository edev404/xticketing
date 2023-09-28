import { Injectable } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { SearchFraude } from '../interfaces/search-fraude.interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchFraudeService {

  /* Variable BehaviorSubject para emitir valor cuando se necesite refrescar data de fraudes */
  public refreshFraudesSubject$ = new BehaviorSubject<boolean>(false);

  /* Variable observable de refreshFraudesSubject$ */
  refreshFraudesSubjectBehavior = this.refreshFraudesSubject$.asObservable();

  constructor(private _api: AuthServiceService, private utils: UtilsService) { }

  async getFiltroFraudes(data: SearchFraude): Promise<any> {
    return this._api.get(this.utils.getBasicEndPoint(`fraude/list?tipo_fraude=${data.tipo_fraude}&fuente=${data.fuente}&impacto=${data.impacto}&componente=${data.componente}&fecha_ini_re=${data.fecha_ini_re}&fecha_fin_re=${data.fecha_fin_re}&fecha_ini_ocu=${data.fecha_ini_ocu}&fecha_fin_ocu=${data.fecha_fin_ocu}&id=${data.id}&riesgo=${data.riesgo}&descripcion=${data.descripcion}&empresa=${data.empresa}&servicio=${data.servicio}&usuario=${data.usuario}`));
  }

}
