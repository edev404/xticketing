import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import Swal from 'sweetalert2';
import { ApiServiceUserAdmin } from '../../user/service/user.admin.api';
import { ClearingAdminService } from '../service/clearingAdmin.service';

@Component({
  selector: 'app-recharges',
  templateUrl: './recharges.component.html',
  styleUrls: ['./recharges.component.scss']
})
export class RechargesComponent implements OnInit {
  listOfData: any[] = [];

  isCreate:boolean = false;
  isEdit!: boolean;
  idRecharges!:number | null;
  filterValue: string = '';
  listOfDataFilter!: Array<any>;
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  page: number = 1;
  numberRow: number = 5;

   PATH = 'recharges';

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

  changeStateModal(data) {
    Swal.fire(this.utils.getQuestionModalOptions('¿Deseas cambiar el estado de este dato?',
      `El estado pasara de estar ${data.active ? 'activo a inactivo.' : 'inactivo a activo.'} `)).then(async (result) => {
      if (result.isConfirmed) {
        await this.changeState(data);
      }
    });
  }

  async changeState(data) {
    const response = await this.api.changeState(this.utils.getBasicEndPoint(`${this.PATH}/${data.id}/change-state`),
      !data.active);
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('Estado cambiado correctamente')
        .then(async () =>
          await this.loadData()
        );
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }

  }

  async CreateOrEdit(id,value) {
    if(!value) await this.loadData();
    if (id) {
      this.isCreate = value
      this.isEdit = true;
      this.idRecharges = id
      return;
    }
    this.isCreate = value
    this.isEdit = false;
    this.idRecharges = null;
  }

  async loadData() {
    const resp = await this.api.findAll(this.utils.getBasicEndPoint(this.PATH));
    if (resp.status === this.utils.successMessage) {
      resp.data.recharges.sort((a, b) => {
        if (a.active > b.active) return -1;
        if (a.active < b.active) return 1;
        return 0;
      })
      this.listOfData = resp.data.recharges;
    } else {
      console.log(resp.message);
      // await this.utils.openErrorAlert(resp.message);
    }
  }

}
