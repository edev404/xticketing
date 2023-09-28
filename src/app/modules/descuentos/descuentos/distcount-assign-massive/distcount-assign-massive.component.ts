import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ManageService } from '../../models/modelManager';
import {
  DistcountDetail,
  IDiscount,
  IDistcountAssignerMassive,
  IDistcountMassive,
} from '../../models/modulos';
import { ConfigFileService } from 'src/app/modules/admin/admin/parameters/config-file/services/config-file.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, filter, tap } from 'rxjs';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { DiscountService } from '../discount.api';
import { DescuentosService } from '../../service/descuentos.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { Validaciones } from '../../models/clientAccountsData';

@Component({
  selector: 'app-distcount-assign-massive',
  templateUrl: './distcount-assign-massive.component.html',
  styleUrls: ['./distcount-assign-massive.component.scss'],
})
export class DistcountAssignMassiveComponent implements OnInit {
  //Fechas
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  entitySubscription: Subscription | undefined;
  startValue: Date | null = null;
  endValue: Date | null = null;
  fechaActual: Date = new Date();
  formularioEnviado: boolean = false;
  descuentoMasivoAgregado: boolean = false;

  showInfo!: boolean;

  acciones: any[] = [];

  mostrar: boolean = false;
  estado: boolean | undefined = false;
  dataDescuento: IDistcountMassive = {};
  // PAGINATION
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  numberRow: number = 5;
  page: number = 1;

  urlFile;
  prueba = '';
  currentFileName!: string | null;
  days: any[] = [];
  dataTable: IDistcountMassive[] = [];
  servicesList: ManageService[] = [];
  distcountList: IDiscount[] = [];


  listOfData;
  entityId;
  countryIdBornPlaceList;
  countryIdResidencePlaceList;
  departmentIdBornPlaceList;
  departmentIdResidencePlaceList;
  municipalyIdBornPlaceList;
  municipalyIdResidencePlaceList;
  professionsList;
  dataFilesLoad

  validateForm!: FormGroup;
  distcountAssignerDetail!: IDistcountMassive;
  distcountAssignerMassive!: IDistcountAssignerMassive;

  file: any = null;
  discountSend: any = {
    geographi: [],
    checkOptionsOne: [
      { label: 'Lunes', value: 'Lunes', checked: false },
      { label: 'Martes', value: 'Martes', checked: false },
      { label: 'Miercoles', value: 'Miercoles', checked: false },
      { label: 'Jueves', value: 'Jueves', checked: false },
      { label: 'Viernes', value: 'Viernes', checked: false },
      { label: 'Sabado', value: 'Sabado', checked: false },
      { label: 'Domingo', value: 'Domingo', checked: false },
      { label: 'Festivos', value: 'Festivos', checked: false },
    ],
    userTerm: {
      bornLocation: { city: {}, country: {}, department: {} },
      residenceLocation: { city: {}, country: {}, department: {} },
    },
    timeTerm: { alwaysHours: true, rangeHours: false, days: "" }
  };
  checkOptionsOne = [
    { label: 'Lunes', value: 0, checked: false },
    { label: 'Martes', value: 1, checked: false },
    { label: 'Miercoles', value: 2, checked: false },
    { label: 'Jueves', value: 3, checked: false },
    { label: 'Viernes', value: 4, checked: false },
    { label: 'Sabado', value: 5, checked: false },
    { label: 'Domingo', value: 6, checked: false },
    { label: 'Festivos', value: 7, checked: false },
  ];

  // SERVICES UTILS
  DISTCOUNT_PATH = 'discounts';
  PASSENGER_PATH = 'passengers';

  constructor(
    private fb: FormBuilder,
    private apiFile: ConfigFileService,
    private utils: UtilsService,
    private sanitizer: DomSanitizer,
    private _api: AuthServiceService,
    private api: DescuentosService,
    private _discountService: DiscountService
  ) {
    this.validateForm = this.fb.group({
      servicios: [null, [Validators.required]],
      discounts: [null, [Validators.required]],
      rangePickerstartValue: [null, [Validators.required]],
      rangePickerendValue: [null, [Validators.required]],
      accion: [null, [Validators.required]],
      plantilla: [null, [Validators.required]],
    });
  }

