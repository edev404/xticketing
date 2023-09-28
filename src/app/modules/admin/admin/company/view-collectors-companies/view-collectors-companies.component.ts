import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { Router } from '@angular/router';
import { CompanyService } from '../service/company.service';
import { TypeCompany } from '../models/models';

@Component({
  selector: 'app-view-collectors-companies',
  templateUrl: './view-collectors-companies.component.html',
  styleUrls: ['./view-collectors-companies.component.scss']
})
export class ViewCollectorsCompaniesComponent implements OnInit {

  listOfData: any[] = [];
  listDataSucurasles: any[] = [];
  typeCompanies!: TypeCompany[];

  isCreate: boolean = false;
  isEdit!: boolean;
  isVisible: boolean = false
  idCompany!: number | null;
  a: any;
  companiesType = 2;

  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  pageMain: number = 1;
  numberRowMain: number = 5;

  pageModal: number = 1;
  numberRowModal: number = 5;

  // PATH APIS
  pathCompanies = 'companies';
  OFFICES_PATH = 'offices';
  pathTypeCompany = 'processType';
  tipoDeEmpresa: number = 0;

  constructor(
    private api: CompanyService,
    private utils: UtilsService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.loadCompanies();
    await this.loadTypesCompanies();
  }

  onChangeRowPerPage(event: number, type: string): void {
    switch (type) {
      case 'main':
        this.numberRowMain = event;
        this.pageMain = 1;
        break;
      case 'modal':
        this.numberRowModal = event;
        this.pageModal = 1;
        break;
    }
  }

  onChangePage(event: number, type: string): void {
    switch (type) {
      case 'main':
        this.pageMain = event;
        break;
      case 'modal':
        this.pageModal = event;
        break;
    }
  }

  async changeStateCompany(data) {
    const response = await this.api.changeStateCompany(this.utils.getBasicEndPoint(`${this.pathCompanies}/${data.id}/change-state`), !data.state);
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(response.message);
      await this.loadCompanies();
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async CreateOrEdit(id, value, tipo?) {
    if (!value) await this.loadCompanies();
    if (id) {
      this.isCreate = value
      this.isEdit = true;
      this.idCompany = id
      this.tipoDeEmpresa = tipo;
      return;
    }
    this.isCreate = value
    this.idCompany = null;
    this.isEdit = false;
    this.tipoDeEmpresa = tipo;
    this.isVisible = false;
  }

  async loadCompanies() {
    const resp = await this.api.getCompanies(this.utils.getBasicEndPoint(`${this.pathCompanies}/?type-id=${this.companiesType}`));
    if (resp.status === this.utils.successMessage) {
      let data = resp.data.companies;
      let companies: Array<any> = [];
      for (let i = 0; i < data.length; i++) {
        let d = data[i];
        companies.push({ ...d, ...d.client });
      }
      this.listOfData = companies;
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async viewAllOffices(companyId) {
    const resp = await this.api.list(this.utils.getBasicEndPoint(`${this.OFFICES_PATH}?companyId=${companyId}`));
    if (resp.status === this.utils.successMessage) {
      this.listDataSucurasles = resp.data.offices;
      this.isVisible = true;
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async loadTypesCompanies() {
    const response = await this.api.findAllTypesCompanies(this.utils.getBasicEndPoint(`${this.pathTypeCompany}`));
    if (response.status === this.utils.successMessage) {
      const typesCompanies = response.data.tipoProceso;
      this.typeCompanies = typesCompanies.filter(typeCompany => typeCompany.id != 1);
      this.typeCompanies.sort((a, b) => {
        const nameA = a.description.toLowerCase();
        const nameB = b.description.toLowerCase();
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      });
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

}
