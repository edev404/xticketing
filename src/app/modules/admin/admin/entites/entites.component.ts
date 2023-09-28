import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManageService } from 'src/app/modules/descuentos/models/modelManager';
import { UtilsService } from 'src/app/myUtils/utils.service';
import Swal from 'sweetalert2';
import { ApiServiceUserAdmin } from '../user/service/user.admin.api';
import { ICompany, IEntitiesConfiguration, IRelationServices, IServicesCompanyToEntity } from './models/entites';
import { EntitesService } from './service/entites.service';

@Component({
  selector: 'app-entites',
  templateUrl: './entites.component.html',
  styleUrls: ['./entites.component.scss']
})
export class EntitesComponent implements OnInit {
  listOfData: any[] = [];
  entityByServicesCompanies: any[] = [];
  entityForm: IEntitiesConfiguration = {};
  formRelationEntity: IRelationServices = {};
  servicesList: ManageService[] = [];
  companiesList: any[] = [];
  validateForm!: FormGroup;
  listOfDataFilter!: Array<any>;
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  page: number = 1;
  numberRow: number = 5;

  filterValue: string = '';
  isCreate: boolean = false;
  isVisible: boolean = false;
  isDisabled: boolean = true;
  isEditConfig!: boolean;
  isEdit!: boolean;
  idEntites!: number | null;
  nameEntites!: string;
  idEntityByedit!: number | undefined;

  // PATH APIS
  entites: string = 'entities';
  pathCompanies = 'companies';
  pathServices = 'services';

  constructor(
    private api: EntitesService,
    public utils: UtilsService,
    private fb: FormBuilder,
  ) {
    this.validateForm = this.fb.group({
      service: [null],
      company: [null],
    });
  }

  async ngOnInit() {
    await this.loadData();
  }

