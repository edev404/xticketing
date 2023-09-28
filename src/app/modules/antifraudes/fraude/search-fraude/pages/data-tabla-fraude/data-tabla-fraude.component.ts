import { Component, Input, OnInit } from '@angular/core';

// Services
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { FraudesService } from '../../services/fraudes.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

// Interfaces
import { ResponseSearchFraudes } from '../../../interfaces/fraude.interfaces';
import { UsuariosFraude } from '../../interfaces/search-fraude.interfaces';
import { TipoLista } from '../../../../antifraude/search-controls/interfaces/lists-controls.interfaces';

@Component({
  selector: 'app-data-tabla-fraude',
  templateUrl: './data-tabla-fraude.component.html',
  styleUrls: ['./data-tabla-fraude.component.scss']
})
export class DataTablaFraudeComponent implements OnInit {

  /** Objeto para mostrar en la tabla */
  @Input() fraudesData: ResponseSearchFraudes = { fraudes: [], grupos: [] };
  
  // Lista de usuarios
  users: UsuariosFraude[] = [];

  // Tipos de prioridad
  tpPrioridad: TipoLista[] = [];

  constructor(private _api: AuthServiceService,
              private fraudesService: FraudesService,
              private utils: UtilsService) { }

  ngOnInit(): void {
    this.loadListasTipos();
    this.loadUsers();
  }

  /**
   * Obtener listas tipos
   */
  async loadListasTipos(): Promise<void> {
    this.tpPrioridad  = await this._api.getLista('CRITICA_ANTIFRAUDE');
  }

  /** Cargar usuarios para asignar fraudes */
  async loadUsers() {
    this.users = [];
    const responseData = await this.fraudesService.getListUsersFraude(`${this.utils.getBasicEndPoint(`users/list-fraude`)}`);
    if (responseData.status === this.utils.successMessage) {
      this.users = responseData.data.usuarios;
    } else if (responseData.show) {
      await this.utils.openErrorAlert(responseData.message);
    }
  }
}
