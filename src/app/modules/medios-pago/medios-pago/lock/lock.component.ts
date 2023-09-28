import { Component, OnInit } from '@angular/core';
import { ApiServiceCardMethodPayment } from '../../services/card.payment-methods.api';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { Card } from '../../models/Card';

@Component({
  selector: 'app-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.scss',  '../../../../../assets/themes/white/core/_formulario.scss']
})
export class LockComponent implements OnInit {
  // Filter
  filterValue: string = '';
  filterValueTable!: string;

  // MODAL DATA
  titulo: string = '';
  descripcion: string = '';
  tarjeta: string | undefined = '';
  tipo: string = '';
  tipoEnvio!: boolean;
  // Elemento de la tabla selecionado
  selectedCard!: Card;

  // OCULTAMIENTO
  isVisible: boolean = false;
  isVisibleMotivo: boolean = false;
  // PAGINATION
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  numberRow: number = 5;
  page: number = 1;

  dataTable: any[] = [];
  dataTableCopy!: any[] | any;
  mostrarData!: boolean;

  formularioEnviado: boolean = false;
  blockReason?: number;
  blockComment?: string;

  blockReasons: any[] = [];

  unsubscribeReason?: number;
  unsubscribeComment?: string;

  unsubscribeReasons: any[] = [];

  columns: { label: string, name: string, type?: string }[] = [];

  constructor(
    private api: ApiServiceCardMethodPayment,
    private utils: UtilsService,
  ) {
    this.columns = [
      { label: 'ID', name: 'id', type: 'string' },
      { label: 'NÚMERO', name: 'number' },
      { label: 'BALANCE', name: 'balance' },
      { label: 'CUENTA', name: 'account' },
      { label: 'ACTIVA', name: 'active', type: 'boolean' },
      { label: 'BLOQUEADA', name: 'blocked', type: 'boolean' },
      { label: 'DADA DE BAJA', name: 'unsubscribed', type: 'boolean' },
      { label: 'TIPO DE TARJETA', name: 'tipo', type: 'boolean' }
    ]
  }

  ngOnInit(): void {
    this.loadBlockReasons()
    this.loadUnsubscribeReasons()
  }

  // paginado
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }
  onChangePage(event: number): void {
    this.page = event;
  }
  // Filtro de la tabla
  search() {
    let data: any[];
    if (this.filterValueTable || (this.filterValueTable && this.filterValueTable.trim() != '')) {
      data = this.dataTableCopy.filter(
        (current: any) => {
          return this.utils.validateObject(current.id) && current.id!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
        }
      );
      if (data) {
        this.dataTable = data;
      }
    } else {
      if (this.dataTableCopy) {
        this.dataTable = this.dataTableCopy;
        this.filterValueTable = ''
      }
    }
  }

  closeModalMotivo() {
    this.isVisibleMotivo = false;
  }
  closeModalBlockForm() {
    this.isVisibleMotivo = true;
    this.closeModal()
  }

  closeModalBaja() {
    this.isVisibleMotivo = true;
    this.closeModal()
  }


  // MODAL
  openModal(tipo: string, elemento: Card): void {
    this.titulo = tipo;
    this.selectedCard = elemento;
    this.isVisible = true;
    if (tipo == "bloquear") {
      if (elemento.blocked) {
        this.utils.openErrorAlert("Esta tarjeta esta bloqueada actualmente")
        this.closeModal()
        return;
      }
      this.tipoEnvio = true;
      this.titulo = "Bloquear";
      this.descripcion = "Estas seguro que deseas bloquear las siguiente tarjeta ?"
      this.tarjeta = elemento.number;
      return;
    }
    this.tipoEnvio = false;
    this.titulo = "Dar de baja"
    this.descripcion = `Desea dar de baja la tarjeta ${elemento.number} ?`
    if (elemento.unsubscribed) {
      this.utils.openErrorAlert("Esta tarjeta esta de baja actualmente")
      this.closeModal()
      return;
    }
  }
  closeModal(): void {
    this.isVisible = false;
    // this.tarjeta = '';
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
        this.dataTable = this.dataTable.filter((element) => element.active)
        this.dataTableCopy = this.dataTable;
      }
    } else {
      this.dataTable = [];
    }
    this.mostrarData = this.dataTable.length > 0 ? true : false;
  }

  async bloquearConfirmado() {
    this.formularioEnviado = true;
    console.log(this.blockReason)
    if (this.blockReason) {
      const response = await this.api.block({ cards: [this.selectedCard], id_block_reason: this.blockReason, comment: this.blockComment })
      if (response.status == 'success') {
        await this.utils.openSuccessAlert("Tarjeta bloqueada correctamente").then(async () => {
          await this.cargarTabla()
          this.closeModalMotivo()
        });
      }
    }
  }
  async bajaConfirmado() {
    this.formularioEnviado = true;
    if (this.unsubscribeReason) {
      const response = await this.api.unsubscribe({ cards: [this.selectedCard], id_unsubscribe_reason: this.unsubscribeReason, comment: this.unsubscribeComment })
      if (response.status == 'success') {
        this.utils.openSuccessAlert("Tarjeta dada de baja correctamente");
        this.cargarTabla()
      }
      this.closeModalMotivo()
    }
  }
  async loadBlockReasons() {
    const response = await this.api.getBlockReasons()
    if (response) {
      this.blockReasons = response.data.blockReasons
    }
  }

  async loadUnsubscribeReasons() {
    const response = await this.api.getUnsubcribeReasons()
    if (response) {
      this.unsubscribeReasons = response.data.unsubscribeReasons
    }
  }
}
