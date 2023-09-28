import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { LoginServiceService } from 'src/app/serivces/login-service/login-service.service';
import { ClearingDataPassages, CollectsClearingPassages, DetailsClearingPassages, PresettlementFilter } from '../../clearing/models/models';
import { DatePipe } from '@angular/common';
import { ClearingServiceService } from '../../clearing/services/clearing-service.service';

@Component({
  selector: 'app-create-recharge',
  templateUrl: './create-recharge.component.html',
  styleUrls: ['./create-recharge.component.scss']
})
export class CreateRechargeComponent implements OnInit {
  @Output() switchPanel = new EventEmitter<any>();

  validateForm!: FormGroup;
  pressettlementFilter: PresettlementFilter = {};

  baseList: any[] = [
    { id: 1, name: 'Recargas', code: 'recharge' }
  ];
  cities!: any[];
  collectors!: any[];
  percentageSetting!: any[];
  rangoMes: Date[] = [];
  datePlaceholder: any = ['Desde', 'Hasta'];

  detailsSearch: any;

  clearingId;

  showFilter: boolean = true;
  baseFilter!: string;

  CITIES_PATH = 'masters/cities';
  PATH_COMPANIES = 'companies';
  PATH_RECHARGE = 'recharges';
  PATH_TICKETS = 'tickets';
  PATH_CLEARING = 'clearing';

  constructor(
    private fb: FormBuilder,
    public util: UtilsService,
    public api: ClearingServiceService,
  ) { 
    this.validateForm = this.fb.group({
      mountAndYear: [null, [Validators.required]],
      dateRange: [null, [Validators.required]],
      base: [null, [Validators.required]],
      city: [null, [Validators.required]],
      configuration: [null, [Validators.required]],     
      company: [null, [Validators.required]]
    });
  }

  async ngOnInit() {
    await this.loadCities();
    this.validateForm.controls['base'].setValue(this.baseList[0].code);
    // this.validateForm.controls['base'].disable();
  }

  obtenerRangoMes() {
    const año = this.validateForm.value.mountAndYear.getFullYear();
    const mes = this.validateForm.value.mountAndYear.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    this.validateForm.controls['dateRange'].setValue([primerDia, ultimoDia]);
  }

  cancelCompany(){
    this.switchPanel.emit(false);
  }

  createObj(pojo: any) {
    this.pressettlementFilter.monthYear = this.util.formatDateMount(pojo.mountAndYear);
    this.pressettlementFilter.fromDate = this.util.formatDate(pojo.dateRange[0]);
    this.pressettlementFilter.toDate = this.util.formatDate(pojo.dateRange[1]);
    this.pressettlementFilter.city = pojo.city;
    this.pressettlementFilter.percentageSetting = pojo.configuration;
    this.pressettlementFilter.company = pojo.company;
    this.pressettlementFilter.base = pojo.base;
  }

  async changeBase(data) {
    if (data === 'recharge') {
      await this.loadCollectors();
      this.baseFilter = 'recharge';
    } else {
      this.baseFilter = 'passage';
      await this.loadCompanies();
    }
    await this.loadPercentageSetting();
  }

  async loadCollectors() {
    const response = await this.api.getCompanies(this.util.getBasicEndPoint(`${this.PATH_COMPANIES}/?type-id=${2}`));
    if (response.status === this.util.successMessage) {
      this.collectors = response.data.companies;
    } else if (response.showAlert){
      await this.util.openErrorAlert(response.message);
    }
  }

  async loadCompanies() {
    const companies = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (companies) {
      this.collectors = companies.companies.filter(
        (company: any) => company.active && company.typeId == 1
      );
    }
  }

  async loadCities() {
    const response = await this.api.getCities(this.util.getBasicEndPoint(`${this.CITIES_PATH}`));
    if (response.status === this.util.successMessage) {
      this.cities = response.data.cities;
    } else if (response.showAlert){
      await this.util.openErrorAlert(response.message);
    }
  }

