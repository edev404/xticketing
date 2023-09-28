import { Component, Input, OnInit, Output } from '@angular/core';
import { Card } from '../../models/Card';
import { ApiServiceCardMethodPayment } from '../../services/card.payment-methods.api';
import { PassengerAdminApiService } from 'src/app/modules/clientes/service/passenger.admin.api.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Component({
  selector: 'app-personalize',
  templateUrl: './personalize.component.html',
  styleUrls: ['./personalize.component.scss']
})
export class PersonalizeComponent implements OnInit {

  filterValue!: string;
  filterValueTable!: string;

  selectedCard!: Card;
  passenger:any

  // PAGINATION
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  numberRow: number = 5;
  page: number = 1;

  // OCULTAMIENTO
  mostrarFormClientOPersonalizar: boolean = true;
  mostrarData!: boolean;
  loading: boolean = false;
  isVisible: boolean = false;
  printIsVisible: boolean = false;

  // Almacena de donde se ha creado el formulario de cliente
  @Input() creadoDesdeMetodosPagos: boolean = false;

  dataTable!: Card[];
  dataTableCopy!: Card[] | any;
  historyTable: any[] = []

  columns: { label: string, name: string, type?: string }[] = []

  constructor(
    private api: ApiServiceCardMethodPayment,
    private utils: UtilsService,
    private apiPassenger: PassengerAdminApiService
  ) {

    this.columns = [
      { label: 'ID Tarjeta', name: 'id', type: 'string' },
      { label: 'Tipo tarjeta', name: 'card_type' },
      { label: 'Fecha inicialización', name: 'init_request_date' },
      { label: 'Fecha activación', name: '' },
      { label: 'Núnmero de cuenta', name: 'account' },
      { label: 'ID Pasajero', name: 'id_passenger' },
    ]
  }

  ngOnInit(): void {
  }

  // paginado
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }
  onChangePage(event: number): void {
    this.page = event;
  }
  // Personalizar
  recibirEvento(event: boolean) {
    this.mostrarFormClientOPersonalizar = event;

  }
  async personalizar() {
    const response = await this.api.getFilteredCards(this.filterValue,this.getSelectedEntity())
    this.selectedCard = response.data.cards
    if(this.selectedCard[0].id){
      const response = await this.apiPassenger.getPassengerById(this.utils.getBasicEndPoint(`passengers/${this.selectedCard[0].id}`))
      if(response){
        this.passenger = response.data.passenger
        this.mostrarFormClientOPersonalizar = false;
        this.creadoDesdeMetodosPagos = true;
      }
    }
  }
  search() {
    // let data: Card[];
    // if (this.filterValueTable || (this.filterValueTable && this.filterValueTable.trim() != '')) {
    //   data = this.dataTableCopy.filter(
    //     (current: Card) => {
    //       return this.utils.validateObject(current.id)       && current.id!         .toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
    //     }
    //   );
    //   if (data) {
    //     this.dataTable = data;
    //   }
    // } else {
    //   if (this.dataTableCopy) {
    //     this.dataTable = this.dataTableCopy;
    //     this.filterValueTable = ''
    //   }
    // }
  }

  getSelectedEntity() {
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));
    if (entity) {
      const idEntity = entity.entities[0].id;
      return idEntity;
    }
    return null;
  }

  async cargarTabla() {
    //  && this.filterValue.length >= 3
    if (this.filterValue) {
      const response = await this.api.getFilteredCards(this.filterValue, this.getSelectedEntity())
      if (response) {
        this.dataTable = response.data.cards;
        this.dataTableCopy = this.dataTable;
      }
    } else {
      this.dataTable = [];
    }
    this.mostrarData = this.dataTable.length > 0 ? true : false;
  }

  assignPassenger: Function = (id: number) => {
    this.callAsignPassanger(id)
  }

  async callAsignPassanger(id: number) {
    const response = await this.api.assignPassenger(this.selectedCard[0].id, id)
  }

  ngOnChanges(): void {
    this.cargarTabla();
  }

  RecibidomostrarFormClientOPersonalizar(evento: boolean){
    this.mostrarFormClientOPersonalizar = evento;
  }
  // imprimir
  showImprimir() {
    this.printIsVisible = true;
  }
}
