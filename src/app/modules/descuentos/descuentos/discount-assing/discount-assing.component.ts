import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ManageService } from '../../models/modelManager';
import { DistcountDetail, IPassenger, IDistcountAssignerMassive, IDistcountMassive, IDiscount } from '../../models/modulos';
import { DomSanitizer } from '@angular/platform-browser';
import { DescuentosService } from '../../service/descuentos.service';

@Component({
  selector: 'app-discount-assing',
  templateUrl: './discount-assing.component.html',
  styleUrls: ['./discount-assing.component.scss']
})
export class DiscountAssingComponent implements OnInit, OnDestroy {
  estado: boolean = false;
  dataTable: IPassenger[] = [];
  filterValue;
  listOfData;
  urlFile;
  urlFileDownloads;
  file: any = null;
  currentFileName!: string | null;
  idConfig!: number;
  isConfig: boolean = false;
  formularioEnviado: boolean = false;
  mostrar: boolean = false;
  //Fechas
  startValue: Date | null = null;
  endValue: Date | null = null;
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  validateForm!: FormGroup;
  dataTable2!: IDistcountMassive[];
  servicesList: ManageService[] = [];
  distcountList: IDiscount[] = [];
  distcountAssignerDetail!: DistcountDetail;
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
  days: any[] = [];
  distcountAssignerMassive!: IDistcountAssignerMassive;
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  pageMain: number = 1;
  numberRowMain: number = 5;

  pageConfig: number = 1;
  numberRowConfig: number = 5;

  listDistcountIndividual: Array<any> = []
  entityId;
  professionsList;
  prueba = '';
  title!: string;
  countryIdBornPlaceList:any[] = [];
  countryIdResidencePlaceList:any[] = []
  departmentIdBornPlaceList:any[] = [];
  departmentIdResidencePlaceList:any[] = [];
  municipalyIdBornPlaceList:any[] = [];
  municipalyIdResidencePlaceList:any[] = [];
  // Options Menu
  showInfo!: boolean;
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

  fila: any;
  filtroBuscado: any;

  constructor(
    private utils: UtilsService,
    private api: DescuentosService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private msg: NzMessageService,
  ) {
  }
  ngOnDestroy(): void {
    // 
  }

  async ngOnInit(): Promise<void> {
    this.validateForm = this.fb.group({
      service: [null, [Validators.required]],
      distcount: [null, [Validators.required]],
      rangePickerStartValue: [null, [Validators.required]],
      rangePickerEndValue: [null, [Validators.required]],
    });
    await this.loadServices();
  }

  preventPaste(event: ClipboardEvent) {
    event.preventDefault();
    // También puedes mostrar un mensaje de aviso al usuario si lo deseas.
  }

