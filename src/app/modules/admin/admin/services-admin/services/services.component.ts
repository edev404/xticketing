import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ServicesService } from '../service/services.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  listOfData: any[] = [];
  listOfDataFilter!: Array<any>;
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  page: number = 1;
  numberRow: number = 5;
  idService!:number | null;

  isCreate: boolean = false;
  isEdit!: boolean;

  filterValue: string = '';

  // PATH APIS
  PATH = 'services';

  constructor(private api: ServicesService,public utils: UtilsService) { }

  async ngOnInit(){
    await this.loadData();
  }

  search(): void {
    let data!: Array<any>;
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.listOfData;
    }    
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.listOfDataFilter.filter((current) => {
          return current.code.toUpperCase().includes(this.filterValue.toUpperCase()) ||
              current.name.toUpperCase().includes(this.filterValue.toUpperCase()) ||
              current.name_company.toUpperCase().includes(this.filterValue.toUpperCase())
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
    const resp = await this.api.findAll(this.utils.getBasicEndPoint(`${this.PATH}/servicesAll`));
    if (resp.status === this.utils.successMessage) {
      this.listOfData = resp.data.service;      
    } else {
        await this.utils.openErrorAlert(resp.message);
    }
  }

  async changeState(data) {
    const response = await this.api.changeState(this.utils.getBasicEndPoint(`${this.PATH}/${data.id}/change-state`), !data.active);
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('Estado cambiado correctamente').then(async () =>
          await this.loadData()
      );
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

}
