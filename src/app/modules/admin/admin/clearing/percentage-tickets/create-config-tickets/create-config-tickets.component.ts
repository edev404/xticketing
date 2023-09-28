import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { PassagesConfiguration, TicketInvolved } from '../../models/models';
import {DatePipe} from '@angular/common';
import Swal from 'sweetalert2';
import { ClearingAdminService } from '../../service/clearingAdmin.service';


@Component({
  selector: 'app-create-config-tickets',
  templateUrl: './create-config-tickets.component.html',
  styleUrls: ['./create-config-tickets.component.scss']
})
export class CreateConfigTicketsComponent implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() ticketsId;
  @Output() CreateOrEdit = new EventEmitter<any>();

  pasajeCofig
  currentDate;
  percentageTypeActorSelectedCB;

  passagesConfiguration: PassagesConfiguration = {};
  percentageTypeActorSelected: TicketInvolved = {};
  cities!: any[];
  typeActors!: any[];
  currentPercentage!: number | undefined;

  
  PATH = 'tickets';
  TYPE_ACTOR_PATH = 'involveds';
  CITIES_PATH = 'masters/cities';

  constructor(
    private api: ClearingAdminService,
    public utils: UtilsService,
    private datePipe: DatePipe
  ) { }

  async ngOnInit() {
    await this.loadTypeActors();
    await this.loadCities();
    if (this.ticketsId) {
      const resp = await this.api.findById(this.utils.getBasicEndPoint(`${this.PATH}/${this.ticketsId}`));
      if (resp && resp.status === this.utils.successMessage) {
        this.passagesConfiguration = resp.data.ticket;
      } else if (resp.showAlert){
        await this.utils.openErrorAlert(resp.message);
      }
      if (!this.passagesConfiguration.ticketInvolveds) {
        this.passagesConfiguration.ticketInvolveds = [];
      }
      this.calculatePercentage();
    } else {
      this.passagesConfiguration = {ticketInvolveds: []};
      this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.passagesConfiguration.validityStartDate = this.currentDate;
      this.passagesConfiguration.validityEndDate = this.currentDate;
    }
  }

  cancelCompany(){
    this.CreateOrEdit.emit(false);
  }

  calculatePercentage() {
    if (this.passagesConfiguration.ticketInvolveds && this.passagesConfiguration.ticketInvolveds.length > 0) {
      this.currentPercentage = this.passagesConfiguration.ticketInvolveds.map(row => row.percentage)
        .reduce((previousValue, currentValue) => Number(previousValue) + Number(currentValue));
    }
  }

  clearForm() {
    this.passagesConfiguration = {ticketInvolveds: []};
    this.passagesConfiguration.cityId = undefined;
    this.percentageTypeActorSelected = {};
    this.passagesConfiguration.validityStartDate = this.currentDate;
    this.passagesConfiguration.validityEndDate = this.currentDate;
  }

  async saveData() {
    let response;

    if (new Date(this.passagesConfiguration.validityStartDate!) > new Date(this.passagesConfiguration.validityEndDate!)) {
      await this.utils.openErrorAlert('Fecha no permitida');
      return;
    }

    if (Number(this.currentPercentage) !== Number(100)) {
      await this.utils.openErrorAlert('La suma de porcentaje debe dar 100%');
      return;
    }
    
    if (this.ticketsId) {
      response = await this.api.update(this.utils.getBasicEndPoint(`${this.PATH}/${this.ticketsId}`),
        JSON.stringify(this.passagesConfiguration));
    } else {
      response = await this.api.create(this.utils.getBasicEndPoint(this.PATH), JSON.stringify(this.passagesConfiguration));
    }

    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(this.passagesConfiguration.id ? 'Configuracion editada correctamente' : 'Configuracion creado correctamente').then(()=>{
        this.CreateOrEdit.emit(false);
        this.clearForm();
      })
    } else if (response.showAlert){
      await this.utils.openErrorAlert(response.message);
    }

  }

  async addPercentageTypeActor() {
    if (!this.percentageTypeActorSelectedCB) {
      await this.utils.openErrorAlert('Tipo de actor no válido');
      return;
    }

    if (
      !this.percentageTypeActorSelected.percentage ||
      (this.percentageTypeActorSelected.percentage &&
        (Number(this.percentageTypeActorSelected.percentage) <= 0 ||
          Number(this.percentageTypeActorSelected.percentage) > 100))
    ) {
      await this.utils.openErrorAlert('Porcentaje no válido');
      return;
    }

    if (this.passagesConfiguration.ticketInvolveds!.length > 0) {
      const sum = this.passagesConfiguration
        .ticketInvolveds!.map((row) => row.percentage)
        .reduce(
          (previousValue, currentValue) =>
            Number(previousValue) + Number(currentValue)
        );

      if (
        Number(sum) + Number(this.percentageTypeActorSelected.percentage) >
        100
      ) {
        await this.utils.openErrorAlert(
          'El valor digitado excede el 100% en la suma de los porcentajes'
        );
        return;
      }
    }

    this.percentageTypeActorSelected.involvedId = this.percentageTypeActorSelectedCB.id;
    this.percentageTypeActorSelected.involvedName = this.percentageTypeActorSelectedCB.name;

    const result = this.passagesConfiguration.ticketInvolveds!.filter(value => value.involvedId === this.percentageTypeActorSelected.involvedId);
    if (result && result.length > 0) {
      await this.utils.openErrorAlert('Tipo de actor ya agregado');
      return;
    }

    this.percentageTypeActorSelected.percentage = Number(this.percentageTypeActorSelected.percentage);
    this.passagesConfiguration.ticketInvolveds!.push(this.percentageTypeActorSelected);
    this.passagesConfiguration.ticketInvolveds = [...this.passagesConfiguration.ticketInvolveds!]
    this.calculatePercentage();
    this.percentageTypeActorSelected = {};
    this.percentageTypeActorSelectedCB = undefined;
  }

  async deletePercentageTypeActor(percentageTypeActor: TicketInvolved) {
    Swal.fire(this.utils.getQuestionModalOptions('¿Deseas eliminar este registro?',
      'Si elimina a este tipo de actor ya no se tendrá en cuenta en el Clearing.'))
      .then(async (data) => {
        if (data.isConfirmed) {
          this.passagesConfiguration.ticketInvolveds!.splice(this.passagesConfiguration.ticketInvolveds!.indexOf(percentageTypeActor), 1);
          this.passagesConfiguration.ticketInvolveds = [...this.passagesConfiguration.ticketInvolveds!]
          this.calculatePercentage();
        }
      });
  }

  private async loadTypeActors() {
    const response = await this.api.findAll(this.utils.getBasicEndPoint(`${this.TYPE_ACTOR_PATH}?active=true`));
    if (response.status === this.utils.successMessage) {
      this.typeActors = response.data.involveds;
    } else if (response.showAlert){
      await this.utils.openErrorAlert(response.message);
    }
  }

  private async loadCities() {
    const response = await this.api.getCities(this.utils.getBasicEndPoint(`${this.CITIES_PATH}`));
    if (response.status === this.utils.successMessage) {
      this.cities = response.data.cities;
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

}
