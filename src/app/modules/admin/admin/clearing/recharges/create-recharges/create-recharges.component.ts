import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { Recharge, RechargeInvolved } from '../../models/models';
import { CompanyService } from '../../../company/service/company.service';
import { ClearingAdminService } from '../../service/clearingAdmin.service';

@Component({
  selector: 'app-create-recharges',
  templateUrl: './create-recharges.component.html',
  styleUrls: ['./create-recharges.component.scss']
})
export class CreateRechargesComponent implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() rechargeId;
  @Output() CreateOrEdit = new EventEmitter<any>();

  recharge: Recharge = {};
  collectorSelected: RechargeInvolved = {};
  collectorSelectedCB;
  currentDate

  isEditCollector: boolean = false; 
  cities!: any[];
  collectors!: any[];
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  formInvalid = {
    codeInvalid: false,
    nameInvalid: false,
    cityInvalid: false,
  }


  page: number = 1;
  numberRow: number = 5;

  PATH = 'recharges';
  CITIES_PATH = 'masters/cities';
  PATH_COMPANIES = 'companies';

  constructor(
    private api: ClearingAdminService,
    private Company_api: CompanyService,
    public utils: UtilsService,
  ) { }

  async ngOnInit() {
    await this.loadCollectorCompanies();
    await this.loadCities();
    if (this.rechargeId) {
      await this.loadRecharge();
    } else {
      this.recharge = {rechargeCollectors: []};
      this.recharge.cityId = undefined;
      this.collectorSelected.validityStartDate = null;
      this.collectorSelected.validityEndDate = null;
    }
  }

  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

  cancelCompany(){
    this.CreateOrEdit.emit(false);
  }

  clearForm() {
    this.recharge = {rechargeCollectors: []};
    this.recharge.cityId = undefined;
    this.collectorSelected = {};
    this.collectorSelected.validityStartDate = this.currentDate;
    this.collectorSelected.validityEndDate = this.currentDate;
  }

  editRechargeCollector(data: RechargeInvolved) {
    const collectors = this.collectors.find(e => e.id == data.collectorId);
    this.collectorSelectedCB = collectors;
    this.collectorSelected.percentage = data.percentage;
    this.collectorSelected.collectorId = collectors.id;
    this.collectorSelected.collectorName = collectors.name;
    this.collectorSelected.validityStartDate = data.validityStartDate;
    this.collectorSelected.validityEndDate = data.validityEndDate;
    this.isEditCollector = true;

    data.percentage = this.collectorSelected.percentage;
  }

  async changeStateModal(collector: RechargeInvolved) {
    this.recharge.rechargeCollectors!.find(e => e.collectorId == collector.collectorId)!.status = !collector.status ;
    this.utils.openSuccessAlert('¡Estado cambiado correctamente!');
  }

  async loadCities() {
    const response = await this.api.getCities(this.utils.getBasicEndPoint(`${this.CITIES_PATH}`));
    if (response.status === this.utils.successMessage) {
      this.cities = response.data.cities;
    } else if (response.showAlert){
      await this.utils.openErrorAlert(response.message);
    }
  }

  async addCollector() {
    if (!this.collectorSelectedCB) {
      await this.utils.openInfoAlert('¡Seleccione un ente recaudador!');
      return;
    }
    if (!this.collectorSelected.percentage || (this.collectorSelected.percentage && (Number(this.collectorSelected.percentage) <= 0 || Number(this.collectorSelected.percentage) > 100))) {
      await this.utils.openInfoAlert('¡Ingrese un porcentaje valido!');
      return;
    }
    if ((!this.collectorSelected.validityStartDate || !this.collectorSelected.validityEndDate) || (this.utils.isTheDateFromAfter(new Date(this.collectorSelected.validityStartDate), new Date(this.collectorSelected.validityEndDate)))) {
      await this.utils.openInfoAlert('¡Ingrese una fecha valida!');
      return;
    }    
    
    this.collectorSelected.collectorId = this.collectorSelectedCB.id;
    this.collectorSelected.collectorName = this.collectorSelectedCB.name;

    const result = this.recharge.rechargeCollectors!.filter(value => value.collectorId === this.collectorSelected.collectorId);
    if (result && result.length > 0 && !this.isEditCollector) {
      await this.utils.openErrorAlert('¡Él entre recaudador ya se encuentra configurado!');
      return;
    }

    this.collectorSelected.percentage = Number(this.collectorSelected.percentage);
    
    let indice = this.recharge.rechargeCollectors!.findIndex(obj => obj.collectorId === this.collectorSelected.collectorId);
    if (indice !== -1) {
      this.recharge.rechargeCollectors![indice] = this.collectorSelected;
    } else {
      this.recharge.rechargeCollectors!.push(this.collectorSelected);
    }

    this.recharge.rechargeCollectors = [...this.recharge.rechargeCollectors!];
    
    this.collectorSelected = {};
    this.collectorSelectedCB = undefined;
    this.collectorSelected.validityStartDate = this.currentDate;
    this.collectorSelected.validityEndDate = this.currentDate;
  }

  async saveData() {
    if (!this.recharge.code && !this.recharge.name && !this.recharge.cityId) {
      this.formInvalid.codeInvalid = true;
      this.formInvalid.nameInvalid = true;
      this.formInvalid.cityInvalid = true;
      return;
    }

    if (!this.recharge.rechargeCollectors || (this.recharge.rechargeCollectors && this.recharge.rechargeCollectors.length <= 0)) {
      await this.utils.openErrorAlert('¡Debe agregar al menos un ente recaudador!');
      return;
    }

    let response;
    if (this.rechargeId) {
      response = await this.api.update(this.utils.getBasicEndPoint(`${this.PATH}/${this.rechargeId}`), JSON.stringify(this.recharge));
    } else {
      response = await this.api.create(this.utils.getBasicEndPoint(this.PATH), JSON.stringify(this.recharge));
    }
    if (response.status === this.utils.successMessage) {
      this.clearForm();
      await this.utils.openSuccessAlert(this.rechargeId ? '¡Configuración editada correctamente!' : '¡Configuración creada correctamente!').then(()=>{
        this.CreateOrEdit.emit(false);
      })
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async loadCollectorCompanies() {
    const response = await this.Company_api.getCompanies(this.utils.getBasicEndPoint(`${this.PATH_COMPANIES}/?type-id=${2}`));
    if (response.status === this.utils.successMessage) {
      this.collectors = response.data.companies;
    } else if (response.showAlert){
      await this.utils.openErrorAlert(response.message)
    }
  }

  async loadRecharge(){
    const resp = await this.api.findById(this.utils.getBasicEndPoint(`${this.PATH}/${this.rechargeId}`));
    if (resp && resp.status === this.utils.successMessage) {
      this.recharge = resp.data.recharge;
    } else if (resp.showAlert){
      await this.utils.openErrorAlert(resp.message);
    }
  }

}
