import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { GeneralForm } from '../models/models';
import { ParametersService } from '../service/parameters.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  generalForm!: GeneralForm;

  timeUnity: any[] = [
    {key: 'Minutos', value: 'min'},
    {key: 'Horas', value: 'hour'},
    {key: 'Dias', value: 'day'},
    {key: 'Mes', value: 'month'},
    {key: 'Años', value: 'year'},
  ];

  collectTypesList;
  collectPassengersCantList;
  isOpen:boolean = true;

  PATH = 'companies';
  COLLECT_TYPE_PATH = 'masters/collect-types';
  COLLECT_PASSENGER_PATH = 'masters/collect-passengers-cant';

  constructor(
    private api: ParametersService,
    public utils: UtilsService
  ) { this.generateObjectForm(); }

  async ngOnInit() {
    // await this.loadCollectTypes();
    // await this.loadCollectPassengersCant();
    await this.loadData();
  }

  generateObjectForm() {
    this.generalForm = new GeneralForm(
      '',
      '',
      '',
      null,
      undefined,
      undefined,
      1,
      1,
      100,
      1,
      false,
      1,
      1,
      1
    );
  }

  async saveData() {
    if (this.generalForm.transferNumber == '') this.generalForm.transferNumber = '0';
    let entity = this.utils.getSelectedEntity();
    if (entity) {
      const response = await this.api.updateGeneralConfigAdmin( JSON.stringify(this.generalForm), this.utils.getBasicEndPoint(`${this.PATH}/${entity}/config`));
      if (response.status === this.utils.successMessage) {
        await this.utils.openSuccessAlert('Datos guardados correctamente');
        await this.loadData();
        location.reload();
      } else if (response.showAlert) {
        await this.utils.openErrorAlert(response.message);
      }
    }
  }

  async loadData() {
    let entity = this.utils.getSelectedEntity();
    if (entity) {
      const response = await this.api.getGeneralConfigAdmin(this.utils.getBasicEndPoint(`${this.PATH}/${entity}/config`));
      if (response.status === this.utils.successMessage) {
        let data = response.data.config;
        this.generalForm = new GeneralForm(
          data.transferNumber == 0 ? '' : data.transferNumber,
          data.minimunBalance == 0 ? '' : data.minimunBalance,
          data.inactivityTime == 0 ? '' : data.inactivityTime,
          data.inactivityTimeUnity == 0 ? '' : data.inactivityTimeUnity,
          data.minQuantityCardByLot ? data.minQuantityCardByLot : undefined,
          data.maxQuantityCardByLot ? data.maxQuantityCardByLot : undefined,
          data.collectTypeId ? data.collectTypeId : 1,
          data.collectPassengersCantId ? data.collectPassengersCantId : 1,
          data.limitDataToDisplay ? data.limitDataToDisplay : 1,
          data.limitTimeSession ? data.limitTimeSession : 1,
          data.allowsCredit ? data.allowsCredit : false,
          data.espera_validador ? data.espera_validador : 1,
          data.tiempo_listas ? data.tiempo_listas : 1,
          data.valor_tarjeta ? data.valor_tarjeta : 1
        );
      } else {
        await this.utils.openErrorAlert(response.message);
      }
    }
    this.isOpen = !this.isOpen;
  }

  async loadCollectTypes() {
    const response = await this.api.getCollectTypes(this.utils.getCollectionEndPoint(this.COLLECT_TYPE_PATH));
    if (response.status === this.utils.successMessage) {
      this.collectTypesList = response.data.collectTypes;
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async loadCollectPassengersCant() {
    const response = await this.api.getCollectPassengersCant(this.utils.getCollectionEndPoint(this.COLLECT_PASSENGER_PATH));
    if (response.status === this.utils.successMessage) {
      this.collectPassengersCantList = response.data.collectPassengersCant;
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

}
