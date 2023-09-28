import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { Collect, CollectInfo, } from '../../../models/company';
import { ViewCollectionService } from '../view-collection.service';

@Component({
  selector: 'app-collect',
  templateUrl: './collect.component.html',
  styleUrls: ['./collect.component.scss']
})
export class CollectComponent implements OnInit {

  componentViewerIndex: any = undefined;

  register: boolean = false;
  analisis: boolean = false;
  isVisible: boolean = false;
  isCollectBalance: boolean = false;
  // PATH
  PATH = 'collects';
  STATE_CODE = 'SR';
  NOVELTIES_PATH = 'novelties';
  COLLECTION_STATE_PATH = 'masters/collect-states';
  COLLECTION_MOTIVES_PATH = 'masters/collect-motives';

  // permission
  filter;

  idCompany!: number;
  idEntity!: number;
  collectionId!: number;
  page: number = 1;
  numberRow: number = 5;

  ipClient: string = '';

  dataTable: Array<Collect> = [];
  dataRowSelected!: Collect;
  currentCollection!: Collect;
  currentCollectionInfo!: CollectInfo;

  filterValue: string = '';

  listOfDataFilter!: Array<any>;
  tableSaldoPendiente: any[] = [];
  userList: any[] = [];
  tableSizes = [5, 10, 15, 20, 30, 50];

  collectionStates;
  collectionReason;
  dataAuth;

  constructor(
    private utils: UtilsService,
    private api: ViewCollectionService,
  ) { }

  async ngOnInit() {
    await this.getEntityCompany();
    await this.checkPermissions();
    await this.loadData();
  }

  search(): void {
    let data!: Array<any>;
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.dataTable;
    }
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.listOfDataFilter.filter((current) => {
        return this.utils.validateObject(current.travel.id) && current.travel.id.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.date) && current.date.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.travel.route.name) && current.travel.route.name.toUpperCase().includes(this.filterValue.toUpperCase()) ||
          (this.utils.validateObject(current.travel.plate) && this.utils.validateObject(current.travel.internalNumber) &&
            (current.travel.plate.toString() + " - " + current.travel.internalNumber.toString()).toUpperCase().includes(this.filterValue.toUpperCase())) ||
          this.utils.validateObject(current.travel.driver) && current.travel.driver.toString().toUpperCase().includes(this.filterValue.toUpperCase())
      }
      );

      if (data) {
        this.dataTable = data;
      }
    } else {
      if (this.listOfDataFilter) {
        this.dataTable = this.listOfDataFilter;
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

  ver_analisis(event, id) {
    if (!this.analisis) {
      this.analisis = event;
      this.collectionId = id;
      return
    }

    if (id) {
      this.register = true;
      this.collectionId = id;
      this.analisis = false;
      return
    }

    this.analisis = event;
  }

  async registrar_recaudo(event, id) {
    if (!this.register) {
      this.register = event;
      this.collectionId = id;
      return
    }

    if (id) {
      this.register = false;
      this.collectionId = id;
      this.analisis = true;
      await this.loadData();
      return
    }

    this.register = event;
    await this.loadData();
  }

  async getEntityCompany() {
    const company = localStorage.getItem('selectedCompany')!;
    const entity = localStorage.getItem('selectedEntity')!;

    if (company || entity) {
      this.idCompany = JSON.parse(company).id;
      this.idEntity = JSON.parse(entity).entities[0].id;
    }
  }

  async checkPermissions() {
    this.filter = await this.utils.existTypeAction(UtilsService.FILTER);
  }

  async loadData() {
    const resp = await this.api.findAll(this.utils.getCollectionEndPoint(`${this.PATH}/?state=${this.STATE_CODE}&idCompany=${this.idCompany}&idEntity=${this.idEntity}`));
    if (resp && resp.status === this.utils.successMessage) {
      // console.log(resp.data.collects);
      
      this.dataTable = resp.data.collects;
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

}