  async loadPercentageSetting() {
    let form = this.validateForm;
    let response;
    if (!form.value.city) return;
    if ( form.value.base === 'recharge') {
      response = await this.api.findAll(this.util.getBasicEndPoint(`${this.PATH_RECHARGE}?cityId=${form.value.city}`));
      if (response.status === this.util.successMessage) {
        this.percentageSetting = response.data.recharges;
      } else if (response.showAlert) {
        await this.util.openErrorAlert(response.message);
      }
    } else {
      response = await this.api.findAll(this.util.getBasicEndPoint(`${this.PATH_TICKETS}?cityId=${form.value.city}`));
      if (response.status === this.util.successMessage) {
        this.percentageSetting = response.data.tickets;
      } else if (response.showAlert){
        await this.util.openErrorAlert(response.message);
      }
    }
  }

  async submit() {
    let form = this.validateForm; 
    let response;
    this.validateForm.controls['base'].enable();

    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }

    this.createObj(form.value);
    if (form.value.dateRange[0] > form.value.dateRange[1]) {
      await this.util.openInfoAlert('Fechas desde no puede ser mayor a la fecha hasta');
      return;
    }
    
    if (!this.pressettlementFilter.company) {
      await this.util.openInfoAlert('Por favor seleccione una empresa');
      return;
    }

    if (form.value.base === 'recharge') {
      response = await this.api.findRechargeDetails(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_RECHARGE}/details?startDate=${this.pressettlementFilter.fromDate}&endDate=${this.pressettlementFilter.toDate}&configId=${this.pressettlementFilter.percentageSetting}&companyId=${this.pressettlementFilter.company.id}`));
      if (response.status === this.util.successMessage) {
        if (this.util.isEmptyList(response.data.branchOffices) || (!response.data.detail)) {
          await this.util.openInfoAlert('No se encontraron datos para mostrar');
          return;
        }
        this.detailsSearch = response.data;
        this.detailsSearch.filter = this.pressettlementFilter;
        
        this.showFilter = false;
      } else if (response.showAlert){
        await this.util.openErrorAlert(response.message);
      }
    } else {
      const dataClearingPassages: ClearingDataPassages = {};
      // Consulta para distribucion
      response = await this.api.findDistributionDetails(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/distribution?startDate=${this.pressettlementFilter.fromDate}&endDate=${this.pressettlementFilter.toDate}&configId=${this.pressettlementFilter.percentageSetting}&companyId=${this.pressettlementFilter.company.id}`));
      if (response.status === this.util.successMessage) {
        dataClearingPassages.distributions = response.data.distributions;
      } else if (response.showAlert) {
        await this.util.openErrorAlert(response.message);
        return;
      }
      // Consulta para pasajes
      response = await this.api.findCollectsTickets(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/collects?startDate=${this.pressettlementFilter.fromDate}&endDate=${this.pressettlementFilter.toDate}&companyId=${this.pressettlementFilter.company.id}`));
      if (response.status === this.util.successMessage) {
        const collectsClearingPassages: CollectsClearingPassages[] = response.data.collects;
        dataClearingPassages.collect = {collects: collectsClearingPassages};
      } else if (response.showAlert){
        await this.util.openErrorAlert(response.showAlert);
        return;
      }
      // Consulta para detalles
      response = await this.api.findCollectsTickets(this.util.getClearingEndPoint(`${this.PATH_CLEARING}/${this.PATH_TICKETS}/details?startDate=${this.pressettlementFilter.fromDate}&endDate=${this.pressettlementFilter.toDate}&companyId=${this.pressettlementFilter.company.id}`));
      if (response.status === this.util.successMessage) {
        const detailsClearingPassages: DetailsClearingPassages[] = response.data.details;
        dataClearingPassages.detail = {details: detailsClearingPassages};
      } else if (response.showAlert){
        await this.util.openErrorAlert(response.showAlert);
        return;
      }

      if (this.util.isEmptyList(dataClearingPassages.detail!.details!) || (this.util.isEmptyList(dataClearingPassages.collect!.collects!)) || (this.util.isEmptyList(dataClearingPassages.distributions!))) {
        await this.util.openErrorAlert('No hay resultados que coincidan con la búsqueda.');
        return;
      }

      this.detailsSearch = dataClearingPassages;
      this.showFilter = false;
    }
  }

}
