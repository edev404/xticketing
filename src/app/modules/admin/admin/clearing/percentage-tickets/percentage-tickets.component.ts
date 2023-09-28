import { Component, Input, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import Swal from 'sweetalert2';
import { ClearingAdminService } from '../service/clearingAdmin.service';

@Component({
  selector: 'app-percentage-tickets',
  templateUrl: './percentage-tickets.component.html',
  styleUrls: ['./percentage-tickets.component.scss']
})
export class PercentageTicketsComponent implements OnInit {

  listOfData: any[] = [];
  listOfDataFilter!: Array<any>;
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  page: number = 1;
  numberRow: number = 5;
  idTickets!:number | null;

  isCreate:boolean = false;
  isConfig:boolean = false;
  isEdit!: boolean;

  filterValue: string = '';

  PATH = 'tickets';

  constructor(
    private api: ClearingAdminService,
    public utils: UtilsService
  ) { }

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
          return current.code.toUpperCase().includes(this.filterValue.toUpperCase()) ||
              current.name.toUpperCase().includes(this.filterValue.toUpperCase()) ||
              current.cityName.toUpperCase().includes(this.filterValue.toUpperCase()) ||
              current.validityStartDate.toUpperCase().includes(this.filterValue.toUpperCase()) ||
              current.validityEndDate.toUpperCase().includes(this.filterValue.toUpperCase()) ||
              current.creationDate.toUpperCase().includes(this.filterValue.toUpperCase()) ||
              current.creationUser.toUpperCase().includes(this.filterValue.toUpperCase())
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
      this.idTickets = id
      return;
    }
    this.isCreate = value
    this.isEdit = false;
    this.idTickets = null;
  }

  async configTickets(id,value) {
    if(!value) await this.loadData();
    if (id) {
      this.isConfig = value
      this.idTickets = id
      return;
    }
    this.isConfig = value
    this.idTickets = null
  }

  async loadData() {
    const response = await this.api.findAll(this.utils.getBasicEndPoint(this.PATH));
    if (response.status === this.utils.successMessage) {
      this.listOfData = response.data.tickets;
      this.listOfData.sort((a, b) => {
        if (a.active && !b.active) {
          return -1;
        } else if (!a.active && b.active) {
          return 1;
        } else {
          return 0;
        }
      });      
    } else if (response.showAlert){
      await this.utils.openErrorAlert(response.message);
    }
  }

  async changeStateModal(data) {
    Swal.fire(this.utils.getQuestionModalOptions('¿Deseas cambiar el estado de este dato?',
      `El estado pasara de estar ${data.active ? 'activo a inactivo.' : 'inactivo a activo.'} `)).then(async (result) => {
      if (result.isConfirmed) {
        await this.changeState(data);
      }else{
        await this.loadData();
      }
    });
  }

  async changeState(data) {
    const response = await this.api.changeState(this.utils.getBasicEndPoint(`${this.PATH}/${data.id}/change-state`),
      !data.active);
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('Estado cambiado correctamente').then(async () =>
        await this.loadData()
      );
    } else if (response.showAlert){
      await this.utils.openErrorAlert(response.message);
      await this.loadData();
    }

  }

}
