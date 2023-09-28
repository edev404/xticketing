import { Component, Input, OnInit, EventEmitter, ViewChild, Output, OnDestroy } from '@angular/core';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { DatePipe } from '@angular/common';
import { Route, RoutesAllowedlist, TermsList } from '../../models/company';
import { Company } from '../../models/company';
import { LoginServiceService } from 'src/app/serivces/login-service/login-service.service';
import Swal from 'sweetalert2';
import { ComunicarService } from '../../service/comunicar.service';
import { TransporteService } from '../../service/transporte.service';


@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class TransfersComponent implements OnInit, OnDestroy {
  @ViewChild('closebutton') closebutton;
  // Variable para contar cada vez que vaya a agregar un tranbordo
  contadorTransbordos: number = 0;
  //Fechas
  startValue: Date | null = null;
  endValue: Date | null = null;
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  currentTransfer!: RoutesAllowedlist;
  timeTermModel!: TermsList;
  paymentTermModel!: TermsList;

  edit = false;
  titelCompany!: string;
  filterValue: string = '';
  listOfDataFilter!: Array<any>;
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  pageMain: number = 1;
  numberRowMain: number = 5;

  pageDestinos: number = 1;
  numberRowDestinos: number = 5;

  pageSolicitudes: number = 1;
  numberRowSolicitudes: number = 5;

  validateForm!: FormGroup;
  transferZone: number = 0;
  zonaCobertura: boolean = true;
  routes;
  currentCompanyInSystem;
  itemsNavsTransferSetting = [
    { name: 'Condicional tiempo', code: 'CT' }, { name: 'Cobros', code: 'CBR' }
  ];
  mondaySaturday: any;
  sundayFestive: any;
  paymentMondaySaturday: any;
  paymentSundayFestive: any;
  termsItems: any;
  paymentsItems: any;
  activateTabTransferConfig!: number | string | 'ERR_ASSERTION' | HTMLElement;
  dataTable: any = [];
  timeTerms: any[] = [];
  routeDestiny: any[] = [];
  paymentTerms: any[] = [];
  relatedZones: any[] = [];
  relatedZonesCopy: any[] = [];
  datePlaceholder: any = ['Fecha inicial', 'Fecha final']
  companies!: Company[];

  configDestinosTable: Array<any> = [];
  configDestinosTableCopy: Array<any> = [];
  requesTable: any[] = [];
  routesId!: number;
  IdCompany!: number;
  isEdit!: boolean;
  haveZone: boolean = true;
  dimensWindow = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  pass: boolean = false;
  routeTrasfer!: Route;

  TRANSFER_SETTING_ITEM_PATH = 'transfersettingitem';
  TRANSFER_PATH = 'transfer';
  RELATED_PATH = 'related';
  ZONE_PATH = 'zone';

  constructor(
    private api: TransporteService,
    private utils: UtilsService,
    private auth: LoginServiceService,
    private fb: FormBuilder,
    private _comunicarService: ComunicarService
  ) {
    this.validateForm = this.fb.group({
      comapy: [null, [Validators.required]],
      routeDestiny: [null, [Validators.required]],
      timeTerms: [null, [Validators.required]],
      paymentTerm: [null, [Validators.required]],
      coverageArea: [null, [Validators.required]],
      rangePickerValue: [null, [Validators.required]],
    });
    this.validateForm.get('coverageArea')?.disable();
  }
  ngOnDestroy(): void {
    this._comunicarService.setEvento(false)
    this.validateForm.reset();
  }

  async ngOnInit() {
    this.currentTransfer = {};
    this.activateTabTransferConfig = 'CT';
    this.currentCompanyInSystem = JSON.parse(localStorage.getItem('selectedCompany')!);
    await this.loadRelatedZone();
    if (this.haveZone) {
      await this.loadData();
      await this.loadSettingsItems();
    }
  }

  search(): void {
    let data!: Array<any>;
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.dataTable;
    }
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.listOfDataFilter.filter((current) => {
        return current.code.toUpperCase().includes(this.filterValue.toUpperCase()) ||
          current.name.toUpperCase().includes(this.filterValue.toUpperCase()) ||
          current.type.toUpperCase().includes(this.filterValue.toUpperCase());
      }
      );

      if (data) {
        this.dataTable = data;
      }
    } else {
      if (this.listOfDataFilter) {
        this.dataTable = this.listOfDataFilter;
        this.filterValue = ''
      }
    }
  }

  onChangeRowPerPage(event: number, type: string): void {
    switch (type) {
      case 'main':
        this.numberRowMain = event;
        this.pageMain = 1;
        break;
      case 'destinos':
        this.numberRowDestinos = event;
        this.pageDestinos = 1;
        break;
      case 'solicitudes':
        this.numberRowSolicitudes = event;
        this.pageSolicitudes = 1;
        break;
    }
  }

  onChangePage(event: number, type: string): void {
    switch (type) {
      case 'main':
        this.pageMain = event;
        break;
      case 'destinos':
        this.pageDestinos = event;
        break;
      case 'solicitudes':
        this.pageSolicitudes = event;
        break;
    }
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) return false;
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) return false;
    return endValue.getTime() <= this.startValue.getTime();
  };

  disabledDate = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return current < today;
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) this.endDatePicker.open();
    // console.log('handleStartOpenChange', open);
  }

  handleEndOpenChange(open: boolean): void {
    // console.log('handleEndOpenChange', open);
  }

  changeSettingTransferTabs(type) {
    this.activateTabTransferConfig = type;
  }

  addItemToRoute(form) {
    if (!this.currentTransfer.transferitemslist) this.currentTransfer.transferitemslist = [];
    // paymentTerm
    this.currentTransfer.transferpaymentitems = form.value.timeTerms.range;
    form.value.paymentTerm.iscreate = true;
    this.currentTransfer.transferitemslist.push(form.value.paymentTerm);
    // timeTermModel
    this.currentTransfer.transfertermitems = form.value.paymentTerm.range;
    form.value.timeTerms.iscreate = true;
    this.currentTransfer.transferitemslist.push(form.value.timeTerms);
  }

  getDataItemAdd(typeArg) {
    const data = {
      type: typeArg,
      firtsvalue: Number(typeArg === 'COBRO' ? this.paymentMondaySaturday : this.mondaySaturday),
      lastvalue: Number(typeArg === 'COBRO' ? this.paymentSundayFestive : this.sundayFestive)
    };
    return JSON.stringify(data);
  }

  setCreateToRoute(data) {
    if (this.utils.validateObject(data.transfer) && data.transfer.routesallowedlist) {
      data.transfer.routesallowedlist.forEach(value => value.iscreate = value.state);
    }
  }

  async cancelEdit() {
    localStorage.removeItem("trans")
    await this.loadData();
    this.routeDestiny.length = 0;
    this.relatedZones!.length = 0;
    this.configDestinosTable = [];
    this.configDestinosTableCopy = []
    this.requesTable = [];
    this.edit = false;
    this.validateForm.reset();
    this._comunicarService.setEvento(false)
  }

  async loadData() {
    const selectedCompany = JSON.parse(localStorage.getItem('selectedCompany')!);
    if (selectedCompany) {
      const resp = await this.api.loadTrasnferRoutes(this.utils.getBasicEndPoint(`transfer?companyid=${selectedCompany.id}`));
      if (resp.status === this.utils.successMessage) {
        this.dataTable = resp.data.routestransfer;
        this.listOfDataFilter = this.dataTable;
        this.dataTable = this.dataTable.sort((a: any, b: any) => b.havetransfer - a.havetransfer)
      } else if (resp.showAlert) {
        await this.utils.openErrorAlert(resp.message);
      }
    }
  }

  async loadCompanies() {
    const companies = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (companies) {
      this.companies = companies.companies.filter((company: Company) => company.active && company.typeId == 1);
    }
  }

  async loadTerms() {
    const resp = await this.api.getTransferSettingItems(this.utils.getBasicEndPoint(this.TRANSFER_SETTING_ITEM_PATH));
    if (resp.status === this.utils.successMessage) {
      this.timeTerms = resp.data.transfersettingitems.terms;
      this.paymentTerms = resp.data.transfersettingitems.payments;
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async loadSettingsItems() {
    const resp = await this.api.getTransferSettingItems(this.utils.getBasicEndPoint(this.TRANSFER_SETTING_ITEM_PATH));
    if (resp.status === this.utils.successMessage && resp.data) {
      const transfersetting = new Array(resp.data.transfersettingitems);
      transfersetting.forEach((element) => {
        this.termsItems = element.terms;
        this.paymentsItems = element.payments;
      });
    }
  }

  async loadRelatedRoutes(id) {
    const resp = await this.api.getRelatedRoutes(this.utils.getBasicEndPoint(`${this.TRANSFER_PATH}/${this.RELATED_PATH}?routeId=${id}`));
    if (resp.status === this.utils.successMessage) {
      this.requesTable = await resp.data.routestransfer.routesReleated;
      this.requesTable = this.requesTable.sort((a: any, b: any) => b.state - a.state)
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async configTrasfer(data) {
    this.routeTrasfer = data;
    this.edit = true;
    this.routesId = data.id;
    this.titelCompany = data.name;
    if (data.transfer && data.transfer.routesallowedlist) {
      this.configDestinosTable = [...data.transfer.routesallowedlist];
      this.configDestinosTable = this.configDestinosTable.sort((a: any, b: any) => b.status - a.status)
      this.configDestinosTable.forEach((element) => {
        if ((element.transferZoneItems ? element.transferZoneItems.length > 1 : false)) {
          element.transferZoneItems.forEach((elements, i) => {
            this.configDestinosTableCopy.push({
              "companyName": element.companyName,
              "name": element.name,
              "transferpaymentitems": element.transferitemsList.terms[0].range,
              "transfertermitems": element.transferitemsList.payments[0].range,
              "state": element.state,
              "transferId": element.transferId,
              "idruta": element.idruta,
              "status": element.status ? element.status : null,
              "validityStartDate": element.validityStartDate,
              "validityEndDate": element.validityEndDate,
              "transferZoneItems": [element.transferZoneItems[i]]
            })
          }
          )
        } else {
          if (element.transferPaymentItemsList) {
            element['transferpaymentitems'] = element.transferitemsList.terms[0].range;
            element['transfertermitems'] = element.transferitemsList.payments[0].range;

          }
          this.configDestinosTableCopy.push(element)
        }
      })
    }
    this.isEdit = data.havetransfer;
    await this.loadCompanies();
    await this.loadTerms();
    await this.loadRelatedRoutes(data.id);
    this._comunicarService.setEvento(true);
  }

  async saveData() {
    let resp;
    if (this.contadorTransbordos == 0) {
      this.utils.openInfoAlert('Debe agregar al menos una ruta destino.');
      return;
    }

    if (!this.routeTrasfer.transfer || (this.routeTrasfer.transfer.routesallowedlist && this.routeTrasfer.transfer.routesallowedlist.length <= 0) && this.routeTrasfer.havetransfer) {
      this.utils.openInfoAlert('Debe agregar al menos una ruta destino.');
      return;
    }

    if (!this.routeTrasfer.transfer) this.routeTrasfer.transfer = { routesallowedlist: [], routeid: this.routeTrasfer.id };

    if (this.utils.validateObject(this.routeTrasfer.transfer)) this.routeTrasfer.transfer.username = this.auth.getAuth().user.username;

    this.setCreateToRoute(this.routeTrasfer);
    if (this.isEdit) {
      resp = await this.api.updateTransfer(JSON.stringify(this.routeTrasfer.transfer), this.routeTrasfer.havetransfer, this.utils.getBasicEndPoint(this.TRANSFER_PATH));
    } else {

      resp = await this.api.createTransfer(JSON.stringify(this.routeTrasfer.transfer), this.utils.getBasicEndPoint(this.TRANSFER_PATH));
    }
    if (resp.status === this.utils.successMessage) {
      this.utils.openSuccessAlert('Transbordo configurado con éxito.').then(async () => {
        this.configDestinosTable = [];
        this.configDestinosTableCopy = [];
        this.routeDestiny.length = 0;
        this.relatedZones = this.relatedZonesCopy;
        this._comunicarService.setEvento(false);
        this.validateForm.reset()
        this.edit = false;
        await this.ngOnInit();
      })
    } else if (resp.showAlert) {
      this.utils.openErrorAlert(resp.message);
    }
  }

  async addData() {
    this.contadorTransbordos += 1;
    if (!this.validateForm.valid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return
    }

    let form = this.validateForm;
    let dateStart = this.utils.formatDate(form.value.rangePickerValue[0]);
    let dateEnd = this.utils.formatDate(form.value.rangePickerValue[1]);

    if (this.utils.isTheDateFromAfter(new Date(dateStart), new Date(dateEnd))) {
      this.utils.openInfoAlert('Favor ingrese fechas de vigencia válidas.');
      return;
    }

    if (form.value.routeDestiny.id === this.routesId) {
      await this.utils.openErrorAlert('No puede agregar esta ruta.');
      return;
    }
    let valor: boolean[] = [];
    const routExists = this.configDestinosTable.filter((value) => {
      if (value.transferZoneItems) {
        value.transferZoneItems.forEach(element => {
          valor.push(value.id === form.value.routeDestiny.id && (element ? element.zone : []) == this.validateForm.value.coverageArea.transferzone);
        });
      }
      return valor;
    });
    valor = valor.filter((element) => element != false)
    if (valor.length > 0) {
      this.utils.openInfoAlert('Ruta destino ya configurada.');
      return;
    }

    if (!this.routeTrasfer.transfer) {
      this.routeTrasfer.transfer = { routesallowedlist: [], routeid: this.routeTrasfer.id };
    }

    if (!this.routeTrasfer.transfer.routesallowedlist) {
      this.routeTrasfer.transfer.routesallowedlist = [];
    }

    if (!this.currentTransfer.transferZoneItems) {
      this.currentTransfer.transferZoneItems = []
    }

    if (!this.routeTrasfer.transfer.routeid) {
      this.routeTrasfer.transfer.routeid = this.routeTrasfer.id;
    }

    this.currentTransfer.code = form.value.routeDestiny.code;
    this.currentTransfer.process = form.value.routeDestiny.process;
    this.currentTransfer.state = true;
    this.currentTransfer.status = this.currentCompanyInSystem.id === form.value.comapy.id ? true : null;
    this.currentTransfer.id = form.value.routeDestiny.id;
    this.currentTransfer.companyName = form.value.comapy.name;
    this.currentTransfer.companyId = form.value.comapy.id;
    this.currentTransfer.name = form.value.routeDestiny.name;
    this.currentTransfer.validityStartDate = dateStart;
    this.currentTransfer.validityEndDate = dateEnd;
    this.currentTransfer.transferZoneItems!.push({ code: 'ZONA', iscreated: false, zone: form.value.coverageArea.transferzone });
    // this.currentTransfer.configId = this.routeTrasfer.configId;
    this.addItemToRoute(form);
    this.routeTrasfer.transfer.routesallowedlist!.push(this.currentTransfer)
    this.configDestinosTable = [...this.routeTrasfer.transfer.routesallowedlist!];
    this.configDestinosTableCopy = []
    this.configDestinosTable.forEach((element) => {
      if ((element.transferZoneItems ? element.transferZoneItems.length > 1 : false)) {
        element.transferZoneItems.forEach((elements, i) => {
          this.configDestinosTableCopy.push({
            "companyName": element.companyName,
            "name": element.name,
            "transfertermitems": element.transferitemsList.payments[0].range,
            "state": element.state,
            "status": element.status ? element.status : null,
            "transferId": element.transferId,
            "idruta": element.idruta,
            "transferpaymentitems": element.transferitemsList.terms[0].range,
            "validityStartDate": element.validityStartDate,
            "validityEndDate": element.validityEndDate,
            "transferZoneItems": [element.transferZoneItems[i]]
          })
        }
        )
      } else {
        this.configDestinosTableCopy.push(element)
      }
    })
    this.validateForm.reset();
    form.reset();
    this.currentTransfer = {};
  }

  async validateItemAdd(type, value1, value2) {
    // tslint:disable-next-line:triple-equals
    if ((value1 != null && (value1 != '' || value1 === 0))
      // tslint:disable-next-line:triple-equals
      && (value2 != null && (value2 != '' || value2 === 0))) {
      if (Number(value1) < 0 || Number(value2) < 0) {
        await Swal.fire(this.utils.getInfoModalOptions('¡No se permiten valores en negativo!'));
        return;
      }
      await this.addSettingItem(this.getDataItemAdd(type));
    } else {
      await Swal.fire(this.utils.getErrorModalOptions('¡Por favor complete todos los campos!'));
    }
  }

  async saveConfigTransfer() {
    if (this.termsItems.length > 0) {
      if (this.paymentsItems.length > 0) {
        this.closebutton.nativeElement.click();
      } else {
        await this.utils.openInfoAlert('¡Debe adicionar al menos un cobro!');
      }
    } else {
      await this.utils.openInfoAlert('¡Debe adicionar al menos una condicional de tiempo!');
    }
  }

  async addSettingItem(data) {
    const response = await this.api.addTermTimeItem(data, this.utils.getBasicEndPoint(this.TRANSFER_SETTING_ITEM_PATH));
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(response.message);
      await this.loadSettingsItems();
      this.mondaySaturday = null;
      this.sundayFestive = null;
      this.paymentMondaySaturday = null;
      this.paymentSundayFestive = null;
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async deleteSettingItem(index) {
    const response = await this.api.deleteSettingItem(this.utils.getBasicEndPoint(`transfersettingitem/${index}`));
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(response.message);
      await this.loadSettingsItems();
    } else if (response.showAlert) {
      if (response.message == 'No puede eliminar este item porque un transbordo lo tiene asociado.') {
        await this.utils.openErrorAlert('No es posible eliminar esta configuración debido a que está asociada a un transbordo.');
        return
      }
      await this.utils.openErrorAlert(response.message);
    }
  }

  async loadRoutesCompanies() {
    this.validateForm.controls['routeDestiny'].setValue({});
    let IdCompany = this.validateForm.value.comapy.id;
    if (IdCompany) {
      const resp = await this.api.listRoutesToTransfer(this.utils.getBasicEndPoint(`companies/${IdCompany}/routes?applyToTransfer=${true}`));
      if (resp.status === this.utils.successMessage) {
        if (resp.data.routes) {
          this.routeDestiny = resp.data.routes;
          this.routeDestiny = this.routeDestiny.filter((element) => element.id != this.routeTrasfer.id);
        }
      } else {
        await this.utils.openErrorAlert(resp.message);
      }
    }
  }

  async changeStateRelated(data) {
    if (new Date(data.validityEndDate) < new Date()) {
    }
    const resp = await this.api.changeStateRelate(this.utils.getBasicEndPoint(`transfer/${this.RELATED_PATH}/route-transfer/change-state?routeTransferId=${data.idruta}&status=${!data.state}&idTranfer=${data.transferId}`));
    if (resp.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert("Estado de transbordo actualizado");
      await this.loadData();
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
      await this.loadData();
    }
  }

  async changeStateTransfer(data: RoutesAllowedlist) {
    if (data.status == null) { // arreglar
      await this.utils.openInfoAlert('La solicitud no se puede deshabilitar en este momento, ya que se encuentra en estado pendiente.');
      return
    }
    data.state = !data.state;
    await this.utils.openSuccessAlert('Estado cambiado correctamente');
  }

  async approveOrRejectTransshipment(data: RoutesAllowedlist) {
    await Swal.fire(this.utils.getQuestionModalOptions('¿Deseas aprobar esta ruta?', 'El estado pasará a ser aprobado o rechazado.', 'Rechazar', 'Aprobar'))
      .then(async (result: any) => {
        if (result.dismiss == "close") {
          return
        }
        const response = await this.api.approveOrRejectTransshipment(this.utils.getBasicEndPoint(`${this.TRANSFER_PATH}/${this.RELATED_PATH}/change-state`), { transferId: data.transferId, routeId: this.routeTrasfer.id, state: result.isConfirmed });
        if (response.status === this.utils.successMessage) {
          await this.utils.openSuccessAlert(`Transbordo ${result.isConfirmed ? 'aprobado ' : 'rechazado '}correctamente`)
            .then(async res => {
              await this.loadRelatedRoutes(this.routeTrasfer.id);
            });
        } else if (response.showAlert) {
          await this.utils.openErrorAlert(response.message);
        }
      });
  }

  async loadRelatedZone() {
    const selectedCompany = JSON.parse(localStorage.getItem('selectedCompany')!);
    if (!selectedCompany) return;

    const resp = await this.api.getRelatedZone(this.utils.getBasicEndPoint(`${this.ZONE_PATH}/transfers?empresa=${selectedCompany.id}`));
    if (resp.status === this.utils.successMessage) {
      if (!resp.data.service.length) await this.utils.openInfoAlert('¡La empresa de transporte no cuenta con zonas de transbordo autorizadas!');
      this.relatedZones = resp.data.service;
      this.relatedZonesCopy = this.relatedZones;
    } else {
      await this.utils.openInfoAlert('¡No hay zonas configuradas en la aplicación!').then(() => {
        this.haveZone = false;
      });
      // console.log(resp.message); PARA DEBUG

    }
  }

  async changeRutas(event: any) {
    if (event) {
      this.validateForm.get('coverageArea')?.enable()
      this.relatedZones = await this.relatedZonesCopy;
      this.relatedZones = await this.relatedZones.filter((element) => element.destino == event.id && element.origen == this.routesId)
      this.transferZone = this.relatedZones.length > 0 ? this.relatedZones[0].transferzone : null;
      this.zonaCobertura = (this.relatedZones.length == 0 || this.relatedZones == null) ? true : false;
      if (this.zonaCobertura) {
        this.validateForm.controls['coverageArea']?.disable()
        this.validateForm.controls['coverageArea']?.updateValueAndValidity()
      } else {
        this.validateForm.controls['coverageArea']?.enable()
        this.validateForm.controls['coverageArea']?.updateValueAndValidity()
      }
      if (this.transferZone == 0 || !this.transferZone) {
        this.validateForm.get('coverageArea')?.setValue(null)
      }
      return;
    }
    this.relatedZones!.length = 0;
    this.transferZone = 0;
    this.validateForm.get('coverageArea')?.setValue(null)
  }
}
