import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ClearingAdminService } from '../service/clearingAdmin.service';

@Component({
  selector: 'app-type-finding',
  templateUrl: './type-finding.component.html',
  styleUrls: ['./type-finding.component.scss']
})
export class TypeFindingComponent implements OnInit {
  @ViewChild('closebutton') closebutton;

  listOfData: any[] = [];
  description!:string | null;
  id!:number | null;
  isEdit: boolean = false;

  filterValue: string = '';
  listOfDataFilter!:Array<any>;

  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  page: number = 1;
  numberRow: number = 5;

  CLEARING_PATH = 'clearing';

  constructor(public utils: UtilsService, public api: ClearingAdminService) { }

  async ngOnInit() {
    await this.loadData();
  }

  // filter
  search(): void {
    let data!: Array<any>;
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.listOfData;
    }
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.listOfDataFilter.filter((current) => {
          return this.utils.validateObject(current.id)          && current.id          .toString().toUpperCase().includes(this.filterValue!.toUpperCase()) ||
                this.utils.validateObject(current.description)  && current.description .toString().toUpperCase().includes(this.filterValue!.toUpperCase())
        }
      );
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

  cancelTypehallazgo() {
    this.isEdit = false;
    this.id = null;
    this.description = null;
  }

  async saveTypehallazgo() {
    let resp;
    if (!this.description) return;
    if(this.isEdit){
      resp = await this.api.updateObj(this.utils.getClearingEndPoint(`${this.CLEARING_PATH}/update/types`), {id:this.id, description:this.description})
    } else {
      resp = await this.api.createObj(this.utils.getClearingEndPoint(`${this.CLEARING_PATH}/create/types`), {id:null, description:this.description});
    }
    if (resp.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(this.isEdit?'Hallazgo editado correctamente':'Hallazgo creado correctamente');
      this.description = null;
      this.id = null;
      this.isEdit = false;
      this.closebutton.nativeElement.click();
      await this.loadData();
    } else {
      await this.utils.openErrorAlert(this.isEdit?'¡No se ha podido editar el hallazgo!':'¡No se ha podido crear el hallazgo!');
    }
  }

  edit(data) {
    this.isEdit = true
    this.id = data.id;
    this.description = data.description;
  }

  async loadData() {
    const resp = await this.api.findDiscoverTypes(this.utils.getClearingEndPoint(`${this.CLEARING_PATH}/discover-types`));
    if (resp.status === this.utils.successMessage) {
      this.listOfData = resp.data.discoverTypes;
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

}
