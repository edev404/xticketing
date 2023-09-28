import { Component, OnInit } from '@angular/core';
import { Collect, Outstanding, Trazability } from '../../../models/company';
import { UtilsService } from 'src/app/myUtils/utils.service';

import { ViewCollectionService } from '../view-collection.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reports-collection',
  templateUrl: './reports-collection.component.html',
  styleUrls: ['./reports-collection.component.scss'],
})
export class ReportsCollectionComponent implements OnInit {
  dataTable!: Collect[];
  currentCollection!: Collect;
  dataOutstanding: Outstanding = {};
  validateForm!: FormGroup;
  trazabilidad: Trazability = {
    idColletion: 0,
    idTravel: 0,
    valueCollet: 0,
    cashier: '',
    date: '',
    typeCollect: ''
  };

  register: boolean = false;
  analisis: boolean = false;
  isVisible: boolean = false;
  Ver_analisis: boolean = false;
  disable1: boolean = false;
  disable2: boolean = false;
  disable3: boolean = false;
  

  onlyView: boolean = false;
  showOtherInputs = false;

  idEntity!: number;
  idCompany!: number;
  collectionId!: number;
  balance: number = 0;
  valorSolucionado: number = 0;
  page: number = 1;
  numberRow: number = 5;

  minDate!: string;
  maxDate!: string;
  filterValue: string = '';

  listOfDataFilter!: Array<any>;
  tableSaldoPendiente: any[] = [];
  userList: any[] = [];
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  
  filter;
  tableMain: any[] = [];

  PATH = 'collects';
  STATE_CODE = 'RT';

  constructor(
    private utils: UtilsService,
    private api: ViewCollectionService,
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
    await this.getEntityCompany();
    await this.checkPermissions();
    await this.loadData();
  }

  search(): void {
    let data!: Array<any>;
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.tableMain;
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
        this.tableMain = data;
      }
    } else {
      if (this.listOfDataFilter) {
        this.tableMain = this.listOfDataFilter;
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

  ver_analisis_viajes(event,id) {
    if (!this.analisis || !event) {
      this.analisis = true;
      this.collectionId = id;
    } else {
      this.analisis = false;
    }
  }

  createSaldoPendiente(pojo) {
    this.dataOutstanding.valueToSolve = pojo.valorPorSolucionar;
    this.dataOutstanding.proposedAction = pojo.accionPropuesta;
    this.dataOutstanding.situationContext = pojo.contextoSituacion;
    this.dataOutstanding.solutionDescription = pojo.descripcionSituacion;
    this.dataOutstanding.responsable = pojo.responsable;
    this.dataOutstanding.dateEstimate = pojo.fechaEstimada;
    this.dataOutstanding.solutionExecute = pojo.solucionEjecutada;
    this.dataOutstanding.dateEjecution = pojo.fechaEjecucion;
    this.dataOutstanding.byExecute = pojo.ejecutadoPor;
    this.dataOutstanding.solveValue = pojo.valorSolucionado;
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

  async registrar_recaudo(id) {    
    if (this.register == false) {
      this.register = true;
      this.collectionId = id;
      await this.loadDataSaldoPendiente();
      this.minDate = this.utils.formatDate(new Date());
      this.maxDate = this.utils.formatDate(new Date());
    } else {
      this.register = false;
      this.isVisible = false;
      this.tableSaldoPendiente = []
      this.validateForm.reset();
      this.tableSaldoPendiente = [...this.tableSaldoPendiente];
    }
  }

  async getEntityCompany() {
    const company = localStorage.getItem('selectedCompany');
    const entity = localStorage.getItem('selectedEntity');
    if (company || entity) {
      this.idCompany = JSON.parse(company!).id;
      this.idEntity = JSON.parse(entity!).entities[0].id;
    }
  }

  async checkPermissions() {
    this.filter = await this.utils.existTypeAction(UtilsService.FILTER);
  }

  async loadData() {
    const response = await this.api.findAll(this.utils.getCollectionEndPoint(`${this.PATH}/?state=${this.STATE_CODE}&idCompany=${this.idCompany}&idEntity=${this.idEntity}`));
    if (response && response.status === this.utils.successMessage) {
      this.tableMain = response.data.collects;
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async loadDataSaldoPendiente() {
    // consulta 1
    const coleccion = await this.api.findById(this.utils.getCollectionEndPoint(`${this.PATH}/${this.collectionId}`));
    if (coleccion.status === this.utils.successMessage) {
      this.currentCollection = coleccion.data.collect;
    } else {      
      await this.utils.openErrorAlert(coleccion.message);
    }

    // consulta 2
    const response = await this.api.getLista(this.utils.getBasicEndPoint(`pendingbalance`));
    if (response.status === this.utils.successMessage) {
      response.data.pending.map((elemento) => {
        if (elemento.idColletion == this.collectionId) {
          this.tableSaldoPendiente.push(elemento);
        }
      });
      this.tableSaldoPendiente.sort((a, b) => b.active - a.active);
      this.valorSolucionado = 0;
      this.tableSaldoPendiente.map((dato) => {
        if (dato.active == true) { 
          this.valorSolucionado = this.valorSolucionado + dato.solveValue;
        }
      });
      this.tableSaldoPendiente = [...this.tableSaldoPendiente];
      
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }

    this.balance = this.currentCollection.balance;

    // consulta 3
    const usuarios = await this.api.getLista(this.utils.getBasicEndPoint(`users`));    
    if (usuarios.status === this.utils.successMessage) {
      this.userList = usuarios.data.users;
      this.userList.sort((a, b) => a.firstName - b.firstName);
    } else if (usuarios.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async submit() {
    let response;
    let traza;
    let recaudo;
    let form = this.validateForm;
    this.enableValues();
    this.createSaldoPendiente(form.value);
    this.dataOutstanding.idColletion = Number(this.collectionId);
    this.dataOutstanding.active = this.showOtherInputs;

    if (this.onlyView){
      this.utils.openErrorAlert('Ya esta solución fue ejecutada.');
      return;
    }

    if (this.dataOutstanding.solveValue! <= 0 || this.dataOutstanding.solveValue! > this.currentCollection.balance) {
      this.utils.openErrorAlert('El valor no puede ser cero, negativo o mayor que el saldo pendiente.');
      this.isVisible = false;
      return;
    }

    this.dataOutstanding.idTravel = this.currentCollection.travel.id;
    this.dataOutstanding.drive = this.currentCollection.travel.driver;
    this.dataOutstanding.totalSolveValue = this.valorSolucionado + this.dataOutstanding.solveValue!;
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
    } else {
      response = await this.api.save(this.utils.getBasicEndPoint(`pendingbalance`), this.dataOutstanding);
    }
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('Solución ejecutada correctamente');
      await this.loadDataSaldoPendiente();
      this.dataOutstanding = {};
      this.showOtherInputs = false;
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }

  }

  async loadExecuteSolution(data) {
    this.isVisible = true; 
    this.setValues(data);
  }
}
