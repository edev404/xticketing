import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiServiceCardMethodPayment } from '../../services/card.payment-methods.api';
import { RequestType } from '../../models/RequestType';
import { Registry } from '../../models/Registry';
import { Company } from 'src/app/modules/transporte/models/company';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';
import { InitUser } from '../../models/InitUser';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { TransporteService } from 'src/app/modules/transporte/service/transporte.service';

@Component({
  selector: 'app-request-initialization',
  templateUrl: './request-initialization.component.html',
  styleUrls: ['./request-initialization.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class RequestInitializationComponent implements OnInit {

  navModules = [];
  isActive = '';
  habilitarCantidad: boolean = true;
  editarInicializacion: boolean = false;
  form: FormGroup;
  validateForm!: FormGroup;
  stock: number = 0;
  registryCode!: string;
  purchaseBatch!: string;
  cantidadSup: boolean = false;
  /** Tipo de solicitud*/
  requestTypes: RequestType[] = [];
  requestTypeHash;
  requestType!: string

  // Lote de Compra
  purchaseBatches: any[] = []

  /** Select de compañía para obtener las rutas y conductores */
  companies: Company[] = [];
  selectedCompany;

  /** opciones para Select de rutas y conductores*/
  routes: any[] = []
  drivers: any[] = []

  selectedRoutes: any[] = []
  selectedDrivers: any[] = []

  quantity?: number;

  // Usuario inicializador
  initUsers: InitUser[] = []

  // Mapping
  mappingList: any[] = []

  // Data de envio
  assignedUser;
  selectedRequestType;
  selectedMapping;

  constructor(
    private fb: FormBuilder,
    private utils: UtilsService,
    private _api: AuthServiceService,
    private api: ApiServiceCardMethodPayment,
    private transport_api: TransporteService,
    private router: Router
  ) {
    this.form = this.fb.group({
      selectedRoutes: new FormArray([]),
      selectedDrivers: new FormArray([]),
    });
  }

  get driversFormArray() {
    return this.form.controls["selectedDrivers"] as FormArray;
  }
  get routesFormArray() {
    return this.form.controls["selectedRoutes"] as FormArray;
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      cantidad: [{ value: '', disabled: true }, [Validators.required]],
      assignedUser: [null, [Validators.required]],
      selectedRequestType: [null, [Validators.required]],
      registryCode: [{ value: '', disabled: true }, [Validators.required]],
      purchaseBatch: [null, [Validators.required]],
      selectedMapping: [null, [Validators.required]],
      compania: [null]
    });
    this.chargeOptions()
    this.cargarDataInicial();
    this.getRequestTypes();
    this.loadMappingList();
    this.getSelectedNavModule();

    this.loadCompanies();
    this.loadInitUsers();

    this.loadInitializationRequestList();
    this.validateForm.get("cantidad")?.setValue(this.selectedRoutes.length)
    const data = JSON.parse(localStorage.getItem("inicializacion")!)
    if (data) {

    }
  }

  cambiarCantidad() {
    this.cantidadSup = false;
  }
  async cargarDataInicial() {
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));
    const idEntity = entity.entities[0].id;
    this.loadPurchaseBatches()

    const responseDashboard = await this.api.getDashboard(idEntity);
    if (responseDashboard) {
      // this.stock = responseDashboard.data.cardsDashboard[0].total;
    }
  }
  cambiarLote(evento) {
    if (evento) {
      this.purchaseBatches.forEach((element) => {
        if (element.id == evento) {
          this.stock = element.restante
        }
      })
    } else {
      this.stock = 0;
    }

  }

  async loadPurchaseBatches() {
    const response = await this.api.getListForInit()
    if (response) {
      this.purchaseBatches = response.data.batches;
      this.purchaseBatches = this.purchaseBatches.filter((element) => element.restante)
      if (this.purchaseBatches.length == 1) {
        this.validateForm.get('purchaseBatch')?.setValue(this.purchaseBatches[0].id)
      }
    }
  }
  async getRequestTypes() {
    const response = await this.api.getRequestType();
    if (response) {
      if (response.data) {
        this.requestTypes = response.data.requestTypes;
        const tempHash = new Map();
        this.requestTypes.forEach(function (valor, indice, array) {
          tempHash.set(valor.code, valor);
        });
        this.requestTypeHash = tempHash
      }
    }
  }

  setActions(object) {
    this.utils.setActions(JSON.stringify(object));
  }

  chargeOptions() {
    const menuOptions = JSON.parse(String(localStorage.getItem('actionsByModules')));
    if (menuOptions) {
      this.navModules = menuOptions[0].actions;
      this.setActions(menuOptions[0].actions[0].subActions);
      this.requestType = 'PASSENGER'
    }

  }

  public getSelectedNavModule() {
    const m = this.router.url.split('/');
    if (m.length > 2) {
      this.isActive = m[3];
    }
  }

  async loadCompanies() {
    const companies = JSON.parse(String(localStorage.getItem('selectedEntity')));
    if (companies) {
      //TODO: consultar solo las activas
      //this.companies = companies.companies.filter((company: Company) => company.active && company.typeId == 1);
      this.companies = companies.companies.filter((company: Company) => company.typeId == 1);
    }
  }
  async changeRequestOptions() {
    if (this.requestType !== 'PASSENGER') {
      if (this.requestType === 'ROUTE') {
        const response = await this.transport_api.listRoutes(this.utils.getBasicEndPoint(`companies/${this.selectedCompany}/routes`))
        this.routes = response?.data?.routes;
        this.routesFormArray.clear()
        this.selectedRoutes = [];
        this.routes?.forEach(() => this.routesFormArray.push(new FormControl(false)));
      }
      if (this.requestType === 'DRIVER') {
        const response = await this.api.getDrivers(this.selectedCompany)
        this.drivers = response?.data?.drivers;
        this.driversFormArray.clear()
        this.selectedDrivers = [];
        this.drivers?.forEach(() => this.driversFormArray.push(new FormControl(false)));
      }
    }
  }
  async setSelectedCompany(companyId) {
    const company = this.companies.find(company => company.id == companyId);
    if (company) {
      this.selectedCompany = companyId;
      localStorage.setItem('selectedCompany', JSON.stringify(company));
      await this.changeRequestOptions()
    }
  }

  updateQuantity(event, object: any) {
    if (event.target.checked) {
      if (this.requestType === 'ROUTE') {
        this.quantity = this.routesFormArray.value.filter(x => x).length
        this.selectedRoutes.push(object)
      }
      if (this.requestType === 'DRIVER') {
        this.quantity = this.driversFormArray.value.filter(x => x).length
        this.selectedDrivers.push(object)
      }
    }
    else {
      if (this.requestType === 'ROUTE') {
        this.quantity = this.routesFormArray.value.filter(x => x).length
        this.selectedRoutes.forEach((element, index) => {
          if (element.id == object.id) delete this.selectedRoutes[index];
        });
      }
      if (this.requestType === 'DRIVER') {
        this.quantity = this.driversFormArray.value.filter(x => x).length
        this.selectedDrivers.forEach((element, index) => {
          if (element.id == object.id) delete this.selectedDrivers[index];
        });
      }
    }
    this.selectedRoutes = this.selectedRoutes.filter(elemento => elemento !== 'empty');
    this.selectedDrivers = this.selectedDrivers.filter(elemento => elemento !== 'empty');

    this.requestType === 'ROUTE' ? this.validateForm.get("cantidad")?.setValue(this.selectedRoutes.length) : this.validateForm.get("cantidad")?.setValue(this.selectedDrivers.length)
  }
  async loadInitUsers() {
    const response = await this.api.getInitUsers();
    if (response) {
      this.initUsers = response?.data?.initUsers;
      // Validamos que los usuarios este activos
      this.initUsers = this.initUsers.filter((element) => element.active != false)
    }
  }
  async loadMappingList() {
    const response = await this._api.getLista('MAPPINGS');
    this.mappingList = response;
    this.validateForm.get("selectedMapping")?.setValue(this.mappingList[0].code)
  }

  getSelectedEntity() {
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));
    if (entity) {
      const idEntity = entity.entities[0].id;
      return idEntity;
    }
    return null;
  }

  async loadInitializationRequestList() {
    const response = await this.api.getInitializationRequestList(this.getSelectedEntity())
    this.validateForm.get("registryCode")?.setValue(response.data.success.length + 1)
  }

  async saveData() {
    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    const filteredDrivers = this.selectedDrivers.filter(x => x)
    const filteredRoutes = this.selectedRoutes.filter(x => x)

    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')))
    const idEntity = entity.entities[0].id
    const data: Registry | undefined = this.purchaseBatches.find((element) => element.id == this.validateForm.value.purchaseBatch)
    if (this.validateForm.get('cantidad')!.value == 0) {
      this.utils.openInfoAlert("La cantidad debe ser mayor a 0");
      return;
    }
    if (this.validateForm.get("cantidad")!.value > this.stock) {
      this.utils.openInfoAlert("La cantidad debe ser inferior a la cantidad de lote disponible");
      this.cantidadSup = true;
      return
    }
    if (this.validateForm.valid) {
      const json = {
        requested_quantity: this.validateForm.get("cantidad")!.value,
        assigned_user: this.validateForm.value.assignedUser,
        request_type: this.requestTypeHash.get(this.validateForm.get("selectedRequestType")!.value),
        drivers: this.requestType === 'DRIVER' ? filteredDrivers : [],
        routes: this.requestType === 'ROUTE' ? filteredRoutes : [],
        registry_code: this.validateForm.value.registryCode,
        purchase_batch: this.validateForm.value.purchaseBatch,
        id_mapping: this.validateForm.value.selectedMapping,
        id_entity: idEntity
      }
      const response = await this.api.createInitializationRequest(json);
      if (response) {
        this.router.navigateByUrl("/main/cards/send_request");
      }
    } else {
      this.utils.openErrorAlert("Debe llenar todos los campos")
    }

  }

  async setRequestType(requestType: string) {
    this.requestType = requestType;
    const request: RequestType | undefined = this.requestTypes.find((element: RequestType) => element.code == requestType)
    const cantidadControl = this.validateForm.get('cantidad') as FormControl;
    if (request?.label == "Pasajero") {
      this.habilitarCantidad = false;
      this.validateForm.get("cantidad")?.setValue(0)
      cantidadControl.enable()
    } else {
      this.habilitarCantidad = true;
      this.validateForm.get("cantidad")?.setValue(0)
      this.selectedRoutes.length = 0;
      this.selectedDrivers.length = 0;
      cantidadControl.disable()
    }

    // console.log(this.selectedCompany)
    if (this.selectedCompany) {
      await this.changeRequestOptions()
    }
    if (requestType !== "PASSENGER") {
      this.quantity = 0
    }
  }
}