  async ngOnInit() {
    this.entitySubscription = this.utils.permisosEntitysBehavior.subscribe(
      async (Behavior) => {
        await this.loadServices();
        await this.loadData();
        await this.loadFilesCharge();
      }
    );
    this.tipoAccion();
    // const json: Validaciones[] = [
    //   {
    //     "identificacion": "1",
    //     "status": true
    //   },
    //   {
    //     "identificacion": "1",
    //     "status": false
    //   },
    //   {
    //     "identificacion": "1",
    //     "status": true
    //   },
    // ]
    // this.exportCsv(json)
  }

  // paginado
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }
  onChangePage(event: number): void {
    this.page = event;
  }

  async tipoAccion() {
    this.acciones = await this._api.getLista("ACCION")
    this.validateForm.get('accion')?.setValue(this.acciones[0]?.code);
    this.validateForm.get('accion')?.disable();
  }

  index = 0;
  tabs = ['Información general', 'Detalles del descuento'];

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
  }

  async loadMasterSetting() {
    let response = await this.api.getList(this.utils.getBasicEndPoint(`masters/occupations`));
    if (response.status === this.utils.successMessage) {
      this.professionsList = response.data.occupations;
    }

    response = await this.api.getList(this.utils.getBasicEndPoint('masters/countries'));
    if (response.status === this.utils.successMessage) {
      this.countryIdBornPlaceList = response.data.countries;
      this.countryIdResidencePlaceList = response.data.countries;
    }

    const servicesAccess = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (servicesAccess) {
      const services = servicesAccess.services;
      if (services) {
        let hash = {};
        this.servicesList = services.filter((service: ManageService) => service.active == true && hash[service.name] ? false : hash[service.name] = true)
          .sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0);
      }
    }
  }

  cambiarPestana(tabs: string) {
    if (tabs == 'Información general') {
      this.showInfo = true;
      return;
    }
    this.showInfo = false;
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue) {
      return false; // Permitir seleccionar el día de hoy si no hay fecha seleccionada
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establecer las horas, minutos, segundos y milisegundos a cero para comparar solo las fechas

    return startValue.getTime() < today.getTime(); // Inhabilitar días anteriores (estrictamente menor que el día de hoy)
  };


  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
  }

  loadDaysByDiscount(daysParams: string) {
    if (!daysParams) return;
    const daysArray = daysParams.split(',');
    this.days = daysArray.map((res, index) => {
      let resValue = parseInt(res);
      return { name: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Festivos'][index], value: resValue };
    });
  }

  async loadDays() {
    this.days = [
      { name: 'Lunes', value: false },
      { name: 'Martes', value: false },
      { name: 'Miércoles', value: false },
      { name: 'Jueves', value: false },
      { name: 'Viernes', value: false },
      { name: 'Sábado', value: false },
      { name: 'Domingo', value: false },
      { name: 'Festivos', value: false }
    ];
  }

  async clearForm() {
    await Swal.fire(this.utils.getQuestionModalOptions('¿Desea limpiar la información ingresada?', ''))
      .then((result) => {
        if (result.isConfirmed) {
          this.validateForm.reset();
          this.file = null
          this.currentFileName = 'Adjuntar archivo';
        }
      });
    this.formularioEnviado = false;
  }


  cambioFormulario(id?) {
    if (id) {
      this.endValue = null;
    }
  }

  getFormattedLabel(item: any): string {
    const nombres = item.nombre.toString().split(";");
    return item.id + ' - ' + nombres[0]; // Puedes cambiar el separador si lo deseas, en este caso uso ", ".
  }


  async saveDiscount() {
    this.formularioEnviado = true;
    let form = this.validateForm;
    const header = {};// config header
    const auth = JSON.parse(localStorage.getItem('auth')!);

    if (form.invalid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    if (this.currentFileName != 'Adjuntar archivo' && this.currentFileName == null) {
      return;
    }

    let formData = new FormData();

    formData.append("fkService", form.value.servicios);
    formData.append("fkDescuento", form.value.discounts);
    formData.append("vigenciaIn", this.utils.formatDate(form.value.rangePickerstartValue));
    formData.append("vigenciaFin", this.utils.formatDate(form.value.rangePickerendValue));
    formData.append("fkAccion", String(this.acciones[0].code));
    formData.append("fkPlantilla", form.value.plantilla);
    formData.append("file", this.file);


    if (auth) { header['username'] = auth.user.username; header['Authorization'] = `Bearer ${auth.token}`; }
    this._discountService.postDiscount(formData).subscribe(
      {
        next: async (value: any) => {
          if (value.status != "success") {
            this.utils.openErrorAlert(value.message ? value.message : 'Descuento no asociado correctamente')
            this.descuentoMasivoAgregado = false;
            this.formularioEnviado = false;
            return;
          }
          const fallados = value.data.discount.failed;
          const cargados = (value.data.discount.failed + value.data.discount.success)
          if (value.data.discount.errorMessage) {
            this.utils.openErrorAlert(value.message ? value.message : value.data.discount.errorMessage)
            this.descuentoMasivoAgregado = false;
            this.formularioEnviado = false;
            return;

          }
          this.utils.openSuccessAlert(`Descuento asociado correctamente.`).then(() => {
            this.descuentoMasivoAgregado = true;
            form.reset();
            this.currentFileName = 'Adjuntar archivo';
            this.file = [];
            this.formularioEnviado = false;
            this.exportCsv(value.data.discount.result)
          });
          await this.loadFilesCharge();
          await this.loadDistcountMassive()

        }, error: async (err: any) => {
          await this.loadFilesCharge();
          this.utils.openErrorAlert('Descuento no asociado correctamente');
        }
      }
    )
  }

  async loadDepartmentCombo(value, type) {
    const response = await this.api.getList(
      this.utils.getBasicEndPoint(`masters/departments?countryId=${value}`)
    );
    if (response.status === this.utils.successMessage) {
      if (type === 'born') {
        this.departmentIdBornPlaceList = response.data.departments;
      } else {
        this.departmentIdResidencePlaceList = response.data.departments;
      }
    }
  }

  async loadCityCombo(value, type) {
    const response = await this.api.getList(
      this.utils.getBasicEndPoint(`masters/cities?departmentId=${value}`)
    );
    if (response.status === this.utils.successMessage) {
      if (type === 'born') {
        this.municipalyIdBornPlaceList = response.data.cities;
      } else {
        this.municipalyIdResidencePlaceList = response.data.cities;
      }
    }
  }

  async onFileChange(event) {
    this.file = null;
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.currentFileName = this.file.name;
    }
    // Restablecer el valor del input de tipo "file".
    event.target.value = '';
    this.cambioFormulario();
  }

  subirEvidenciaPDF() {
    this.api.uploadImage(`${this.utils.getFilesEndpoint2('update/s3')}`, this.file)
      .subscribe(
        {
          next: (value: any) => {
            console.log(value)
          },
          error: (err: any) => {
            console.log(err)
          },
          complete: () => {
            console.log("La suscripción al observable ha finalizado");
          },
        }
      )
  }

  async showModalView(data) {
    await this.loadMasterSetting();
    await this.loadDays();
    console.log(data)
    this.distcountAssignerDetail = data;
    await this.loadDiscountDetail(data.fkDescuento);
    if (this.distcountAssignerDetail.evidencia) {
      const nameDocument = this.distcountAssignerDetail.evidencia.split('/');
      if (nameDocument.length > 3) {
        this.distcountAssignerDetail.descuentoName = nameDocument[4];
      }
    }
    this.showInfo = true;
  }

  async loadDiscountDetail(idDiscount: number) {
    const response = await this.api.findById(
      this.utils.getBasicEndPoint(`${this.DISTCOUNT_PATH}/${idDiscount}`)
    );
    if (response.status === this.utils.successMessage) {
      this.discountSend = response.data.discount;
      console.log('descuento seleccionado', this.discountSend);

      if (this.discountSend.timeTerm.rangeHours) {
        this.discountSend.timeTerm.rangeHours = true;
      }

      if (this.discountSend.timeTerm.alwaysHours) {
        this.discountSend.timeTerm.alwaysHours = true;
      }

      if (this.discountSend.timeTerm.days) {
        this.loadDaysByDiscount(this.discountSend.timeTerm.days);
      }

      if (!this.discountSend.userTerm.bornLocation) {
        this.discountSend.userTerm.bornLocation = {
          city: {},
          country: {},
          department: {},
        };
      }

      if (!this.discountSend.userTerm.residenceLocation) {
        this.discountSend.userTerm.residenceLocation = {
          city: {},
          country: {},
          department: {},
        };
      }

      if (this.discountSend.userTerm.bornLocation.country.id) {
        await this.loadDepartmentCombo(
          this.discountSend.userTerm.bornLocation.country.id,
          'born'
        );
        await this.loadCityCombo(
          this.discountSend.userTerm.bornLocation.department.id,
          'born'
        );
        this.discountSend.userTerm.bornLocation.department.id = String(
          this.discountSend.userTerm.bornLocation.department.id
        );
        this.discountSend.userTerm.bornLocation.city.id = String(
          this.discountSend.userTerm.bornLocation.city.id
        );
      }
      if (this.discountSend.userTerm.residenceLocation.country.id) {
        await this.loadDepartmentCombo(
          this.discountSend.userTerm.residenceLocation.country.id,
          'residence'
        );
        await this.loadCityCombo(
          this.discountSend.userTerm.residenceLocation.department.id,
          'residence'
        );
        this.discountSend.userTerm.residenceLocation.department.id = String(
          this.discountSend.userTerm.residenceLocation.department.id
        );
        this.discountSend.userTerm.residenceLocation.city.id = String(
          this.discountSend.userTerm.residenceLocation.city.id
        );
      }
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async loadData() {
    const entity = JSON.parse(localStorage.getItem('selectedEntity')!!);
    if (entity) {
      this.entityId = entity.entities[0].id;
      this.loadDistcountMassive();
    }
  }

  async loadDiscounts(idServices: number) {
    // Marcar el campo como "pristine" para evitar que se muestre el mensaje de validación
    this.validateForm.get('discounts')?.setValidators(Validators.nullValidator);
    this.validateForm.get('discounts')?.updateValueAndValidity()

    // Establecer el valor del campo como una cadena vacía ('')
    await this.validateForm.get('discounts')?.setValue('');

    const entity = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (entity) {
      const entityId = entity.entities[0].id;
      const response = await this.api.getList(this.utils.getBasicEndPoint(`${this.DISTCOUNT_PATH}/${entityId}/findByIdEntity`));
      if (response.status === this.utils.successMessage) {
        const distcountList = response.data.discounts;
        this.distcountList = distcountList.filter((distcount) => distcount.serviceId == idServices && distcount.active === true);
        // Antes de activar el validador, marcar el campo como "pristine" y "untouched"
        this.validateForm.get('discounts')?.markAsPristine();
        this.validateForm.get('discounts')?.markAsUntouched();

        // Activar el validador 'required' para futura validación
        this.validateForm.get('discounts')?.setValidators(Validators.required);
        this.validateForm.get('discounts')?.updateValueAndValidity();

      } else if (response.showAlert) {
        await this.utils.openErrorAlert(response.message);
      }
    }
    this.cambioFormulario()
  }

  async loadServices() {
    const response = JSON.parse(localStorage.getItem('selectedEntity')!!);
    if (response) {
      const services = response.services;
      if (services) {
        let hash = {};
        this.servicesList = services
          .filter((service: ManageService) =>
            service.active == true && hash[service.name]
              ? false
              : (hash[service.name] = true)
          )
          .sort((a, b) =>
            a.name.toLowerCase() < b.name.toLowerCase()
              ? -1
              : a.name.toLowerCase() > b.name.toLowerCase()
                ? 1
                : 0
          );
      }
    } else {
      await this.utils.openErrorAlert(
        'No se encontraron servicios asociados al usuario.'
      );
    }
  }

  async loadDistcountMassive() {
    const response = await new Promise<any>((resolve, rejects) => {
      this.api.getListDiscount(this.utils.getBasicEndPoint(`${this.DISTCOUNT_PATH}/maxive/list`))
        .subscribe(
          {
            next: (value: any) => {
              this.dataTable = value.data.discounts;
              this.dataTable = this.dataTable.sort((a: any, b: any) => b.active - a.active)
              resolve(value)
            },
            error: (err: any) => {
              rejects(err)
            },
            complete: () => {

            }
          }
        );
    })
  }

  async loadFilesCharge() {
    let resp: any[] = await this.apiFile.getExternal(this.utils.getFilesEndpoint(`tableTemplate`));
    this.dataFilesLoad = resp.filter((element) => element.estado);
  }

  renderFileInTemplate(key: string) {
    this.api.downloadImageDiscount(this.utils.getFilesEndpoint2('descuentos/S3/download'), key)
      .subscribe(
        {
          next: (value: Blob) => {
            const urlCreator = window.URL || window.webkitURL;
            this.urlFile = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(value));;
            this.urlFile = this.urlFile.changingThisBreaksApplicationSecurity
          },
          error: (err: any) => {
            console.log(err)
          },
          complete: () => {
            console.log("La suscripción al observable ha finalizado");
          },
        }
      )
  }
  renderFileInTemplateDownloads(key: string) {
    this.api.downloadImageDiscount(this.utils.getFilesEndpoint2('descuentos/S3/download'), key)
      .subscribe(
        {
          next: (value: Blob) => {
            const urlCreator = window.URL || window.webkitURL;
            this.urlFile = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(value));
            const url = URL.createObjectURL(value);
            const a = document.createElement('a');
            a.href = url;
            a.download = `descuento.pdf`;
            a.click();
            URL.revokeObjectURL(url);
          },
          error: (err: any) => {
            console.log(err)
          },
          complete: () => {
            console.log("La suscripción al observable ha finalizado");
          },
        }
      )
  }
  cambiarEstado(data) {
    this.loadDistcountMassive();
    this.dataDescuento = data;
    this.estado = this.dataDescuento.active;
    //  CHANGE AHORA QUE CORRIGAN
    if (this.dataDescuento.vigente) {
      this.loadDistcountMassive()
      if (this.dataDescuento.active) {
        this.mostrar = true;
        return
      }
      this.utils.openInfoAlert('No se puede activar un descuento con la vigencia vencida.');
      return;
    }
    this.mostrar = true;
  }

  aceptar() {
    const url = this.dataDescuento.active ? 'set-inactive' : 'set-active';
    this.api.changeStateDiscountMaxive(this.utils.getBasicEndPoint(`discounts/max/${url}`), this.dataDescuento.fkPlantilla, this.dataDescuento.fkDescuento, this.dataDescuento.id)
      .subscribe(
        {
          next: (value: any) => {
            this.mostrar = false;
            if (value.status != "success") {
              this.utils.openErrorAlert(value.message ? value.message : 'Descuento no desactivado')
              return;
            }
            this.utils.openSuccessAlert('Descuento desactivado correctamente.')
            this.loadDistcountMassive();
          }, error: (err: any) => {
            this.utils.openErrorAlert('Descuento no desactivado');
          }
        }
      );
  }

  exportCsv(event: Validaciones[]): void {

    const jsonCSV: any[] = []
    event.forEach((element) => {
      jsonCSV.push(
        {
          identificacion: element.passenger.identification,
          nombreCompleto: (element.passenger.firstName + " " + element.passenger.lastName),
          email: element.passenger.email,
          telefono: element.passenger.cellPhone,
          edad: element.passenger.age,
          motivo: element.validation.message,
          estado: element.validation.success ? "Si" : "No" 
        }
      )
    })
    let opciones = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: false,
      showTitle: false,
      title: 'Evidencia de descuentos',
      useBom: false,
      noDownload: false,
      headers: [
        "Identificacion",
        "Nombre del pasajero",
        "Email",
        "Telefono",
        "Edad",
        "Descripcion",
        "Descuento aplicado"
      ]
    };

    new ngxCsv(jsonCSV, "Evidencias", opciones)
  }
}
