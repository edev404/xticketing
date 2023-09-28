import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceRateService } from '../../service/service-rate.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ServicesRateModel } from '../../models/tarifas';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';

@Component({
  selector: 'app-rate-form',
  templateUrl: './rate-form.component.html',
  styleUrls: ['./rate-form.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class RateFormComponent implements OnInit {

  PATH = 'users';

  validateForm!: FormGroup;
  listEntityByServicesCompanies: Array<any> = [];

  //Banderas
  inputFeaturesError!: boolean;
  inputVigencia!: boolean;
  canSave: boolean = true;

  // Formulario
  rateServicesForm: ServicesRateModel = new ServicesRateModel;
  //rateDetailForm: RateDetailModel = {};

  disabledDate = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return current < today;
  };

  result;

  // Objects
  companyList: any = [];
  servicesList: any = [];
  charactsList: any = [];
  typesRate: any = [];
  unitRates: any = [];
  unit: any = [ ];
  datePlaceholder: any = ['Fecha inicial', 'Fecha final']

  constructor(
    private fb: FormBuilder,
    private api: ServiceRateService,
    private util: UtilsService,
    private datePipe: DatePipe,
    private _api: ApiServiceService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.validateForm = this.fb.group({
      servicio: [null, [Validators.required]],
      empresa: [null, [Validators.required]],
      codigo: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      tipotarifa: [null, [Validators.required]],
      unidad: [null, [Validators.required]],
      caracteristica1: [null],
      caracteristica2: [null],
      rangePicker: [null, [Validators.required]],
    });

    this.rateServicesForm.validityInitial = await this.datePipe.transform(new Date(), this.util.dateFormat);
    this.rateServicesForm.validityEnd = await this.datePipe.transform(this.util.getDateWithCountDay(30), this.util.dateFormat);
    const entity = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (entity) {
      const idEntity = entity.entities[0].id;
      const userId = entity.userId;
      this.loadCharactsList(idEntity);
      this.loadUsersEntitiesServicesCompanies(userId, idEntity);
    }

    // Cargar tarifas
    this.getTipoTarifa();
    // Cargar unidad medida
    this.getUnidadMedida();
  }

  // Cargar listas tipo tarifa
  async getTipoTarifa(): Promise<void> {
    this.typesRate = await this._api.getLista('TIPO_TARIFA');    
  }

  async getUnidadMedida(): Promise<void> {
    this.unit = await this._api.getLista('UNIDAD_MEDIDA');
  }

  selectCompanies(value: string): void {
    this.companyList = [];
    const entity = JSON.parse(localStorage.getItem('selectedEntity')!);
    this.listEntityByServicesCompanies.map(filterEntity => {
      if (filterEntity.entities[0].id == entity.entities[0].id) {
        if (filterEntity.services) {
          filterEntity.services.map(servicio => {
            if (servicio.id == value) {
              this.companyList = filterEntity.companies;
            }
          })
        }
      }
    });
  }

  changeTypeRates(value: string): void {
    this.unitRates = [];
    this.rateServicesForm.unity = null;
    
    this.typesRate.map(type => {            
      if (type.code === value) {
        this.rateServicesForm.type = type.description;
      }
    });

    if (this.rateServicesForm.type == "Unitario") { this.rateServicesForm.unity = "1" }
    this.unitRates = this.unit.filter(x => x.order == value);
  }

  async loadCharactsList(idEntity) {
    const response = await this.api.getList(this.util.getBasicEndPoint(`characteristicservices/${idEntity}/servicesCharacteristic`));
    if (response.status === this.util.successMessage) {
      this.charactsList = response.data.service;
    } else {
      await this.util.openErrorAlert(response.message);
    }
  }

  async loadUsersEntitiesServicesCompanies(userId: number, idEntity) {
    const response = await this.api.getUsersEntitiesServicesCompanies(this.util.getBasicEndPoint(`${this.PATH}/associated?id=${userId}`));

    if (response.status === this.util.successMessage) {
      this.listEntityByServicesCompanies = response.data.entities;
      this.listEntityByServicesCompanies.map(filterEntity => {
        if (filterEntity.entities[0].id == idEntity) {
          if (filterEntity.services) {
            filterEntity.services.map(servicio => {
              this.servicesList.push(servicio);
            })
          }
        }
      });
    } else if (response.showAlert) {
      await this.util.openErrorAlert(response.message);
    }
  }

  //refactorizar
  async saveData() {
    if (this.validateForm.valid) {

      const toDate = moment(this.validateForm.value.rangePicker[0]).format('YYYY-MM-DD');
      const endDate = moment(this.validateForm.value.rangePicker[1]).format('YYYY-MM-DD');
      this.rateServicesForm.validityInitial = toDate;
      this.rateServicesForm.validityEnd = endDate;

      if (this.validateForm.value.caracteristica1 && this.validateForm.value.caracteristica2 && this.validateForm.value.caracteristica1 == this.validateForm.value.caracteristica2) {
        await this.util.openInfoAlert('No es posible seleccionar dos características iguales');
        return
      }

      const entity = JSON.parse(localStorage.getItem('selectedEntity')!);
      if (entity) { this.rateServicesForm.idEntity = entity.entities[0].id; }
      const json = {
        idServices: this.rateServicesForm.idServices,
        idEntity: this.rateServicesForm.idEntity,
        company: this.rateServicesForm.company,
        validityInitial: this.rateServicesForm.validityInitial,
        validityEnd: this.rateServicesForm.validityEnd,
        type: this.rateServicesForm.type,
        unity: this.rateServicesForm.unity,
        characteristicSecond: this.rateServicesForm.characteristicSecond,
        characteristicFirst: this.rateServicesForm.characteristicFirst,
        description: this.rateServicesForm.description,
        code: this.rateServicesForm.code,
        status: this.rateServicesForm.status
      }

      var repiteDate = false;
      const fechas = await this.api.getList(this.util.getBasicEndPoint(`fareServices/${entity.entities[0].id}/fareServicesAll`));
      if (fechas.status === this.util.successMessage) {
        if (fechas.data.service.length != 0) {
          fechas.data.service.map(rango => {
            if (rango.idServices == json.idServices && rango.company == json.company) {
              if (json.status) {
                if (json.validityInitial <= rango.validityEnd) {
                  repiteDate = true;
                  this.util.openErrorAlert('Ya se encuentra una tarifa vigente para este rango de fechas');
                }
              }

            }
          });
        }
      }
      if (repiteDate) return;


      if (!this.rateServicesForm.id) {
        this.result = await this.api.create(this.util.getBasicEndPoint(`fareServices`), json);
      }

      if (this.result.status === this.util.successMessage) {
        await this.util.openSuccessAlert('¡La tarifa ha sido creada correctamente!').then(data => {
            this.validateForm.reset();
            this.router.navigateByUrl('/main/tarifas');
        });
      } else if ('error') {
        await this.util.openInfoAlert('¡El código de la tarifa ingresado ya existe!');
      }

    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}


