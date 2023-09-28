import { Injectable } from '@angular/core';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { IAuthAntifraude } from '../interfaces/authAntifraude.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthAntifraudeService {

  /* Variable BehaviorSubject para activar módulo antifraude */
  public antifraudeSubject$ = new BehaviorSubject<boolean>(false);

  /* Variable observable de antifraudeSubject$ */
  antifraudeSubjectBehavior = this.antifraudeSubject$.asObservable();

  constructor(private _api: AuthServiceService) { }

  public async authenticateUserSecondPassword(data: IAuthAntifraude) {
    return await this._api.post(`${environment.api}users/session/antifraude`, this._api.getParams(data));
  }

  public async restorePassword(data){
    return await this._api.put(`${environment.api}users/actualizar/contrasena`, this._api.getParams(data));
  }

}
