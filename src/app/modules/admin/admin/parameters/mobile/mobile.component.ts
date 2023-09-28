import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { IMobileForm } from './models/models';
import { ParametersService } from '../service/parameters.service';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit {
  mobileForm!: IMobileForm;

  entityId!: number;
  timeUnity: any[] = [
    { key: 'Segundos', value: 'second' },
    { key: 'Minutos', value: 'min' },
    { key: 'Horas', value: 'hour' },
    { key: 'Dias', value: 'day' },
    { key: 'Mes', value: 'month' },
    { key: 'Años', value: 'year' }
  ];

  // UTILS SERVICES
  PATH = 'parameters';

  constructor(
    private api: ParametersService,
    public utils: UtilsService
  ) { this.generateObjectForm(); }

  async ngOnInit() {
    await this.loadData();
  }

  numbers(i: number) {
    return new Array(i);
  }

  generateObjectForm() {
    this.mobileForm = {};
  }

  async loadData() {
    const response = await this.api.getMobileConfigAdmin(this.utils.getBasicEndPoint(`${this.PATH}/parametersWallet`));
    if (response.status === this.utils.successMessage) {
      if (response.data.service) {
        this.mobileForm = response.data.service;
      }
    } else {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async saveData() {
    let response;
    if (this.mobileForm.id) {
      response = await this.api.updateMobileConfigAdmin(this.utils.getBasicEndPoint(`${this.PATH}/${this.mobileForm.id}`), JSON.stringify(this.mobileForm));
    } else {
      response = await this.api.createMobileConfigAdmin(this.utils.getBasicEndPoint(`${this.PATH}`), JSON.stringify(this.mobileForm));
    }
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(this.mobileForm.id ? 'Párametros móvil actualizados correctamente. Los cambios se verán actualizados en 24 horas' : 'Párametros móvil creados correctamente.');
      await this.loadData();
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

}
