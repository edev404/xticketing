import { Component, Input, OnInit } from '@angular/core';
import { IPassenger } from 'src/app/modules/clientes/models/passenger';
import { PassengerAdminApiService } from 'src/app/modules/clientes/service/passenger.admin.api.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {

  @Input() client: any;

  passenger!: IPassenger;

  // MASTERS COMBO
  profileCombo;
  comboCompanies;
  comboNit;
  maritalStatesCombo;
  genderChecks;
  countryCombo;
  departmentResidenceCombo;
  cityResidenceCombo;
  departmentBornCombo;
  cityBornCombo;

  constructor(
    public utils: UtilsService,
    private api: PassengerAdminApiService,
  ) {}

  ngOnInit() {
    this.loadProfileAccounts();
    this.loadCompaniesCombo();
    this.loadIdentificationCombo();
    this.loadMaritalStateCombo();
    this.loadGenders();
    this.loadLocationCombos();
    if (this.client) {
      this.passenger = this.client;
      this.loadPassengerDetail(this.passenger);
    }
  }

  async loadProfileAccounts() {
    const response = await this.api.getList(this.utils.getBasicEndPoint(`clientprofile/clientProfileAll`));
    if (response && response.status === this.utils.successMessage) {
      this.profileCombo = response.data.service;
    }
  }

  async loadCompaniesCombo() {
    const entity = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (entity) {
      const idEntity = entity.entities[0].id;
      const response = await this.api.getList(this.utils.getBasicEndPoint(`users/${idEntity}/companies`));
      if (response && response.status === this.utils.successMessage) {
        this.comboCompanies = response.data.companies;
      }
    }
  }

  async loadIdentificationCombo() {
    const response = await this.api.getIdentificationTypes(this.utils.getBasicEndPoint(`masters/identification-types`));
    if (response && response.status === this.utils.successMessage) {
      this.comboNit = response.data.identificationTypes;
    }
  }

  async loadMaritalStateCombo() {
    const response = await this.api.getMaritalState(this.utils.getBasicEndPoint(`masters/marital-states`));
    if (response && response.status === this.utils.successMessage) {
      this.maritalStatesCombo = response.data.maritalStates;
    }
  }

  async loadGenders() {
    const response = await this.api.getGenders(this.utils.getBasicEndPoint(`masters/genders`));
    if (response && response.status === this.utils.successMessage) {
      this.genderChecks = response.data.genders;
    }
  }

  async loadLocationCombos() {
    const response = await this.api.getCountries(this.utils.getBasicEndPoint('masters/countries'));
    if (response && response.status === this.utils.successMessage) {
      this.countryCombo = response.data.countries;
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async loadPassengerDetail(passenger: IPassenger) {
    if (passenger.residenceLocation!.country.id) {
      await this.loadDepartmentCombo(passenger.residenceLocation!.country.id, 'residence');
      await this.loadCityCombo(passenger.residenceLocation!.department.id, 'residence');
    }
    if (passenger.bornLocation!.country.id) {
      await this.loadDepartmentCombo(passenger.bornLocation!.country.id, 'born');
      await this.loadCityCombo(passenger.bornLocation!.department.id, 'born');
    }
  }

  async loadDepartmentCombo(value, type) {
    const response = await this.api.getDepartments(
      this.utils.getBasicEndPoint(`masters/departments?countryId=${value}`)
    );
    if (response.status === this.utils.successMessage) {
      if (type === 'born') {
        this.departmentBornCombo = response.data.departments;
      } else {
        this.departmentResidenceCombo = response.data.departments;
      }
    }
  }

  async loadCityCombo(value, type) {
    const response = await this.api.getCities(
      this.utils.getBasicEndPoint(`masters/cities?departmentId=${value}`)
    );
    if (response.status === this.utils.successMessage) {
      if (type === 'born') {
        this.cityBornCombo = response.data.cities;
      } else {
        this.cityResidenceCombo = response.data.cities;
      }
    }
  }

}
