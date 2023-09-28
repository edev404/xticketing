import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiServiceCardMethodPayment } from '../../services/card.payment-methods.api';
import { filter } from 'rxjs';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss' , '../../../../../assets/themes/white/core/_formulario.scss']
})
export class ActivateComponent implements OnInit {
  // Filter
  filterValue: string = '';
  filterValueTable: string = '';
  // Estado
  checkbox = true;

  dataSeleccionada: any;
  dataActivar: any[] = [];

  dataTable: any[] = [];
  dataTableCopy!: any[] | any;
  mostrarData!: boolean;

  // PAGINATION
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  numberRow: number = 5;
  page: number = 1;

  //CONFIRM
  confirmModal?: NzModalRef;

  //MODALES
  isVisibleModal = false;
  Ver_analisis = false;

  defaultDataColumns: { label: string, name: string, type?: string }[] = [
    { label: 'ID', name: 'id', type: 'string' },
    { label: 'NÚMERO', name: 'number' },
    { label: 'BALANCE', name: 'balance' },
    { label: 'CUENTA', name: 'account' },
    // { label: 'ACTIVA', name: 'active', type: 'boolean' },
    { label: 'BLOQUEADA', name: 'blocked', type: 'boolean' },
    { label: 'DADA DE BAJA', name: 'unsubscribed', type: 'boolean' },
    { label: 'TIPO DE TARJETA', name: 'tipo', type: 'boolean' }
  ]

  constructor(
    private utils: UtilsService,
    private api: ApiServiceCardMethodPayment,
  ) { }

  ngOnInit(): void {
  }

  // Paginador
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }
  onChangePage(event: number): void {
    this.page = event;
  }
  // filter
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

  refreshStatus(data: any, checked: boolean) {
    if (checked) {
      this.dataSeleccionada = data;
      this.dataActivar.push(this.dataSeleccionada)
    } else {
      this.dataSeleccionada = {}
    }
  }
  //MODALES
  showModal(): void {
    this.isVisibleModal = true;
  }

  handleCancel(): void {
    this.isVisibleModal = false;
  }

  abrirModal(): void {
    this.isVisibleModal = true;
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
        console.log(this.dataTable)
        this.dataTable = this.dataTable.filter((element) => element.blocked);
        this.dataTableCopy = this.dataTable;
      }
    } else {
      this.dataTable = [];
    }
    this.mostrarData = this.dataTable.length > 0;
  }
  async activar() {
    if (this.dataActivar.length > 0) {
      const data = this.dataActivar.filter((element) => element.active == false)
      if (data.length == 0) {
        this.utils.openErrorAlert("No se pueden activar hay tarjetas seleciondas que estan activas")
        this.dataActivar.length = 0;
        this.handleCancel();
        return;
      }
      const response = await this.api.activate(this.dataActivar)
      if (response) {
        this.utils.openSuccessAlert("Tarjeta activada satisfactoriamente")
        setTimeout(() => {
          this.cargarTabla();
        }, 1000)
      }
    }
    this.dataActivar.length = 0;
    this.handleCancel();
  }
}