  index = 0;
  tabs = ['Información general', 'Detalles del descuento'];

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
  }
  cambiarPestana(tabs: string) {
    if (tabs == 'Información general') {
      this.showInfo = true;
      return;
    }
    this.showInfo = false;
  }

  onChangeRowPerPage(event: number, type: string): void {
    switch (type) {
      case 'main':
        this.numberRowMain = event;
        this.pageMain = 1;
        break;
      case 'config':
        this.numberRowConfig = event;
        this.pageConfig = 1;
        break;
    }
  }

  onChangePage(event: number, type: string): void {
    switch (type) {
      case 'main':
        this.pageMain = event;
        break;
      case 'config':
        this.pageConfig = event;
        break;
    }
  }

  cancel() {
    this.isConfig = false;
    this.validateForm.reset();
    this.currentFileName = 'Adjuntar archivo';
  }

  cambiarFormulario() {
    this.endValue = null;
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
    console.log('handleStartOpenChange', open);
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file);
    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }

  loadDaysByDiscount(daysParams: string) {
    // this.prueba = daysParams;
    // if(!daysParams) return;
    // const daysArray = daysParams.split(',');
    // daysArray.map((res) => {
    //   let resValue = parseInt(res);
    //   if (resValue == 1) {
    //     this.checkOptionsOne[daysArray.indexOf(res)].checked = true;
    //   }
    // });

    if (!daysParams) return;
    const daysArray = daysParams.split(',');
    this.days = daysArray.map((res, index) => {
      let resValue = parseInt(res);
      return { name: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Festivos'][index], value: resValue };
    });
  }

  async config(data) {
    this.isConfig = true;
    this.idConfig = data.id;
    this.title = `${data.firstName} ${data.lastName} ${data.identification}`;
    await this.loadDays();
    await this.loadMasterSetting();
    await this.loadDistcountIndividual(data.id);
  }

  async onFileChange(event) {
    this.file = null;
    console.log(event.target.files)
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.currentFileName = this.file.name;
    }
    // Restablecer el valor del input de tipo "file".
    event.target.value = '';
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

  async showModalView(data: DistcountDetail) {
    this.showInfo = true;
    this.distcountAssignerDetail = data;
    console.log(data)
    await this.loadDiscountDetail(data.idDiscount!);
    if (this.distcountAssignerDetail.keyDocument) {
      const nameDocument = this.distcountAssignerDetail.keyDocument.split('/');
      if (nameDocument.length > 3) {
        this.distcountAssignerDetail.nameDocument = nameDocument[4];
      }
    }
  }

  async onSubmit() {
    this.formularioEnviado = true;
    const header = {};// config header
    const auth = JSON.parse(localStorage.getItem('auth')!);

    if (this.validateForm.valid == false) {
      // await Swal.fire(this.utils.getErrorModalOptions('Verifique los datos del formulario.'));
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          return;
        }
      })
      return;
    }

    if (!this.validateForm.value.distcount) {
      // await this.utils.openInfoAlert('Debe seleccionar un descuento.');
      return;
    }

    if (!this.file) {
      // await this.utils.openErrorAlert('No se ha adjuntado la evidencia.');
      return;
    }

    let date = new Date();
    let dateFile = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${date.getHours()}${date.getMinutes()}`;

    var formData = new FormData();
    formData.append('passengerId', String(this.idConfig));
    formData.append('file', this.file);
    formData.append('startVigency', this.utils.formatDate(this.validateForm.value.rangePickerStartValue));
    formData.append('endVigency', this.utils.formatDate(this.validateForm.value.rangePickerEndValue));

    if (auth) {
      header['username'] = auth.user.username;
      header['Authorization'] = `Bearer ${auth.token}`;
    }

    fetch(
      this.utils.getBasicEndPoint(`${this.DISTCOUNT_PATH}/${this.validateForm.value.distcount}/add-passenger`),
      { method: 'POST', body: formData, redirect: 'follow', headers: header }
    ).then((resp) => {
      if (resp.status === 401) return;
      return resp.text();
    })
      .then(async (result) => {
        const respData = JSON.parse(result!);
        if (respData.status === this.utils.successMessage) {
          this.utils.openSuccessAlert('¡El descuento ha sido asignado correctamente!').then(() => {
            this.distcountList = [];
            this.currentFileName = 'Seleccionar archivo';
            this.formularioEnviado = false;
            this.validateForm.reset();
            this.file = [];
          });
          await this.loadDistcountIndividual(this.idConfig);
        } else {
          if (respData.message === 'El pasajero ya se encuentra relacionado con el descuento.') {
            this.utils.openErrorAlert('El descuento ya se encuentra relacionado con el pasajero.');
          } else {
            this.utils.openErrorAlert(respData.message);
          }
        }
      })
      .catch((error) => {
        this.utils.openErrorAlert(error);
      });
  }

  limpiarBusqueda() {
    this.filterValue = '';
  }

  onSearch(): void {
    const regex = new RegExp(this.filterValue, 'i'); // 'i' para hacer la búsqueda case-insensitive
    this.dataTable = this.searchByRegex(regex);
  }

  private searchByRegex(regex: RegExp): any[] {
    return this.dataTable.filter(item => regex.test(item.identification));
  }

  async loadDataP(isFilter) {
    if (this.filterValue) {
      this.filtroBuscado = isFilter;
      this.listOfData = [];
      const url = isFilter ? this.utils.getBasicEndPoint(`${this.PASSENGER_PATH}?filter=${this.filterValue}`) : this.utils.getBasicEndPoint(this.PASSENGER_PATH);
      const response = await this.api.getList(url);
      if (response.status === this.utils.successMessage) {
        this.dataTable = response.data.passengers;
        this.onSearch()
      } else if (response.showAlert) {
        await this.utils.openErrorAlert(response.message);
      }
    }else {
      this.dataTable.length = 0;
    }
  }

  async loadDistcountIndividual(idUser: any) {
    const response = await this.api.findAssignedDiscounts(this.utils.getBasicEndPoint(`${this.DISTCOUNT_PATH}/${idUser}/findAssignedDiscounts`));
    if (response.status === this.utils.successMessage) {
      this.listDistcountIndividual = response.data.discount;

    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async loadServices() {
    const response = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (response) {
      const services = response.services;
      if (services) {
        let hash = {};
        this.servicesList = services.filter((service: ManageService) => service.active == true && hash[service.name] ? false : hash[service.name] = true)
          .sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0);
        console.log(this.servicesList);

      }
    } else {
      await this.utils.openErrorAlert('No se encontraron servicios asociados al usuario.');
    }
  }
  /**
   * Carga los descuentos relacionados con un servicio específico identificado por su idServices.
   * Establece el campo 'distcount' en el formulario como 'pristine' para evitar que se muestre el mensaje
   * de validación. Luego, establece el valor del campo como una cadena vacía ('').
   * Obtiene la entidad seleccionada del almacenamiento local y consulta los descuentos asociados a esa entidad.
   * Filtra los descuentos activos que están relacionados con el servicio y los almacena en 'distcountList'.
   * Finalmente, activa el validador 'required' en el campo 'distcount' para su futura validación.
   *
   * @param {number} idServices - El identificador del servicio para el cual se cargarán los descuentos.
   * @returns {Promise<void>} - Una promesa que se resuelve una vez que se completan las operaciones de carga y validación.
   */
  async loadDiscounts(idServices: number) {
    // Marcar el campo como "pristine" para evitar que se muestre el mensaje de validación
    this.validateForm.get('distcount')?.setValidators(Validators.nullValidator);
    this.validateForm.get('distcount')?.updateValueAndValidity()

    // Establecer el valor del campo como una cadena vacía ('')
    await this.validateForm.get('distcount')?.setValue('');

    // Obtener la entidad seleccionada del almacenamiento local
    const entity = JSON.parse(localStorage.getItem('selectedEntity')!);

    if (entity) {
      const entityId = entity.entities[0].id;
      const response = await this.api.getList(this.utils.getBasicEndPoint(`${this.DISTCOUNT_PATH}/${entityId}/findByIdEntity`));

      if (response.status === this.utils.successMessage) {
        const distcountList = response.data.discounts;
        // Filtrar los descuentos activos relacionados con el servicio y almacenarlos en 'distcountList'
        this.distcountList = distcountList.filter(distcount => distcount.serviceId == idServices && distcount.active === true);
        // Antes de activar el validador, marcar el campo como "pristine" y "untouched"
        this.validateForm.get('distcount')?.markAsPristine();
        this.validateForm.get('distcount')?.markAsUntouched();

        // Activar el validador 'required' para futura validación
        this.validateForm.get('distcount')?.setValidators(Validators.required);
        this.validateForm.get('distcount')?.updateValueAndValidity();
      } else if (response.showAlert) {
        await this.utils.openErrorAlert(response.message);
      }
    }
  }

  async aceptar() {
    if (!this.fila.statusValidity && !this.fila.active) {
      this.utils.openInfoAlert('No se puede activar un descuento con la vigencia vencida.');
      await this.loadDistcountIndividual(this.idConfig)
      return;
    }
    const response = await this.api.changeStateDiscount(this.utils.getBasicEndPoint(`${this.DISTCOUNT_PATH}/${this.fila.id}/change-state-discount`), !this.fila.active);
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('¡Se ha cambiado el estado correctamente!')
      await this.loadDistcountIndividual(this.idConfig)
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
      await this.loadDistcountIndividual(this.idConfig)
    }
  }

  async changeStateValue(row) {
    this.fila = row;
    this.estado = row.active;
    this.mostrar = true;
    await this.loadDistcountIndividual(this.idConfig)
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
            this.urlFileDownloads = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(value));
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
  async loadDiscountDetail(idDiscount: number) {
    const response = await this.api.findById(this.utils.getBasicEndPoint(`${this.DISTCOUNT_PATH}/${idDiscount}`));
    if (response.status === this.utils.successMessage) {
      this.discountSend = response.data.discount;
      console.log("descuento seleccionado", this.discountSend);

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
        this.discountSend.userTerm.bornLocation = { city: {}, country: {}, department: {} };
      }

      if (!this.discountSend.userTerm.residenceLocation) {
        this.discountSend.userTerm.residenceLocation = { city: {}, country: {}, department: {} };
      }

      if (this.discountSend.userTerm.bornLocation.country.id) {
        await this.loadDepartmentCombo(this.discountSend.userTerm.bornLocation.country.id, 'born');
        await this.loadCityCombo(this.discountSend.userTerm.bornLocation.department.id, 'born');
        this.discountSend.userTerm.bornLocation.department.id = String(this.discountSend.userTerm.bornLocation.department.id)
        this.discountSend.userTerm.bornLocation.city.id = String(this.discountSend.userTerm.bornLocation.city.id)
      }
      if (this.discountSend.userTerm.residenceLocation.country.id) {
        await this.loadDepartmentCombo(this.discountSend.userTerm.residenceLocation.country.id, 'residence');
        await this.loadCityCombo(this.discountSend.userTerm.residenceLocation.department.id, 'residence');
        this.discountSend.userTerm.residenceLocation.department.id = String(this.discountSend.userTerm.residenceLocation.department.id)
        this.discountSend.userTerm.residenceLocation.city.id = String(this.discountSend.userTerm.residenceLocation.city.id)
      }
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }

  }

  async loadDepartmentCombo(value, type) {
    const response = await this.api.getList(this.utils.getBasicEndPoint(`masters/departments?countryId=${value}`));
    if (response.status === this.utils.successMessage) {
      if (type === 'born') {
        this.departmentIdBornPlaceList = response.data.departments;
      } else {
        this.departmentIdResidencePlaceList = response.data.departments;
      }
    }
  }

  async loadCityCombo(value, type) {
    const response = await this.api.getList(this.utils.getBasicEndPoint(`masters/cities?departmentId=${value}`));
    if (response.status === this.utils.successMessage) {
      if (type === 'born') {
        this.municipalyIdBornPlaceList = response.data.cities;
      } else {
        this.municipalyIdResidencePlaceList = response.data.cities;
      }
    }
  }
}