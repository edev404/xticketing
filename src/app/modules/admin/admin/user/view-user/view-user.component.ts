import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ManageService } from 'src/app/modules/descuentos/models/modelManager';
import { UtilsService } from 'src/app/myUtils/utils.service';
import Swal from 'sweetalert2';
import { ICompany, IEntitiesConfiguration, IRelationServices, IServicesCompanyToEntity } from '../../entites/models/entites';
import { IElementsByUser, IEntidadesByUser } from '../models/entidadesByUser';
import { User } from '../models/user';
import { ApiServiceUserAdmin } from '../service/user.admin.api';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

  mostrar: boolean = false;
  estado: boolean = false;

  editarPassanger: any;

  @Output() tabId = new EventEmitter<any>()

  formEntityRelation: IEntidadesByUser = {};
  entityForm: IEntitiesConfiguration = {};
  formRelationEntity: IRelationServices = {};

  listOfData;
  userAll;
  entityByServicesCompanies
  userEdit: any;
  selectedEntity: any;
  query!:string;
  filterValue: string = '';
  nameUser!: string;
  idByEdit!: number;

  isVisible:boolean = false;
  isDisabled:boolean = true;
  isEdit: boolean = false; 
  

  validateForm!: FormGroup;
  listOfDataFilter: any[] | undefined;
  entitiesList: any[] = [];
  servicesList: ManageService[] = [];
  entities!: IServicesCompanyToEntity[];
  companiesList: ICompany[] = [];
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  pageMain: number = 1;
  numberRowMain: number = 5;

  pageModal: number = 1;
  numberRowModal: number = 5;

  // UTILS SERVICES
  PATH = 'users';
  COMPANY_PATH = 'companies';
  SERVICES_PATH = 'services';
  ENTITIES_PATH = 'entities';

  entites:string = 'entities';
  pathCompanies = 'companies';
  pathServices = 'services';
  
  constructor( 
    private api: ApiServiceUserAdmin,
    public utils: UtilsService,
    private fb: FormBuilder
  ) {
    this.validateForm = this.fb.group({
      entity: [null],
      service: [null],
      company: [null],          
    });
   }

  async ngOnInit()  {
    await this.loadData();
  }

  async search(){
    let data: any[];
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.listOfDataFilter!.filter((current) => {
          return this.utils.validateObject(current.username) && current.username.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.profile) && current.profile.toString().toUpperCase().includes(this.filterValue.toUpperCase())
        }
      );
      if (data) {
        this.userAll = data;
      }
    } else {
      if (this.listOfDataFilter) {
        this.userAll = this.listOfDataFilter;
        this.filterValue = ''
      }
    }
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

  setTab(id){
    this.filterValue = '';
    this.tabId.emit({tabId:1, idUser:id})
  }

  transforDataByUser(elements: IElementsByUser[]) {
    if(elements) {
      return elements.map(element => ` ${element.name}`);
    }
    return
  }

  closeModal() {
    this.entityForm = {};
    this.formRelationEntity = {};
    this.companiesList = [];
    this.formRelationEntity.companyItemSelected = [];
    this.validateForm.reset();
  }

  closeModalSave() {
    this.entityForm = {};
    this.formRelationEntity = {};
    this.companiesList = [];
    this.formRelationEntity.companyItemSelected = [];
    this.validateForm.reset();
    location.reload();
  }

  getLabel(item){
    return JSON.parse(item).name;
  }

  async openModal(User){
    this.isVisible = true;
    this.userEdit = User; 
    this.nameUser = User.firstName + " "+User.secondName +" "+ User.lastName +" "+ User.secondLastName ;
    await this.loadUsersEntitiesServicesCompanies(User.id);
    await this.loadEntities(User);

  }

  async loadData() {
    this.userAll = [];
    this.query = '';
    const responseData = await this.api.getListUsers(`${this.utils.getBasicEndPoint(`${this.PATH}`)}`);
    
    if (responseData.status === this.utils.successMessage) {
      this.userAll = responseData.data.users;
      this.userAll.sort((a, b) => a.id - b.id);
      this.userAll.sort((a, b) => {
        if (a.active > b.active) return -1;
        if (a.active < b.active) return 1;
        return 0;
      });
      this.listOfDataFilter = this.userAll;
      
    } else if (responseData.show) {
      await this.utils.openErrorAlert(responseData.message);
    }

  }

  async loadEntities(user: User) {
    const resp = await this.api.getEntities(this.utils.getBasicEndPoint(`${this.ENTITIES_PATH}`));
    if (resp.status === this.utils.successMessage) {
       const entities = resp.data.entities;
       this.entitiesList = entities.filter((entity: IEntitiesConfiguration) => entity.active === true);
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async loadUsersEntitiesServicesCompanies(userId: number) {
    const response = await this.api.getUsersEntitiesServicesCompanies(this.utils.getBasicEndPoint(`${this.PATH}/associated?id=${userId}`));
    if (response.status === this.utils.successMessage) {
      this.entityByServicesCompanies = response.data.entities;      
      this.entityByServicesCompanies.forEach((data: IEntidadesByUser) => {        
        data.entitiesName = this.transforDataByUser(data.entities);
        data.servicesName = this.transforDataByUser(data.services!);
        data.companiesName = this.transforDataByUser(data.companies);
      });
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async selectEntity(idEntity) {    
    this.formEntityRelation.services = undefined;
    this.formEntityRelation.companies = undefined;
    this.companiesList = [];
    const response = await this.api.getEntityServices(this.utils.getBasicEndPoint(`${this.SERVICES_PATH}/${idEntity}/findServicesEntity`));
    if (response.status === this.utils.successMessage) {
      this.entities = response.data.service;
      const services = response.data.service.map((service: IServicesCompanyToEntity) => service.idServices);
      this.loadServicesByUser(services);
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }
  
  async loadServicesByUser(entitiesServices: string[]) {
    const response = await this.api.getServicesByUser(this.utils.getBasicEndPoint(`${this.SERVICES_PATH}/servicesAll`));
    if (response.status === this.utils.successMessage) {
      const services = response.data.service;
      const servicesList = services.filter((service: ManageService) => service.active === true);
      let list: Array<any> = [];
      entitiesServices.forEach(entityID => {
        servicesList.forEach(element => {
          if (element.id == entityID) {
            list.push(element);
          };
        });
      });
      this.servicesList = list;
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async ServicesSelect(item) {
    this.companiesList = [];
    let companiesArray: any[] = [];
    this.formEntityRelation.companies = [];

    const findEntity = this.entities.find(entity => entity.idServices == item);
    const companies = findEntity!.dateCompanies.map;
    for (const property in companies) {
      companiesArray.push({id:parseInt(property), name: companies[property]});
    };
    this.companiesList = companiesArray;
  }

  async editServicesToEntidad(entity: IEntidadesByUser) {
    this.idByEdit = entity.id!;
    this.isEdit = true;
    const form = this.validateForm;
    
    form.controls['entity'].setValue(entity.entities[0].id);
    form.controls['service'].setValue(entity.services![0].id);
    form.controls['company'].setValue(entity.companies.map(e => {return e.id }))

    await this.selectEntity(entity.entities[0].id);
    this.ServicesSelect(entity.services![0].id);

    
  }

  async addRelationEntity() {
    let form = this.validateForm;
    let response;
         
    if (!form.value.entity || !form.value.service || !form.value.company) {
      await this.utils.openErrorAlert('Debe seleccionar todos los campos.');
      return;
    }

    let ServicesCompanies = this.entityByServicesCompanies.filter(element => element.entities[0].id == form.value.entity && element.services[0].id == form.value.service)    
    if (ServicesCompanies.length && !this.isEdit) {
      this.utils.openErrorAlert('La entidad y el servicio ya se encuentran asociadas al usuario.');
      return;
    }

    const JSON = {
      id: this.idByEdit ? this.idByEdit : undefined,
      user: this.userEdit.id,
      companies: form.value.company,
      entities: form.value.entity,
      services: [form.value.service],
      default_entity: this.entityByServicesCompanies.length <= 0 ? 1 : 0
    }
    
    if (this.isEdit) {
      response = await this.api.addCompanyToUser(this.utils.getBasicEndPoint(`${this.PATH}/add`), JSON);
    } else {
      response = await this.api.addCompanyToUser(this.utils.getBasicEndPoint(`${this.PATH}/add`), JSON);
    }

    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(this.idByEdit ? 'Entidades, Servicios y Empresas editadas con éxito.' : 'Entidades, Servicios y Empresas agregadas con éxito');
      form.reset();
      this.loadUsersEntitiesServicesCompanies(this.userEdit.id);
      this.isEdit = false;
    } else {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async removeEntityToUser(entity: IEntidadesByUser) {
    if (entity.default_entity == 1 && this.entityByServicesCompanies.length > 1) {
      await this.utils.openInfoAlert('No se puede eliminar la entidad porque se encuentra por defecto.');
      return;
    }    
    const response = await this.api.removeCompanyToUser(this.utils.getBasicEndPoint(`${this.PATH}/${entity.id}/remove`), {userId: this.userEdit.id});
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(response.message);
      this.loadUsersEntitiesServicesCompanies(this.userEdit.id);
      
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async changeEntityDefaultToUser(entity: IEntidadesByUser) {
    if (entity.default_entity == 1 ) {
      await this.utils.openInfoAlert('La entidad seleccionada ya se encuentra asignada por defecto.');
      this.loadUsersEntitiesServicesCompanies(this.userEdit.id);
      return;
    }
    Swal.fire(this.utils.getQuestionModalOptions('¿Deseas cambiar la entidad por defecto a este usuario?', '')).then(async (result) => {
      if (result.isConfirmed) {
        await this.entityDefaultToUser(entity);
      }
    });
  }

  async entityDefaultToUser(entity: IEntidadesByUser) {
    const response = await this.api.entityDefault(this.utils.getBasicEndPoint(`${this.PATH}/${this.userEdit.id}/entity-default`), entity.id);
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('Entidad asignada por defecto con éxito.');
      this.loadUsersEntitiesServicesCompanies(this.userEdit.id);
    } else if (response.showAlert) {
      await this.utils.openErrorAlert('Error al asignar por defecto.');
    }
  }
  
  async changeStateUser(userEdit) {
    Swal.fire(this.utils.getQuestionModalOptions('¿Está seguro de que desea cambiar el estado del usuario?',
    `El estado del usuario pasará de estar ${userEdit.active ? 'activo a inactivo.' : 'inactivo a activo.'} `)).then(async (result) => {
      if (result.isConfirmed) {
        await this.aceptar();
      } else {
        
      }
    });
    this.editarPassanger = userEdit
    this.loadData();
  }
  
  async aceptar() {
    const resp = await this.api.changeStateUser(this.utils.getBasicEndPoint(`${this.PATH}/${this.editarPassanger.id}/change-state`), !this.editarPassanger.active);
    if (resp.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(resp.message);
      await this.loadData();
      this.filterValue = '';
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
      await this.loadData();
    }
  }
}
