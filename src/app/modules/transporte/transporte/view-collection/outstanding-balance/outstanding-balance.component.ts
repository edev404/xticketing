import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ViewCollectionService } from '../view-collection.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Collect, Outstanding, Trazability } from '../../../models/company';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';

@Component({
  selector: 'app-outstanding-balance',
  templateUrl: './outstanding-balance.component.html',
  styleUrls: ['./outstanding-balance.component.scss']
})
export class OutstandingBalanceComponent implements OnInit {
  @Output() CloseOutstanding = new EventEmitter<any>();
  @Input() collectionId!: any;
  @Input() isReport!: boolean;

  accionPropuesta: any[] = [];
  currentCollection!: Collect;
  validateForm!: FormGroup;
  dataOutstanding: Outstanding = {};
  trazabilidad: Trazability = {
    idColletion: 0,
    idTravel: 0,
    valueCollet: 0,
    cashier: '',
    date: '',
    typeCollect: ''
  };

  page: number = 1;
  numberRow: number = 5;

  filterValue: string = '';

  listOfDataFilter!: Array<any>;
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  tableSaldoPendiente: any[] = [];
  userList: any[] = [];

  balance: number = 0;
  valorSolucionado: number = 0;

  isVisible: boolean = false;
  onlyView: boolean = false;
  disable1: boolean = false;
  disable2: boolean = false;
  disable3: boolean = false;
  showOtherInputs: boolean = false;

  minDate!: string;
  maxDate!: string;

  PATH = 'collects';

  constructor(
    private utils: UtilsService,
    private api: ViewCollectionService,
    private _api: ApiServiceService,
    private fb: FormBuilder
  ) {
    this.validateForm = this.fb.group({
      valorPorSolucionar: [null],
      accionPropuesta: [null],
      contextoSituacion: [null],
      descripcionSituacion: [null],
      responsable: [null],
      fechaEstimada: [null],
      solucionEjecutada: [null],
      fechaEjecucion:[null],
      ejecutadoPor: [null],
      valorSolucionado: [null]
    });
  }

  async ngOnInit() {
    await this.loadData();
    // Cargar lista accion propuesta
    this.getAccionPropuesta()
  }

  async getAccionPropuesta() {
    this.accionPropuesta = await this._api.getLista('ACCION_PROPUESTA');
  }

  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

  createSaldoPendiente(pojo) {
    this.dataOutstanding.valueToSolve = pojo.valorPorSolucionar;
    this.dataOutstanding.proposedAction = pojo.accionPropuesta;
    this.dataOutstanding.situationContext = pojo.contextoSituacion;
    this.dataOutstanding.solutionDescription = pojo.descripcionSituacion;
    this.dataOutstanding.responsable = pojo.responsable;
    this.dataOutstanding.dateEstimate = this.utils.formatDate(pojo.fechaEstimada);
    if (this.dataOutstanding.id) {
      this.dataOutstanding.solutionExecute = pojo.solucionEjecutada;
      this.dataOutstanding.dateEjecution = this.utils.formatDate(pojo.fechaEjecucion);
      this.dataOutstanding.byExecute = pojo.ejecutadoPor;
      this.dataOutstanding.solveValue = pojo.valorSolucionado;
    }
    
  }

  enableValues() {
    let form = this.validateForm;
    form.controls['valorPorSolucionar'].enable();
    form.controls['accionPropuesta'].enable();
    form.controls['contextoSituacion'].enable();
    form.controls['descripcionSituacion'].enable();
    form.controls['responsable'].enable();
    form.controls['fechaEstimada'].enable();
    form.controls['solucionEjecutada'].enable();
    form.controls['fechaEjecucion'].enable();
    form.controls['ejecutadoPor'].enable();
    form.controls['valorSolucionado'].enable();
  }

  setValues(data) {
    let form = this.validateForm;
    this.dataOutstanding.id = data.id;

    form.controls['valorPorSolucionar'].setValue(data.valueToSolve);
    if (data.valueToSolve != null) form.controls['valorPorSolucionar'].disable();

    form.controls['accionPropuesta'].setValue(data.proposedAction);
    if (data.proposedAction != null) { 
      form.controls['accionPropuesta'].disable();
      this.disable1 = true
    }

    form.controls['contextoSituacion'].setValue(data.situationContext);
    if (data.situationContext != null) form.controls['contextoSituacion'].disable();

    form.controls['descripcionSituacion'].setValue(data.solutionDescription);
    if (data.solutionDescription != null) form.controls['descripcionSituacion'].disable();

    form.controls['responsable'].setValue(data.responsable);
    if (data.responsable != null){
      form.controls['responsable'].disable();
      this.disable2 = true
    } 

    form.controls['fechaEstimada'].setValue(new Date(data.dateEstimate));
    if (data.dateEstimate != null) form.controls['fechaEstimada'].disable();

    form.controls['solucionEjecutada'].setValue(data.solutionExecute);
    if (data.solutionExecute != null){
      form.controls['solucionEjecutada'].disable();
    } else {
      form.controls['solucionEjecutada'].enable();
    }

    form.controls['fechaEjecucion'].setValue(data.dateEjecution);
    if (data.dateEjecution != null) {
      form.controls['fechaEjecucion'].disable();
    } else {
      form.controls['fechaEjecucion'].enable();
    }

    form.controls['ejecutadoPor'].setValue(data.byExecute);
    if (data.byExecute != null) {
      form.controls['ejecutadoPor'].disable();
      this.disable3 = true
    } else {
      this.disable3 = false;
      form.controls['ejecutadoPor'].enable();
    }
    
    form.controls['valorSolucionado'].setValue(data.solveValue);
    if (data.active) {
      form.controls['valorSolucionado'].disable();
      this.onlyView = true;
    } else {
      form.controls['valorSolucionado'].enable();
      this.onlyView = false;
    }
  }

