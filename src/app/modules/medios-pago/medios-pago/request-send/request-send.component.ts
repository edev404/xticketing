import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { InitializationRequest } from '../../models/InitializationRequest';
import { InitUser } from '../../models/InitUser';
import { ApiServiceCardMethodPayment } from '../../services/card.payment-methods.api';
import { CancellationReason } from '../../models/CancellationReason';
import { ReasignReasons } from '../../models/ReasignReasons';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-send',
  templateUrl: './request-send.component.html',
  styleUrls: ['./request-send.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class RequestSendComponent implements OnInit {
  // Filter
  filterValueTable: string = '';
  // Estado
  checkbox = true;
  //Cancelation variables
  cancelationReasons: CancellationReason[] = [];
  selecterRequest!: InitializationRequest
  idReason!: number
  cancellationComment!: string
  idReasignReason!: number
  reasignedUser!: string
  reasignedComment!: string

  dataSeleccionada: any;
  dataActivar: any[] = [];

  dataTable: InitializationRequest[] = []
  dataTableCopy: InitializationRequest[] = []
  mostrarData!: boolean;

  reasignReasons: ReasignReasons[] = []

  // PAGINATION
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  numberRow: number = 5;
  page: number = 1;

  // TRANSFERENCIA
  currentInitUser!: InitUser
  filteredInitUsers: InitUser[] = []

  //MODALES
  isVisible = false;
  Ver_analisis = false;
  isVisibleCancel = false;
  isVisibleReasing = false;
  //Variables de reasignación
  initUsers: InitUser[] = []

  constructor(
    private api: ApiServiceCardMethodPayment,
    private utils: UtilsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadInitializationRequestList()
    this.loadCancellationReasonList()
    this.loadInitUsers()
    this.loadReasignReasons()
  }

  openModalCancel(selectedRequest) {
    this.isVisibleCancel = true;
    this.selecterRequest = selectedRequest
  }
  openModalReasign(selectedRequest) {
    this.isVisibleReasing = true;
    this.selecterRequest = selectedRequest
    this.currentInitUser = this.initUsers.filter(x => x.user === this.selecterRequest.assigned_user)[0]
    this.filteredInitUsers = this.initUsers.filter(x => x.user !== this.selecterRequest.assigned_user)
  }

  // paginado
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
        (current: InitializationRequest) => {
          return this.utils.validateObject(current.id) && current.id!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
          this.utils.validateObject(current.status) && current.status!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())

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
  getSelectedEntity() {
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));
    if (entity) {
      const idEntity = entity.entities[0].id;
      return idEntity;
    }
    return null;
  }
  asignInitUsers() {
    this.dataTable.forEach(init => { init.initUser = this.initUsers.filter(y => y.user === init.assigned_user)[0] })
  }
  async loadReasignReasons() {
    const response = await this.api.getReasignReasons()
    if (response) {
      this.reasignReasons = response.data.reasign_reasons
    }
  }
  async loadInitializationRequestList() {
    const response = await this.api.getInitializationRequestList(this.getSelectedEntity())
    this.dataTable = response.data.success
    this.dataTableCopy = this.dataTable

    if (this.initUsers.length > 0) {
      this.asignInitUsers()
    }
    this.mostrarData = this.dataTable.length > 0;
  }

  async loadInitializationRequestListFiltered(filter: string) {
    if (filter != undefined && filter != '') {
      const response = await this.api.getInitializationRequestFilteredList(filter, this.getSelectedEntity())
      this.dataTable = response.data.requests
      if (this.initUsers.length > 0) {
        this.asignInitUsers()
      }
    } else {
      this.dataTable = []
    }
  }

  async loadCancellationReasonList() {
    const response = await this.api.getCancellationReasonList();
    if (response) {
      this.cancelationReasons = response.data.cancelation_reasons
    }
  }

  ngOnChanges(): void {
    if (!this.dataTableCopy) {
      this.dataTableCopy = this.dataTable;
    }
    this.search();
  }
  async loadInitUsers() {
    const response = await this.api.getInitUsers()
    if (response) {
      this.initUsers = response.data.initUsers
      if (this.dataTable.length > 0) {
        this.asignInitUsers();
        return;
      }
    }
  }

  editarInicializacion(data) {
    localStorage.setItem("inicializacion", JSON.stringify(data));
    this.router.navigate(['/main/cards/new_request']);
  }

  async reasign() {
    const body = new HttpParams()
      .set('id_reasign_reason', this.idReasignReason + '')
      .set('reasigned_user', this.reasignedUser + '')
      .set('comment', this.reasignedComment);
    const response = await this.api.reasignRequest(this.selecterRequest.id!, body)
    if (response.status == "success") {
      this.utils.openSuccessAlert("Reasignacion exitosa")
      this.isVisibleReasing = false;
      this.idReasignReason = 0;
      this.reasignedUser = '';
      this.reasignedComment = '';
      this.loadInitializationRequestList();
    }
  }

  async cancelRequest() {
    const body = new HttpParams()
      .set('id_reason', this.idReason + '')
      .set('comment', this.cancellationComment);
    const response = await this.api.cancelRequest(this.selecterRequest.id!, body)
    if (response) {
      this.loadInitializationRequestList();
      if (response.status == "success") {
        this.utils.openSuccessAlert("Operacion cancelada exitosa")
        this.isVisibleCancel = false;
        this.cancellationComment = '';
        this.idReason = 0;
      }
    }
  }
}
