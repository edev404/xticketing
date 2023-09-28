import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { TransporteService } from '../../service/transporte.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceRateService } from 'src/app/modules/tarifas/service/service-rate.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {
  vehicle: any[] = []

  filterValue: string = '';
  titelCharacterist1!: string;
  titelCharacterist2!: string;

  listOfDataFilter!: Array<any>;
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  charactsList: Array<any> = [];
  valuesCharactsList1: any[] = [];
  valuesCharactsList2: any[] = [];

  page: number = 1;
  numberRow: number = 5;
  idVehicle!: number;

  pass:boolean = false;
  isVisible:boolean = false;
  
  validateForm!: FormGroup;

  constructor(
    private utils: UtilsService,
    private api: TransporteService,
    private apiTarifas: ServiceRateService,
    private fb: FormBuilder,
  ) { 
    this.validateForm = this.fb.group({
      characts1: [null, [Validators.required]],
      charactsDetail1: [null, [Validators.required]],
      characts2: [null, [Validators.required]],
      charactsDetail2: [null, [Validators.required]]
    });
  }

  async ngOnInit() {
    const entity = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (entity) {
      const idEntity = entity.entities[0].id;      
      this.loadVehicle();
      this.loadCharactsList(idEntity);
    }
  }

  filterItems() {
    const searchTerm = this.filterValue.toLowerCase();
  
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.vehicle;
    }
  
    if (searchTerm === '') {
      this.vehicle = this.listOfDataFilter;
      this.pass = false;
    }
  
    this.vehicle = this.listOfDataFilter.filter(item => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          const value = item[key];
          if (value && typeof value === 'string') {
            const lowercaseValue = value.toLowerCase();
            if (lowercaseValue.includes(searchTerm)) {
              return true;
            }
          } else if (value instanceof Date) { 
            const dateValue = value.toISOString().toLowerCase();
            if (dateValue.includes(searchTerm)) {
              return true;
            }
          }
        }
      }
      return false;
    });
  
    if (this.vehicle.length === 0) {
      this.vehicle = this.listOfDataFilter;
      this.pass = true;
    }
  }

  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

  closeModal() {
    this.isVisible = false;
    this.validateForm.reset();
  }

  openModal(id) {
    this.isVisible = true;
    this.idVehicle = id;
  }

  async loadVehicle() {
    const selectedCompany = JSON.parse(localStorage.getItem('selectedCompany')!);
    const resp = await this.api.getVehicle(this.utils.getBasicEndPoint(`vehiculos?idEmpresa=${selectedCompany.id}`));
    if (resp.status === this.utils.successMessage) {
      this.vehicle = resp.data.vehiculos;
    } else {
      await this.utils.openErrorAlert(this.utils.errorGeneralMessage);
    }
  }

  async loadCharactsList(idEntity) {
    const resp = await this.apiTarifas.getList(this.utils.getBasicEndPoint(`characteristicservices/${idEntity}/servicesCharacteristic`));
    if (resp.status === this.utils.successMessage) {
      this.charactsList = resp.data.service;
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async loadCharacts1ListDetail(event) {
    const resp = await this.apiTarifas.getList(this.utils.getBasicEndPoint(`characteristicservices/${event.id}/servicesListVCharacServices`));
    this.valuesCharactsList1 = resp.data.service;
  }

  async loadCharacts2ListDetail(event) {
    const resp = await this.apiTarifas.getList(this.utils.getBasicEndPoint(`characteristicservices/${event.id}/servicesListVCharacServices`));
    this.valuesCharactsList2 = resp.data.service;
  }

  async save() {
    let form = this.validateForm; 

    if (form.value.characts1.id == form.value.characts2.id ) {
      this.utils.openInfoAlert('¡No se pueden vincular las mismas características!'); 
      return;
    }
  
    const json = {
      idvehiculo: this.idVehicle,
      characteristic_1: form.value.characts1.id,
      valuesCharacteristic_1: form.value.charactsDetail1,
      characteristic_2: form.value.characts2.id,
      valuesCharacteristic_2: form.value.charactsDetail2,
    }

    const resp = await this.api.linkedCharacteristic(this.utils.getBasicEndPoint('vehiculos/vincular-carasteristica'), json);
    if (resp.status === this.utils.successMessage) {
      this.utils.openSuccessAlert('Características asociadas correctamente');
      this.validateForm.reset();
      this.isVisible = false; 
    } else {
      await this.utils.openErrorAlert('¡no se ha podido vincular la característica correctamente!');
    }
    
  }
}
