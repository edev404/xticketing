import { Injectable } from '@angular/core';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { FraudeCreate } from '../../interfaces/fraude.interfaces';
import { UtilsService } from '../../../../../myUtils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class FraudeService {

  constructor(private _api: AuthServiceService, private utils: UtilsService) { }

  async getAllFraudes(): Promise<any> {
    return this._api.get(this.utils.getBasicEndPoint(`fraude`));
  }
  
  async getFraudeById(idFraude: string): Promise<any> {
    return this._api.get(this.utils.getBasicEndPoint(`fraude/${idFraude}`));
  }

  async create(data: FraudeCreate): Promise<any> {
    return await this._api.post(this.utils.getBasicEndPoint(`fraude`), data);
  }

  async getAllControlesActivos(): Promise<any> {
    return this._api.get(this.utils.getBasicEndPoint(`controles/list-conactiv`));
  }

  async putChangeControlesActivos(id: number): Promise<any> {
    return await this._api.put(this.utils.getBasicEndPoint(`controles/conactiv/change-status?estado=0&id=${id}`), {});
  }

}
