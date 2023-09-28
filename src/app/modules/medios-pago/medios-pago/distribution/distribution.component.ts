import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServiceCardMethodPayment } from '../../services/card.payment-methods.api';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { filter } from 'rxjs';
import { InitializationRequest } from '../../models/InitializationRequest';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class DistributionComponent implements OnInit {

  distributionDate: Date | any
  collectionCompany: number | any
  collectionCompanies: any = []
  collectionCompaniesActives: any = []
  initializationRequests: any = []
  distributions: any[] = []
  distributionsCopy: any[] = []
  distributionDetails: any = []
  initializationRequestsSelected: { initializationBatch: number, cards: number }[] = [{ initializationBatch: 0, cards: 0 }]
  dataSeleccionada: any;
  cantidadCards: number = 0;
  valorMax: number = 0;
  date = null;

  listOfData;
  filterValue: string = '';
  validateForm!: FormGroup;

  //MODALES
  isVisible = false;
  isVisibleDetails = false;
  Ver_analisis = false;

  // PAGINATION
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  numberRow: number = 5;
  page: number = 1

  constructor(
    private fb: FormBuilder,
    private utils: UtilsService,
    private api: ApiServiceCardMethodPayment
  ) {
    this.validateForm = this.fb.group({
      ente: [null, [Validators.required]],
      lote: [null, [Validators.required]],
      cantidad: [null, [Validators.required]],
      distributionDate: [null, [Validators.required]]
    });
    this.validateForm.get('cantidad')?.setValue(0);
    this.validateForm.get('cantidad')?.disable();
  }

  // paginado
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }
  onChangePage(event: number): void {
    this.page = event;
  }

  async ngOnInit() {
    await this.loadCollectionCompanies()
    await this.loadInitializationRequests()
    await this.loadDistributionList();
    this.distributionDate = new Date()
  }

  disabledStartDate = (startValue: Date): boolean => {
    // Convertimos la fecha inicial en un objeto Date
    const fechaInicial = new Date();
    const fechaFinal = new Date();
    // Aumentamos 12 años a la fecha inicial
    fechaInicial.setDate(fechaInicial.getDate() - 7);
    fechaFinal.setDate(fechaFinal.getDate() + 5);
    // Ahora puedes obtener la nueva fecha en el formato deseado
    const nuevaFechaString = fechaInicial.toISOString();
    const nuevaFechaStringFin = fechaFinal.toISOString();

    if (startValue) {
      // console.log(endValueNac)
      return startValue.getTime() <= new Date(nuevaFechaString).getTime() || startValue.getTime() >= new Date(nuevaFechaStringFin).getTime();
    }
    return false
  };

  asignCompanies() {
    if (this.distributions.length > 0 && this.collectionCompanies.length > 0) {

    }
  }

  cambioLoteDistribucion(event) {
    if (event) {
      const dataSeleccionada = this.initializationRequests.find((element) => element.solicitud == event.solicitud);
      this.dataSeleccionada = dataSeleccionada;
      this.valorMax = dataSeleccionada.restante;
      this.validateForm.get('cantidad')?.setValue(dataSeleccionada.restante);
      // this.validateForm.get('cantidad')?.enable();
    }
  }

  search() {
    let data: any[];
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.distributionsCopy.filter(
        (current: any) => {
          return this.utils.validateObject(current.company_name) && current.company_name!.toString().toUpperCase().includes(this.filterValue!.toUpperCase())
        }
      );
      if (data) {
        this.distributions = data;
      }
    } else {
      if (this.distributionsCopy) {
        this.distributions = this.distributionsCopy;
        this.filterValue = ''
      }
    }
  }

  async loadCollectionCompanies() {
    const response = await this.api.getCollectionCompanies()
    if (response) {
      this.collectionCompanies = response.data.companies
      this.collectionCompaniesActives = this.collectionCompanies.filter(x => x.active)
    }
  }

  async loadInitializationRequests() {
    const response = await this.api.getRegistryListForInit()
    if (response) {
      // this.initializationRequests = response.data.initializationForDistribution.filter(x => x.available_quantity > 0).sort(this.compare)
      this.initializationRequests = response.data.batches;
      this.initializationRequests = this.initializationRequests.filter((element) => element.restante)
    }
  }

  compare(a, b) {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  }


  getSelectedEntity() {
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));
    if (entity) {
      const idEntity = entity.entities[0].id;
      return idEntity;
    }
    return null;
  }

  async loadDistributionList() {
    const response = await this.api.loadDistributionList(this.getSelectedEntity())
    if (response) {
      this.distributions = response.data.distributions;
      this.distributionsCopy = this.distributions;
      this.distributions.forEach(x => x.id_company)
    }
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  addBatch() {
    if (this.initializationRequestsSelected.length < this.initializationRequests.length) {
      this.initializationRequestsSelected.push({ initializationBatch: 0, cards: 0 })
    }
  }

  async saveData() {
    console.log(this.dataSeleccionada)
    const initializationRequestsSelectedFiltered = this.initializationRequestsSelected.filter(x => (x.initializationBatch != undefined && x.cards > 0))
    console.log(this.initializationRequestsSelected)
    console.log(initializationRequestsSelectedFiltered)
    // const dataSeleccionada = this.initializationRequests.find((element) => element.solicitud == event.solicitud);
    if (initializationRequestsSelectedFiltered.length > 0) {
      const data = this.initializationRequests.find((element) => element.solicitud == this.validateForm.get('lote')!.value.solicitud)
      const json = { collectionCompany: this.collectionCompany, date: new Date(), batches: { initializationBatch: this.dataSeleccionada, cards: this.validateForm.get('cantidad')!.value, solicitud: data.solicitud }, id_entity: this.getSelectedEntity() }
      const response = await this.api.createDistribution(json)
      if (response) {
        this.utils.openSuccessAlert("Tarjetas distribuidas correctamente")
        this.handleCancel();
        this.validateForm.reset()
        this.loadDistributionList()
        this.loadInitializationRequests()
        this.distributionDate = null
        this.collectionCompany = null
        this.initializationRequestsSelected = [{ initializationBatch: 0, cards: 0 }]
      } else {
        this.utils.openInfoAlert("Tarjeta no distribuida, no lleno el formulario")
        this.handleCancel();
      }
    }
  }

  //MODALES
  showModal(): void {
    this.distributionDate = new Date()
    this.isVisible = true;
  }

  openDetailModal(data) {
    this.loadDistributionDetail(data);
  }

  verAnalisisModal(): void {
    this.Ver_analisis = true;
  }

  handleOk(): void {
    this.isVisible = false;
    this.Ver_analisis = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisibleDetails = false;
    this.Ver_analisis = false;
  }
  //
  async loadDistributionDetail(distribution) {
    const response = await this.api.getDistributionDetail(distribution.id)
    if (response) {
      this.distributionDetails = response.data.distributionDetails
      this.isVisibleDetails = true;
    }
  }

}
