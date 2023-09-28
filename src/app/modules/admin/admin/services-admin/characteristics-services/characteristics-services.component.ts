import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ServicesService } from '../service/services.service';

@Component({
  selector: 'app-characteristics-services',
  templateUrl: './characteristics-services.component.html',
  styleUrls: ['./characteristics-services.component.scss']
})
export class CharacteristicsServicesComponent implements OnInit {

  listOfData: any[] = [];
  isCreate: boolean = false;
  isEdit!: boolean;

  filterValue: string = '';

  listOfDataFilter!: Array<any>;
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  
  page: number = 1;
  numberRow: number = 5;
  idService!:number | null;

  // PATH APIS
  pathCharacteristcsServices = 'characteristicservices';


  constructor(private api: ServicesService,public utils: UtilsService) { }

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
          return current.id.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              current.name.toString().toUpperCase().includes(this.filterValue.toUpperCase())
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

  async changeStatus(event,rowId){
    if(!event.currentTarget.checked){
      await this.changeState(false,rowId);
      return;
    }
    await this.changeState(true,rowId);
  }

  async CreateOrEdit(id,value) {
    if(!value) await this.loadData();
    if (id) {
      this.isCreate = value
      this.isEdit = true;
      this.idService = id
      return;
    }
    this.isCreate = value
    this.idService = null;
    this.isEdit = false;
  }

  async loadData() {
    const entity = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (entity) {
      const idEntity = entity.entities[0].id;
      const resp = await this.api.findAll(this.utils.getBasicEndPoint(`${this.pathCharacteristcsServices}/${idEntity}/servicesCharacteristic`));
      if (resp.status === this.utils.successMessage) {
        this.listOfData = resp.data.service;
      } else {
          await this.utils.openErrorAlert(resp.message);
      }
    }
  }

  async changeState(status,id) {
    const response = await this.api.changeState(this.utils.getBasicEndPoint(`${this.pathCharacteristcsServices}/${id}/change-state`), status);
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('Estado cambiado correctamente.')
      await this.loadData()
    } else {
      await this.utils.openErrorAlert(response.message);
    }
  }

}