  search(): void {
    let data!: Array<any>;
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.listOfData;
    }
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.listOfDataFilter.filter((current) => {
        return this.utils.validateObject(current.code) && current.code.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.name) && current.name.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.description) && current.description.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.messageInstitutional) && current.messageInstitutional.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.mail) && current.mail.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.phone) && current.phone.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.direction) && current.direction.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.webSite) && current.webSite.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.logo) && current.logo.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.stocktarjetas) && current.stocktarjetas.toString().toUpperCase().includes(this.filterValue.toUpperCase())

      });
      if (data) {
        this.listOfData = data;
      }
    } else {
      if (this.listOfDataFilter) {
        this.listOfData = this.listOfDataFilter;
        this.filterValue = ''
      }
    }
  }

  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

  closeEntityModal() {
    this.entityForm = {};
    this.formRelationEntity = {};
    this.companiesList = [];
    this.entityByServicesCompanies = [];
    this.formRelationEntity.companyItemSelected = [];
    this.validateForm.reset();
    this.isVisible = !this.isVisible;
    this.isEditConfig = false;
  }

  loadElementsByEntity(elements) {
    let arrayList: any[] = [];
    const elementsKey = Object.keys(elements);
    for (let i = 0; i < elementsKey.length; i++) {
      let key = elementsKey[i];
      arrayList.push(` ${elements[key]}`);
    }
    return arrayList.toString();
  }

  cleanFields() {
    this.formRelationEntity = {};
    this.companiesList = [];
  }

  getLabel(item) {
    return JSON.parse(item).name;
  }

  async loadData() {
    // let resp = this.api.getEntities
    this.api.ListEntities().subscribe(
      response => {
        this.listOfData = response.data.entities.sort((a, b) => b.active - a.active);
      }
    );
  }

  async CreateOrEdit(id, value) {
    if (!value) await this.loadData();
    if (id) {
      this.isCreate = value
      this.isEdit = true;
      this.idEntites = id
      return;
    }
    this.isCreate = value
    this.isEdit = false;
    this.idEntites = null;
  }

  async configEntites(data) {
    this.isVisible = true
    this.entityForm = data;
    this.nameEntites = data.name;
    if (this.servicesList.length <= 0 || this.companiesList.length <= 0) {
      await this.loadServices();
    }
    await this.loadEntity(data.id);
    console.log(this.entityByServicesCompanies)
  }

  async loadEntity(id: any) {
    const resp = await this.api.getEntityByRelations(this.utils.getBasicEndPoint(`${this.pathServices}/${id}/findServicesEntity`));
    if (resp.status === this.utils.successMessage) {
      this.entityByServicesCompanies = resp.data.service;
      this.entityByServicesCompanies.forEach((data) => {
        data.namesCompanies = this.loadElementsByEntity(data.dateCompanies.map);
        data.namesServices = this.loadElementsByEntity(data.dateServices.map);
      });
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async addServicesCompanyToEntidad() {
    let form = this.validateForm;
    console.log(this.entityByServicesCompanies)

    if (!form.value.company || !form.value.service) {
      this.utils.openErrorAlert('Seleccione un servicio y una empresa para agregar.');
      return;
    }
    if (this.formRelationEntity.account == null || this.formRelationEntity.account <= 0) {
      this.utils.openErrorAlert('Ingrese una cuenta valida.');
      return;
    }
    if (this.formRelationEntity.account.toString().length >= 20) {
      this.formRelationEntity.account = 0;
      this.utils.openErrorAlert('Longitud máxima de 20 carácteres.');
      return;
    }
    const validateDuplicate = this.entityByServicesCompanies.find(entidad => entidad.idServices == this.formRelationEntity.companyItemSelected![0].id);
    this.formRelationEntity.servicesItemSelected = this.servicesList.filter(e => e.id == form.value.service);

    if (validateDuplicate && !this.isEditConfig) {
      this.cleanFields();
      this.utils.openErrorAlert('El servicio seleccionado ya se encuentra relacionado a esta entidad');
      return;
    }

    const idServices = this.formRelationEntity.servicesItemSelected;
    console.log(this.formRelationEntity.companyItemSelected!.map(company => JSON.parse(company).id).toString());
    const idCompanies = this.formRelationEntity.companyItemSelected!.map(company => JSON.parse(company).id).toString();

    const entityNew: IServicesCompanyToEntity = {
      idEntity: this.entityForm.id,
      idServices: idServices['id'] || this.formRelationEntity.servicesItemSelected[0].id,
      idCompanies: idCompanies,
      account: this.formRelationEntity.account
    }

    let response;
    if (this.idEntityByedit) {
      response = await this.api.updateRelationEntity(this.utils.getBasicEndPoint(`${this.pathServices}/${this.idEntityByedit}/updateServicesEntity`), JSON.stringify(entityNew));
    } else {
      response = await this.api.createRelationEntity(this.utils.getBasicEndPoint(`${this.pathServices}/addServicesEntity`), JSON.stringify(entityNew));
    }
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(this.idEntityByedit ? ' Servicio y Empresas editada con éxito.' : 'Servicio y Empresas agregada con éxito')
      this.loadEntity(this.entityForm.id);
      form.reset();
      this.cleanFields();
      this.idEntityByedit = undefined;
      this.isEdit = false;
      this.isEditConfig = false;
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async editServicesToEntidad(entity: IServicesCompanyToEntity) {
    let form = this.validateForm;

    this.isEditConfig = true;
    this.idEntityByedit = entity.id;
    this.formRelationEntity.account = entity.account;

    let service = this.servicesList.find(e => e.id == entity.idServices);
    form.controls['service'].setValue(service!.id);
    this.formRelationEntity.servicesItemSelected = [service];

    this.onItemSelect(this.formRelationEntity.servicesItemSelected[0]);
    const companies = entity.dateCompanies.map;
    const keys = Object.keys(companies);

    const formattedCompanies = keys.map((key) => {
      const id = parseInt(key);
      const name = companies[key];
      return { id: id, name: name };
    });

    form.controls['company'].setValue(formattedCompanies.map(e => JSON.stringify(e)));
    this.formRelationEntity.companyItemSelected = formattedCompanies.map(e => JSON.stringify(e));
  }

  async removeServicesToEntidad(entityToDeleted: IServicesCompanyToEntity) {
    if (!entityToDeleted) {
      await this.utils.openErrorAlert('Seleccione una entidad para remover.');
      return;
    }
    const response = await this.api.deleteRelationEntity(this.utils.getBasicEndPoint(`${this.pathServices}/${entityToDeleted.id}`));
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('Entidad eliminada con éxito.');
      this.loadEntity(this.entityForm.id);
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async loadServices() {
    const response = await this.api.getServices(this.utils.getBasicEndPoint(`${this.pathServices}/servicesAll`));
    if (response.status === this.utils.successMessage) {
      const services = response.data.service;
      this.servicesList = services.filter((service: ManageService) => service.active === true);
    } else {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async onItemSelect(item: any) {
    this.isDisabled = false;
    this.formRelationEntity.companyItemSelected = [];

    const services = this.servicesList.find(service => service.id == item);
    if (!services) return;

    const resp = await this.api.getServices(this.utils.getBasicEndPoint(`${this.pathCompanies}/?type-id=${services.type_company}`));
    if (resp.status === this.utils.successMessage) {
      this.companiesList = resp.data.companies.filter((company: ICompany) => company.active === true).map((e) => { return JSON.stringify({ id: e.id, name: e.name }) });
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async changeStateModal(data) {
    Swal.fire(this.utils.getQuestionModalOptions('¿Deseas cambiar el estado de esta entidad?',
      `El estado pasará de estar ${data.active ? 'activo a inactivo.' : 'inactivo a activo.'} `)).then(async (result) => {
        if (result.isConfirmed) {
          await this.changeState(data);
        } else {
          await this.loadData();
        }
      });
  }

  async changeState(data) {
    const response = await this.api.changeState(this.utils.getBasicEndPoint(`${this.entites}/${data.id}/change-state`), !data.active);
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('Estado cambiado correctamente').then(async () =>
        await this.loadData()
      );
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

}
