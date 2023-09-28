import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ApiServiceUserAdmin } from '../../user/service/user.admin.api';
import { CompanyService } from '../service/company.service';

@Component({
  selector: 'app-view-fleet-companies',
  templateUrl: './view-fleet-companies.component.html',
  styleUrls: ['./view-fleet-companies.component.scss', '../../../../../../assets/themes/white/core/_formulario.scss']
})
export class ViewFleetCompaniesComponent implements OnInit {
  @ViewChild('closebutton') closebutton;

  listOfData:Array<any> = [];
  listOfDataCopy!:Array<any>;
  companiesall!:Array<any>;
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  page: number = 1;
  numberRow: number = 5;
  
  addCompanyModel!:any;
  filterValueTable: string = '';

  // utils
  companiesType = 1;
  // filterValue: string;
  // show: boolean;

  // PATH APIS
  pathCompanies = 'companies';
  pathExternalCompanies = 'external-companies';
  showColum = {
    Codigo: true, 
    Nombre: true,
    NITCC: true,
    Direccion: true,
    Municipio: true,
    Correo: true,
    Responsable: true,
    Telefono: true,
  }

  constructor(public utils: UtilsService, private api: CompanyService,) { }

  async ngOnInit() {
    await this.loadCompanies();
    await this.loadExternalCompanies();
  }  

  viewColum(event,check){
    if (!event.currentTarget.checked) {
      switch (check) {
        case 1:
          this.showColum.Codigo = false
          break;
        case 2:
          this.showColum.Nombre = false
          break;
        case 3:
          this.showColum.NITCC = false
          break;
        case 4:
          this.showColum.Direccion = false
          break;
        case 5:
          this.showColum.Municipio = false
          break;
        case 6:
          this.showColum.Correo = false
          break;
        case 7:
          this.showColum.Responsable = false
          break;
        case 8:
          this.showColum.Telefono = false
          break;
      }
    } else {
      switch (check) {
        case 1:
          this.showColum.Codigo = true
          break;
        case 2:
          this.showColum.Nombre = true
          break;
        case 3:
          this.showColum.NITCC = true
          break;
        case 4:
          this.showColum.Direccion = true
          break;
        case 5:
          this.showColum.Municipio = true
          break;
        case 6:
          this.showColum.Correo = true
          break;
        case 7:
          this.showColum.Responsable = true
          break;
        case 8:
          this.showColum.Telefono = true
          break;
      }
    }
  }

  // filter
  search() {
    let data: any[];
    if (this.filterValueTable || (this.filterValueTable && this.filterValueTable.trim() != '')) {
      data = this.listOfDataCopy.filter(
        (current: any) => {
          return this.utils.validateObject(current.code) && current.code!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
          this.utils.validateObject(current.name) && current.name!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
          this.utils.validateObject(current.client.nit ? current.client.nit : null  ) && current.client.nit !.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
          this.utils.validateObject(current.client.address ? current.client.address : null) && current.client.address !.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) || 
          this.utils.validateObject(current.client.city ? current.client.city : null) && current.client.city !.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
          this.utils.validateObject(current.client.email ? current.client.email : null) && current.client.email !.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
          this.utils.validateObject(current.client.managerName ? current.client.managerName : null) && current.client.managerName !.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
          this.utils.validateObject(current.client.managerCellPhone ? current.client.managerCellPhone : null) && current.client.managerCellPhone !.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
        }
      );
      if (data) {
        this.listOfData = data;
      }
    } else {
      if (this.listOfDataCopy) {
        this.listOfData = this.listOfDataCopy;
        this.filterValueTable = ''
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

  async loadCompanies() {
    const resp = await this.api.getCompanies(this.utils.getBasicEndPoint(`${this.pathCompanies}/?type-id=${this.companiesType}`));
    if (resp.status === this.utils.successMessage) {
      let data = resp.data.companies;
      let companies:Array<any> = [];
      for (let i = 0; i < data.length; i++) {
        let d = data[i];
        companies.push({...d, ...d.client});
      }
      this.listOfData = companies;
      this.listOfDataCopy = this.listOfData;
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async loadExternalCompanies() {
    const resp = await this.api.getExternalCompanies(this.utils.getBasicEndPoint(`${this.pathExternalCompanies}`));
    if (resp.status === this.utils.successMessage) {
      this.companiesall = resp.data.companies;      
    }
  }

  async addCompany() {
    if (!this.addCompanyModel) {
      await this.utils.openErrorAlert('Seleccione una empresa');
      return;
    }

    this.addCompanyModel.id = null;
    this.addCompanyModel.typeId = 1;
    this.addCompanyModel.minAmountByDay = 0
    this.addCompanyModel.maxAmountByDay = 0
    const response = await this.api.addExternalCompany(this.utils.getBasicEndPoint(this.pathExternalCompanies), JSON.stringify(this.addCompanyModel));
    if (response.status === this.utils.successMessage) {
      this.addCompanyModel = undefined;
      this.utils.openSuccessAlert(response.message);
      this.closebutton.nativeElement.click();
      await this.ngOnInit();
    } else if (response.showAlert) {
      await this.utils.openErrorAlert('¡No se ha podido agregar la empresa correctamente!');
    }
  }

}
