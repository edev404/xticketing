import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ClearingServiceService } from '../../services/clearing-service.service';
import { LoginServiceService } from 'src/app/serivces/login-service/login-service.service';
import { ApiServiceUserAdmin } from 'src/app/modules/admin/admin/user/service/user.admin.api';
import { Finding } from '../../models/models';

@Component({
  selector: 'app-finding',
  templateUrl: './finding.component.html',
  styleUrls: ['./finding.component.scss']
})
export class FindingComponent implements OnInit {
  @Output() switchPanel = new EventEmitter<any>();
  @Input() presettlementId!: number;
  @Input() isSettlement!: boolean;


  validateForm!: FormGroup;
  currentFinding: Finding = {};

  showOtherInputs: boolean = false;

  findings!: any[];
  userList!: any[];
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  page: number = 1;
  numberRow: number = 5;

  listOfData

  // path
  CLEARING_PATH = 'clearing';

  constructor(
    private fb: FormBuilder,
    public util: UtilsService,
    public api: ClearingServiceService,
    private apiUser: ApiServiceUserAdmin,
    private auth: LoginServiceService,
  ) {
    this.validateForm = this.fb.group({
      hallasgos: [null],
      descripcion: [null],
      responsable: [null],
      soluPropuesta: [null],
      fechaEstimada: [null],
      soluEjecutada: [null],
      fechaSolucion: [null],
      solucionadoPor: [null]
    });
   }

  async ngOnInit() {
    await this.loadData();
    await this.loadFindingTypes();
    await this.loadUser();
  }

  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

  async loadData() {
    const resp = await this.api.findDiscoverList(this.util.getClearingEndPoint(`${this.CLEARING_PATH}/${this.presettlementId}/discovers`));
    if (resp.status === this.util.successMessage) {
      this.listOfData = resp.data.discovers;
    } else if (resp.showAlert) {
      await this.util.openErrorAlert(resp.message);
    }
  }

  async loadFindingTypes() {
    const resp = await this.api.findDiscoverTypes(this.util.getClearingEndPoint(`${this.CLEARING_PATH}/discover-types`));
    if (resp.status === this.util.successMessage) {
      this.findings = resp.data.discoverTypes;
    } else if (resp.showAlert) {
      await this.util.openErrorAlert(resp.message);
    }
  }

  async loadUser() {
    const resp = await this.apiUser.getListUsers(this.util.getBasicEndPoint('users'));
    if (resp.status === this.util.successMessage) {
      this.userList = resp.data.users;
    } else if (resp.showAlert) {
      await this.util.getErrorModalOptions(resp.message);
    }
  }

  async saveFinding() {
    this.currentFinding.solved = this.showOtherInputs;
    this.createObj(this.validateForm.value);
    // console.log(this.currentFinding);
    
    let response;
    if (this.currentFinding.id) {
      response = await this.api.update(this.util.getClearingEndPoint(`${this.CLEARING_PATH}/${this.presettlementId}/discovers/${this.currentFinding.id}`),
        JSON.stringify(this.currentFinding));
    } else {
      const data = this.auth.getAuth();
      this.currentFinding.creator = {id: data.user.id};
      response = await this.api.save(this.util.getClearingEndPoint(`${this.CLEARING_PATH}/${this.presettlementId}/discovers/`), JSON.stringify(this.currentFinding));
    }
    if (response.status === this.util.successMessage) {
      await this.util.openSuccessAlert(this.currentFinding.id ? 'Hallazgo actualizado correctamente' : 'Hallazgo creado correctamente');
      await this.loadData();
      this.validateForm.reset();
      this.currentFinding = {};
      this.showOtherInputs = false;
    } else if (response.showAlert) {
      await this.util.openErrorAlert(response.message);
    }

  }

  cancelConfig(){
    this.switchPanel.emit(false);
  }

  setCurrentFinding(data) {
    if (this.isSettlement) return;
    this.showOtherInputs = true;
    this.currentFinding.id = data.id;
    this.currentFinding.clearingId = data.clearingId;
    this.validateForm.controls['hallasgos'].setValue(this.findings.filter(value => value.id === data.type.id)[0]);
    this.validateForm.controls['descripcion'].setValue(data.description);
    this.validateForm.controls['responsable'].setValue(this.userList.filter(value => value.id === data.responsible.id)[0]);
    this.validateForm.controls['soluPropuesta'].setValue(data.proposalSolution);
    this.currentFinding.creator = data.creator;
    this.currentFinding.date = this.util.formatDate(new Date());

    let fecha = new Date(data.proposalDate) // se le suma un dia debido a que ngzorro le restaba uno
    this.validateForm.controls['fechaEstimada'].setValue(new Date(fecha.setDate(fecha.getDate()+1)));
  }

  createObj(pojo) {
    this.currentFinding.type = pojo.hallasgos;
    this.currentFinding.description = pojo.descripcion;
    this.currentFinding.responsible = pojo.responsable;
    this.currentFinding.proposalSolution = pojo.soluPropuesta;
    this.currentFinding.proposalDate = this.util.formatDate(pojo.fechaEstimada);
    this.currentFinding.solution = pojo.soluEjecutada;
    this.currentFinding.solutionDate = this.util.formatDate(pojo.fechaSolucion);
    this.currentFinding.solutioner = pojo.solucionadoPor;
  }

}
