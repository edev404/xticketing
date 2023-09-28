import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Company } from 'src/app/modules/transporte/models/company';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { PassagesTransferConfiguration, RouteTransferConfiguration } from '../../models/models';
import { ClearingAdminService } from '../../service/clearingAdmin.service';

@Component({
  selector: 'app-config-tickets',
  templateUrl: './config-tickets.component.html',
  styleUrls: ['./config-tickets.component.scss']
})
export class ConfigTicketsComponent implements OnInit {
  @Input() passagesConfigurationId;
  @Output() configTickets = new EventEmitter<any>();

  companies!: any[];
  sourceRoutes: RouteTransferConfiguration[] = [];
  percentageConfiguration: PassagesTransferConfiguration[] = [];
  passagesTransferConfiguration: PassagesTransferConfiguration[] = [];
  currentOriginSelected!: RouteTransferConfiguration | undefined;
  companyItemSelected
  dataTabla1: any[] = [];
  dataTabla2: any[] = [];
  temp: any[] = [];

  PATH = 'tickets';

  constructor(
    private api: ClearingAdminService,
    public utils: UtilsService
  ) { }

  async ngOnInit(){
    await this.loadCompanies();
    await this.loadData();
    this.dataTabla1 = this.sourceRoutes;
    this.dataTabla2 = this.percentageConfiguration
  }

  cancelCompany(){
    this.configTickets.emit(false);
  }

  selectedOrigin(row: RouteTransferConfiguration) {
    this.currentOriginSelected = row;
  }

  calculatePercentage(isOrigin: boolean, row: PassagesTransferConfiguration) {
    const maxPercentage = 100;
    if (isOrigin) {
      if (row.sourceRoute!.percentage) {
        row.destinationRoute!.percentage = Math.abs(row.sourceRoute!.percentage - maxPercentage);
      } else {
        row.sourceRoute!.percentage = 0;
        row.destinationRoute!.percentage = maxPercentage;
      }
    } else {
      if (row.destinationRoute!.percentage) {
        row.sourceRoute!.percentage = Math.abs(row.destinationRoute!.percentage - maxPercentage);
      } else {
        row.destinationRoute!.percentage = 0;
        row.sourceRoute!.percentage = maxPercentage;
      }
    }
  }

  setSourceRoutes() {
    if (!this.passagesTransferConfiguration || this.passagesTransferConfiguration.length === 0) {
      return;
    }
  
    this.passagesTransferConfiguration.forEach(value => {        
      const transferIdIndex = this.percentageConfiguration.findIndex(value1 => value1.transferId === value.transferId);
      const sourceRouteIndex = this.sourceRoutes.findIndex(currentSourceRoute => currentSourceRoute.id === value.sourceRoute!.id);
      
      if (transferIdIndex === -1) {
        const { sourceRoute, destinationRoute } = value;
        if (!sourceRoute!.percentage && !destinationRoute!.percentage) {
          sourceRoute!.percentage = 50;
          destinationRoute!.percentage = 50;
        }
  
        this.percentageConfiguration.push(value);
        this.dataTabla2 = [...this.percentageConfiguration];
      }
  
      if (sourceRouteIndex === -1) {        
        this.sourceRoutes.push(value.sourceRoute!);
      }
    });
  }
  
  extractCompaniesSelected() {
    return this.companyItemSelected.map((e)=>{ return JSON.parse(e).id; });
  }

  getLabel(item){
    return JSON.parse(item).name;
  }

  async onSubmit() {
    let resp = await this.api.save(this.utils.getBasicEndPoint(`${this.PATH}/${this.passagesConfigurationId}/transfers`), JSON.stringify(this.percentageConfiguration));
    if (resp.status === this.utils.successMessage) {
      await this.saveCompany(this.extractCompaniesSelected());
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async saveCompany(idCompany) {
    let resp = await this.api.save(this.utils.getBasicEndPoint(`${this.PATH}/${this.passagesConfigurationId}/companies`), JSON.stringify(idCompany));
    if (resp.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('Configuracion guardada exitosamente.').then(()=>{this.configTickets.emit(false)});
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async onItemSelect(item) {
    if (item.length == 0) {
      this.dataTabla1 = [];
      this.sourceRoutes = [];
      this.dataTabla2 = [];
      this.percentageConfiguration = [];
      return
    }
    let temp = item.map((e) => {
      if (typeof e != 'string')  return e
      return JSON.parse(e);
    })
    
    item.map(async(e)=>{await this.loadItemtable(e, temp)});    
    
  }

  async loadCompanies() {
    let temp: Array<any> = [];
    const companies = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (companies) {
      companies.companies.filter((company: Company) => company.active && company.typeId == 1).map((e)=>{
        temp.push(JSON.stringify({id: e.id, name: e.name}));
      });
      this.companies = temp;
    }
  }

  async loadItemtable(item, arr){     
    if (typeof item == "string") item = JSON.parse(item);
    
    const resp = await this.api.findByCompany(this.utils.getBasicEndPoint(`${this.PATH}/${this.passagesConfigurationId}/transfers?companyId=${item.id}`));
    if (resp.status === this.utils.successMessage) {      
      this.passagesTransferConfiguration = this.passagesTransferConfiguration.concat(resp.data.transfers);
      this.setSourceRoutes();
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
    
    const filteredArray = this.sourceRoutes.filter(e =>
      arr.some(filterItem => filterItem.id === e.companyId)
    );
    
    this.dataTabla1 = filteredArray;
    this.dataTabla1 = [...filteredArray];     

    if (this.sourceRoutes && this.sourceRoutes.length > 0) {        
      this.currentOriginSelected = this.sourceRoutes[0];
    } else {
      this.currentOriginSelected = undefined;
    }
  }

  private async loadData() {
    const itemSelected: Array<any> = [];
    let temp: Array<any> = [];
    const resp = await this.api.findCompanies(this.utils.getBasicEndPoint(`${this.PATH}/${this.passagesConfigurationId}/companies`));
    if (resp.status === this.utils.successMessage) {
      const companies = resp.data.companies;
      for (const company of companies) {
        temp.push({id: company.companyId, name: company.companyName})
        itemSelected.push(JSON.stringify({id: company.companyId, name: company.companyName}));
      }
      await this.onItemSelect(temp);
      this.companyItemSelected = itemSelected;
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }
}