  closeOutstanding() {
    this.CloseOutstanding.emit(true);
  }

  async loadData() {
    // consulta 1
    const coleccion = await this.api.findById(this.utils.getCollectionEndPoint(`${this.PATH}/${this.collectionId}`));
    if (coleccion.status === this.utils.successMessage) {
      this.currentCollection = coleccion.data.collect;
    } else {      
      await this.utils.openErrorAlert(coleccion.message);
    }

    // consulta 2
    const resp = await this.api.getLista(this.utils.getBasicEndPoint(`pendingbalance`));
    if (resp.status === this.utils.successMessage) {
      resp.data.pending.map((elemento) => {if (elemento.idColletion == this.collectionId) this.tableSaldoPendiente.push(elemento)});
      this.tableSaldoPendiente.sort((a, b) => b.active - a.active);
      this.valorSolucionado = 0;
      this.tableSaldoPendiente.map((dato) => {
      if (dato.active == true) {this.valorSolucionado = this.valorSolucionado + dato.solveValue;}});
      this.tableSaldoPendiente = [...this.tableSaldoPendiente];
    } else {
      await this.utils.openErrorAlert(resp.message);
    }

    this.balance = this.currentCollection.balance;

    // consulta 3
    const usuarios = await this.api.getLista(this.utils.getBasicEndPoint(`users`));    
    if (usuarios.status === this.utils.successMessage) {
      this.userList = usuarios.data.users;
      this.userList.sort((a, b) => a.firstName - b.firstName);
    } else {
      await this.utils.openErrorAlert(usuarios.message);
    }
  }

  // afinar este metodo
  async submit() {
    this.dataOutstanding.idColletion = Number(this.collectionId);
    this.dataOutstanding.active = this.showOtherInputs;
    this.enableValues();
    this.createSaldoPendiente(this.validateForm.value);

    if (this.onlyView){
      this.utils.openErrorAlert('Ya esta solución fue ejecutada.');
      return;
    }
    
    if (this.dataOutstanding.solveValue! <= 0 || this.dataOutstanding.solveValue! > this.currentCollection.balance) {
      this.utils.openErrorAlert('El valor no puede ser cero, negativo o mayor que el saldo pendiente.');
      return;
    }

    let response;
    let recaudo;
    let traza;
    this.dataOutstanding.idTravel = this.currentCollection.travel.id;
    this.dataOutstanding.drive = this.currentCollection.travel.driver;
    const total = this.valorSolucionado + this.dataOutstanding.solveValue!;
    this.dataOutstanding.totalSolveValue = Number.isNaN(total)? null : total;
    if (this.dataOutstanding.id) {
      this.currentCollection.manualCollect = this.currentCollection.manualCollect + this.dataOutstanding.solveValue!;
      if (this.currentCollection.collect == this.currentCollection.manualCollect) {
        this.currentCollection.stateId = 1;
        this.currentCollection.motiveId = null;
      }
      this.currentCollection.drive = this.currentCollection.travel.driver;
      this.trazabilidad.idColletion = this.currentCollection.id;
      this.trazabilidad.date = this.minDate;
      this.trazabilidad.cashier = this.dataOutstanding.byExecute;
      this.trazabilidad.valueCollet = this.dataOutstanding.solveValue;
      this.trazabilidad.idTravel = this.currentCollection.travel.id;
      this.trazabilidad.drive = this.currentCollection.travel.driver;
      this.trazabilidad.typeCollect = 'T-RP';
      await this.api.changeState(this.utils.getBasicEndPoint(`pendingbalance/${this.dataOutstanding.id}/change-state`));
      response = await this.api.update(this.utils.getBasicEndPoint(`pendingbalance/${this.dataOutstanding.id}`), this.dataOutstanding);
      recaudo = await this.api.updateRecaudo(this.utils.getCollectionEndPoint(`collects/${this.dataOutstanding.idColletion}`), this.currentCollection);
      traza = await this.api.save(this.utils.getBasicEndPoint(`pendingbalance/createTraceabilityCollect`), this.trazabilidad);
      this.disable1 = false;
      this.disable2 = false;
    } else {      
      response = await this.api.save(this.utils.getBasicEndPoint(`pendingbalance`), this.dataOutstanding);
    }
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(this.dataOutstanding.id ? 'Solución ejecutada correctamente' : 'Saldo guardado correctamente');
      this.tableSaldoPendiente = []
      await this.loadData();
      this.dataOutstanding = {};
      this.validateForm.reset();
      this.isVisible = false;
      this.showOtherInputs = false; 
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }

  }

  async loadExecuteSolution(data) {
    this.isVisible = true;
    this.showOtherInputs = true; 
    this.setValues(data);
  }

}
