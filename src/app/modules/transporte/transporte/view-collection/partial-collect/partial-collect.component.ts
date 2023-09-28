import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewCollectionService } from '../view-collection.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Component({
  selector: 'app-partial-collect',
  templateUrl: './partial-collect.component.html',
  styleUrls: ['./partial-collect.component.scss']
})
export class PartialCollectComponent implements OnInit {

  saldopendiente = false;


  validateForm!: FormGroup;

  //MODALES
  isVisible = false;
  Ver_analisis = false;
  register: boolean = false;

  idCompany!: number;
  idEntity!: number;
  collectionId!: number;
  page: number = 1;
  numberRow: number = 5;

  filterValue: string = '';

  listOfDataFilter!: Array<any>;
  tableSaldoPendiente: any[] = [];
  userList: any[] = [];
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  listOfData01
  listOfData02
  listOfData04
  listOfData: any[] = [];
  filter;

  PATH = 'collects';
  STATE_CODE = 'RP';

  constructor(
    private utils: UtilsService,
    private api: ViewCollectionService,
    private fb: FormBuilder
  ) { 
    this.validateForm = this.fb.group({
      servicio: [null, [Validators.required]],
      empresa: [null, [Validators.required]],
      codigo: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      tipotarifa: [null, [Validators.required]],
      unidad: [null, [Validators.required]],
      caracteristica1: [null, [Validators.required]],
      caracteristica2: [],
      rangePicker: [null, [Validators.required]],
    });
  }

  async ngOnInit() {
    await this.getEntityCompany();
    await this.loadData();
    this.checkPermissions();
  }

  search(): void {
    let data!: Array<any>;
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.listOfData;
    }    
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.listOfDataFilter.filter((current) => {
          return this.utils.validateObject(current.travel.id) && current.travel.id                   .toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.date) && current.date                                    .toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.travel.route) && current.travel.route                    .toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.travel.plate) && current.travel.plate                    .toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.travel.internalNumber) && current.travel.internalNumber  .toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
          this.utils.validateObject(current.travel.driver) && current.travel.driver                  .toString().toUpperCase().includes(this.filterValue.toUpperCase())
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

  saveData() {
    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }

  }

  async registrar_recaudo(event, id){
    if (!this.register) {
      this.register = event;
      this.collectionId = id;
      await this.loadData();      
      return
    }

    if (id) {
      this.register = false;
      this.collectionId = id;
      this.Ver_analisis = true;
      return
    }
    
    this.register = event;
    await this.loadData();      
  }

  saldo_pendiente(event, id){
    if (!this.saldopendiente || !event) {
      this.saldopendiente = true;
      this.collectionId = id;
    } else {
      this.saldopendiente = false;
    }
  }

  ver_analisis_viajes(event, id) {
    if (!this.Ver_analisis) {
      this.Ver_analisis = event;
      this.collectionId = id;
      return
    }

    if (id) {
      this.register = true;
      this.collectionId = id;
      this.Ver_analisis = false;
      return
    }
    
    this.Ver_analisis = event;
  }

  checkPermissions() {
    this.filter = this.utils.existTypeAction(UtilsService.FILTER);
  }

  async getEntityCompany() {
    const company = localStorage.getItem('selectedCompany');
    const entity = localStorage.getItem('selectedEntity');
    if (company || entity) {
      this.idCompany = JSON.parse(company!).id;
      this.idEntity = JSON.parse(entity!).entities[0].id;
    }
  }

  async loadData() {
    const response = await this.api.findAll(this.utils.getCollectionEndPoint(`${this.PATH}/?state=${this.STATE_CODE}&idCompany=${this.idCompany}&idEntity=${this.idEntity}`));
    if (response && response.status === this.utils.successMessage) {
      this.listOfData = response.data.collects;      
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

}
