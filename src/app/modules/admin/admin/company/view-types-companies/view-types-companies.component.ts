import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { CompanyService } from '../service/company.service';

@Component({
  selector: 'app-view-types-companies',
  templateUrl: './view-types-companies.component.html',
  styleUrls: ['./view-types-companies.component.scss']
})
export class ViewTypesCompaniesComponent implements OnInit {
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


  // PATH APIS
  PATH = 'processType';
  
  constructor(private api: CompanyService,public utils: UtilsService) { }

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

  edit(data){
    this.isEdit = true
    this.id = data.id;
    this.description = data.description;
  }

  cancelCompanies() {
    this.isEdit = false;
    this.id = null;
    this.description = null;
  }

  async loadData() {
    const resp = await this.api.findAll(this.utils.getBasicEndPoint(`${this.PATH}`));
    if (resp.status === this.utils.successMessage) {      
      this.listOfData = resp.data.tipoProceso;
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async saveCompanie(){
    let resp;
    if (!this.description) {
      return
    }
    if(this.isEdit){
      resp = await this.api.update(this.utils.getBasicEndPoint(`${this.PATH}/${this.id}`), JSON.stringify({id:this.id, description:this.description}))
      this.isEdit = false;
    } else {
      resp = await this.api.create(this.utils.getBasicEndPoint(`${this.PATH}`), JSON.stringify({id:null, description:this.description}));
    }
    if (resp.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(resp.message);
      this.description = null;
      this.id = null;
      this.closebutton.nativeElement.click();
      await this.loadData();
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

}
