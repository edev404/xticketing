import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { CardClass } from '../../models/CardClass';
import { Reason } from '../../models/Reason';
import { Registry } from '../../models/Registry';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RegistryDetail } from '../../models/RegistryDetail';
import { ApiServiceCardMethodPayment } from '../../services/card.payment-methods.api';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class RegisterComponent implements OnInit {

  validateForm!: FormGroup;
  estadoEditar: boolean = false;
  // Fecha mínima permitida (2 meses atrás)
  minDate!: Date;
  disabledDate!: (current: Date) => boolean;

  displayStyle = "none";

  providers: Provider | any

  cardClasses: any[] = []

  registryData;
  registryDataCopy;

  registryEditable!: Registry | any

  registryDetails: RegistryDetail[] = []
  registryDetailReasons: Reason[] = []

  //REGISTRY DETAIL INPUT VARIABLES
  registryDetailDate!: Date | any;;
  registryDetailQuantity!: number | any;;
  registry;

  // PAGINATION
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  numberRow: number = 5;
  page: number = 1

  purchaseDate!: Date | any;
  inventoryIngressDate!: Date | any;

  provider;
  cardClass;
  quantity;
  soc;

  filterValueTable: string = '';

  date = null;

  //MODALES
  isVisible = false;
  isVisibleDetails = false;
  isVisibleDetailsMotivo = false;
  Ver_analisis = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiServiceCardMethodPayment,
    private _api: AuthServiceService,
    public datepipe: DatePipe,
    public utils: UtilsService,
  ) {
    this.validateForm = this.fb.group({
      purchaseDate: [null, [Validators.required]],
      inventoryIngressDate: [null, [Validators.required]],
      provider: [null, [Validators.required]],
      cardClass: [null, [Validators.required]],
      registryDetailReason: [''],
      registryDetailObservation: [''],
      quantity: [null, [Validators.required]],
      soc: [null, [Validators.required]],
    });
    this.minDate = new Date();
    this.minDate.setMonth(this.minDate.getMonth() - 2);

  }

  async ngOnInit(): Promise<void> {
    // Función para deshabilitar fechas anteriores a la fecha mínima
    this.disabledDate = (current: Date): boolean => {
      return current < this.minDate || current > new Date();
    }
    await this.load();
  }

  // Función para obtener el estado de validación del control en la plantilla
  getFormControlValidateStatus(controlName: string): string {
    const control = this.validateForm.get(controlName);

    if (control?.touched) {
      return control?.invalid ? 'error' : 'success';
    }

    return '';
  }

  search() {
    let data: any[];
    if (this.filterValueTable || (this.filterValueTable && this.filterValueTable.trim() != '')) {
      data = this.registryDataCopy.filter(
        (current: any) => {
          return this.utils.validateObject(current.provider_name) && current.provider_name!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
          // this.utils.validateObject(current.description) && current.description!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
        }
      );
      if (data) {
        this.registryData = data;
      }
    } else {
      if (this.registryDataCopy) {
        this.registryData = this.registryDataCopy;
        this.filterValueTable = ''
      }
    }
  }

  // paginado
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }
  // onChangeFecha(event) {
  //   this.message = false;
  //   // Obtener la fecha actual
  //   const currentDate = new Date();
  //   // Restar 2 meses a la fecha actual
  //   const minDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, currentDate.getDate());
  //   // Verificar si la fecha seleccionada es futura o está fuera del rango permitido
  //   if (this.purchaseDate > currentDate || this.purchaseDate < minDate) {
  //     // Reiniciar el valor del control de fecha
  //     this.message = true;
  //     this.purchaseDate = '';
  //   }
  // }
  onChangePage(event): void {
    this.page = event;
  }

  async load() {
    this.loadProviders()
    this.loadCardClasses()
    this.loadRegistryData()
    this.loadRegistryDetailReasons()
  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.registryData, event.previousIndex, event.currentIndex);
  }


  editRegistry(data: Registry) {
    this.registry = data;
    this.registryEditable = data

    this.purchaseDate = new Date(this.registryEditable.purchasedate);
    this.inventoryIngressDate = new Date(this.registryEditable.inventorydate);
    this.provider = this.registryEditable.idprovider;
    this.cardClass = this.registryEditable.idcardclass;
    this.quantity = this.registryEditable.quantity;
    this.soc = this.registryEditable.soc;

    this.showModal()
    this.estadoEditar = true;
    if (this.estadoEditar) {
      this.validateForm.controls['registryDetailReason'].addValidators(Validators.required);
      this.validateForm.controls['registryDetailReason'].updateValueAndValidity()
      return;
    }
  }

  async loadRegistryDetailReasons() {
    const response = await this.api.getRegistryDetailReasons();
    this.registryDetailReasons = response.data.reasons
  }

  async loadCardClasses() {
    const response = await this._api.getLista('CLASES');
    if (response) {
      this.cardClasses = response
    }

  }

  async loadProviders() {
    const response = await this.api.getProviders();
    if (response) {
      this.providers = response?.data?.companies.filter((element) => element.active);
    }
  }

  async loadRegistryData() {
    this.registryData = [];
    const response = await this.api.getRegistryList(this.getSelectedEntity());
    if (response) {
      this.registryData = response.data.success
      this.registryData = this.registryData.sort((a: any, b: any) => (a.purchasedate!.valueOf() > b.purchasedate!.valueOf() ? 1 : -1))
      this.registryDataCopy = this.registryData;
    }
  }

  async loadDetailData(registry: Registry | any) {
    const response = await this.api.getRegistryDetail(registry.id);
    this.registry = registry
    this.registryDetails = response.data.detail
    this.registryDetails.forEach(x => {
      const reason = this.registryDetailReasons.filter(reason => reason.id == x.id_reason)[0]
      x.reason = reason
    })
  }

  async saveNewRegistryDetail() {
    const body = new HttpParams()
      .set(`observation`, this.validateForm.value.registryDetailObservation)
      .set(`reason`, this.validateForm.value.registryDetailReason)
      .set(`quantity`, this.quantity)
      .set(`date`, this.datepipe.transform(this.inventoryIngressDate, 'yyyy-MM-dd')!);
    const response = await this.api.saveNewRegistryDetails(this.registry.id, body);
    this.loadDetailData(this.registry)
    this.handleCancel();
    this.handleCancelMotivo();
  }

  getSelectedEntity() {
    return JSON.parse(localStorage.getItem('selectedEntity')!).entities[0].id;
  }

  async saveRegistro() {
    if (!this.registryEditable) {
      if (this.validateForm.valid) {
        if (this.quantity <= 0) {
          this.utils.openInfoAlert("La cantidad debe ser mayor a 0");
          return;
        }
        const body = new HttpParams()
          .set(`purchasedate`, this.datepipe.transform(this.purchaseDate, 'yyyy-MM-dd')!)
          .set(`inventorydate`, this.datepipe.transform(this.inventoryIngressDate, 'yyyy-MM-dd')!)
          .set(`provider`, this.provider)
          .set(`cardclass`, this.cardClass)
          .set(`quantity`, this.quantity)
          .set(`soc`, this.validateForm.value.soc)
          .set(`entity`, this.getSelectedEntity());
        const response = await this.api.createRegistry(body);
        if (response) {
          if (response?.status === 'success') {
            //this.modalRefRegistry.hide()
            this.utils.openSuccessAlert('Lote creado correctamente');
            this.loadRegistryData();
            this.newRegistry();
            this.handleCancel()
            this.validateForm.reset();
            return;
          }
          this.utils.openInfoAlert(response.message).then(() => {
            this.loadRegistryData();
            this.newRegistry();
            this.handleCancel()
            this.validateForm.reset();
          });
        }
      } else {
        Object.values(this.validateForm.controls).forEach((control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
            return;
          }
        });
      }
    } else {
      console.log(this.validateForm.value)
      if (this.validateForm.valid) {
        if (this.quantity <= 0) {
          this.utils.openInfoAlert("La cantidad debe ser mayor a 0");
          return;
        }
        const body = new HttpParams()
          .set(`purchasedate`, this.datepipe.transform(this.purchaseDate, 'yyyy-MM-dd')!)
          .set(`inventorydate`, this.datepipe.transform(this.inventoryIngressDate, 'yyyy-MM-dd')!)
          .set(`provider`, this.provider)
          .set(`cardclass`, this.cardClass)
          .set(`quantity`, this.quantity)
          .set(`soc`, this.soc)
          .set('id', this.registryEditable.id + '')
        const response = await this.api.updateRegistry(body);
        if (response) {
          this.utils.openSuccessAlert('Registro editado correctamente');
          //this.modalRefRegistry.hide()
          this.saveNewRegistryDetail();
          this.loadRegistryData();
          this.handleCancel()
          this.newRegistry();
          this.validateForm.reset();
        }
      } else {
        Object.values(this.validateForm.controls).forEach((control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
            return;
          }
        });
      }
    }
    // this.handleCancel()
  }

  async newRegistry() {
    this.registryEditable = null
    this.purchaseDate = null;
    this.inventoryIngressDate = null;
    this.provider = null;
    this.cardClass = null;
    this.quantity = null;
    this.soc = null;
  }

  filterFunction(motivo, id): boolean {
    return motivo.id === id;
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  //MODALES
  showModal(): void {
    this.isVisible = true;
    this.estadoEditar = false;
    if (this.estadoEditar) {
      this.validateForm.controls['registryDetailReason'].addValidators(Validators.required);
      this.validateForm.controls['registryDetailReason'].updateValueAndValidity()
      this.validateForm.reset()
    }
    this.validateForm.controls['registryDetailReason'].clearValidators();
    this.validateForm.controls['registryDetailReason'].updateValueAndValidity()
    this.validateForm.reset()
  }

  openModalDetail(): void {
    this.isVisibleDetails = true;
  }

  openModalDetailMotivo(): void {
    this.isVisibleDetailsMotivo = true;
    this.handleCancel();
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
    this.newRegistry()
  }

  handleCancelMotivo(): void {
    this.isVisibleDetailsMotivo = false
  }
}
