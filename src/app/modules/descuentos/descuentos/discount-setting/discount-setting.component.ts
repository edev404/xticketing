import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ManageService } from '../../models/modelManager';
import { IDiscount } from '../../models/modulos';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { DescuentosService } from '../../service/descuentos.service';
import * as moment from 'moment';

@Component({
  selector: 'app-discount-setting',
  templateUrl: './discount-setting.component.html',
  styleUrls: ['./discount-setting.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class DiscountSettingComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  entitySubscription: Subscription | undefined;

  estadoBolsas: boolean = false;

  tiposDescuento: any[] = [];
  frecuencias: any[] = [];
  enviarFormulario: boolean = false;
  descuentoFormulario: boolean = false;
  editBolsaDinero: number = 0;


  editarFormulario: boolean = false;
  editarFormularioCopy: boolean = false;
  vecesCambio1: number = 0;
  vecesCambio2: number = 0;

  vecesCambio3: number = 0;
  vecesCambio4: number = 0;

  // BOOLEAN
  isEdit: boolean = false
  crear: boolean = false;
  allChecked = false;
  indeterminate = true;
  checked = true;
  fechaMayor: boolean = false;
  // ARRYS AND OBJECT
  zones: [] = [];
  days: any[] = [];
  discountSend: any = {
    geographi: [],
    checkOptionsOne: [
      { label: 'Lunes', value: 'Lunes', checked: false },
      { label: 'Martes', value: 'Martes', checked: false },
      { label: 'Miércoles', value: 'Miercoles', checked: false },
      { label: 'Jueves', value: 'Jueves', checked: false },
      { label: 'Viernes', value: 'Viernes', checked: false },
      { label: 'Sábado', value: 'Sábado', checked: false },
      { label: 'Domingo', value: 'Domingo', checked: false },
      { label: 'Festivos', value: 'Festivos', checked: false },
    ],
    userTerm: {
      bornLocation: { city: {}, country: {}, department: {} },
      residenceLocation: { city: {}, country: {}, department: {} },
    },
    timeTerm: { alwaysHours: true, rangeHours: false, days: "" },
    bolsa: 0,
    bolsaVigente: false
  };
  dias: any = [
    {
      id: 0,
      estado: 0
    },
    {
      id: 1,
      estado: 0
    },
    {
      id: 2,
      estado: 0
    },
    {
      id: 3,
      estado: 0
    },
    {
      id: 4,
      estado: 0
    },
    {
      id: 5,
      estado: 0
    },
    {
      id: 6,
      estado: 0
    },
    {
      id: 7,
      estado: 0
    }
  ];
  checkOptionsOne = [
    { label: 'Lunes', value: 0, checked: false },
    { label: 'Martes', value: 1, checked: false },
    { label: 'Míercoles', value: 2, checked: false },
    { label: 'Jueves', value: 3, checked: false },
    { label: 'Viernes', value: 4, checked: false },
    { label: 'Sábado', value: 5, checked: false },
    { label: 'Domingo', value: 6, checked: false },
    { label: 'Festivos', value: 7, checked: false },
  ];
  frecuencia = [
    { value: '1', name: 'Dia' },
    { value: '2', name: 'Semana' },
    { value: '3', name: 'Mes' },
    { value: '4', name: 'Año' },
  ];
  descuentos = [
    { value: '1', name: 'Porcentaje' },
    { value: '2', name: 'Pasajes' },
    { value: '3', name: 'Minutos' },
    { value: '4', name: 'Horas' },
    { value: '5', name: 'Días' },
    { value: '6', name: 'Pesos' },
  ];
  // DATES
  startValue: Date | null = null;
  endValue: Date | null = null;
  time: Date | null = null;
  // ALL VARIABLES
  public entityId: number | undefined;
  validateForm!: FormGroup;

  prueba = '';
  filterValue: string = '';
  listOfDataFilter!: Array<any>;
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  page: number = 1;
  numberRow: number = 5;

  listOfData;
  servicesList;
  professionsList;
  countryIdBornPlaceList;
  countryIdResidencePlaceList;
  departmentIdBornPlaceList: any[] = [];
  departmentIdResidencePlaceList: any[] = [];
  municipalyIdBornPlaceList: any[] = [];
  municipalyIdResidencePlaceList: any[] = [];
  // PATHS
  DISTCOUNT_PATH = 'discounts';

  constructor(
    private fb: FormBuilder,
    private utils: UtilsService,
    private _api: AuthServiceService,
    private api: DescuentosService
  ) {
    this.validateForm = this.fb.group({
      servicio: [null, [Validators.required]],
      descuento: [null, [Validators.required]],
      frecuencia: [null, [Validators.required]],
      pais: [null, []],
      departamento: [null, []],
      ciudad1: [null, []],
      ciudad: [null, []],
      countryBornceLocation: [null, []],
      departmentBornLocation: [null, []],
    });
  }
  limpiar(): void {
    this.allChecked = false;
    this.editarFormulario = false;
    this.editarFormularioCopy = false;
    this.vecesCambio1 = 0;
    this.vecesCambio2 = 0;
    this.vecesCambio3 = 0;
    this.vecesCambio4 = 0;
  }

  async ngOnInit() {
    //await this.loadDays();
    this.entitySubscription = this.utils.permisosEntitysBehavior.subscribe(
      async (Behavior) => {
        await this.loadData();
        await this.loadMasterSetting();

      }
    );
    // Cargar tipo descuento
    this.tipoDescuento();
    // Cargar tipo descuento
    this.tipoFrecuencias();
  }

  cambioNombre() {
    this.discountSend.name = String(this.discountSend.name).trim();
  }

  preventPaste(event: ClipboardEvent) {
    event.preventDefault();
    // También puedes mostrar un mensaje de aviso al usuario si lo deseas.
  }

  async tipoDescuento() {
    this.tiposDescuento = await this._api.getLista("TIPO_DESCUENTO")
  }
  async tipoFrecuencias() {
    this.frecuencias = await this._api.getLista("FRECUENCIA")
  }


  changeHora() {
    if (this.discountSend.timeTerm.hourFinally && this.discountSend.timeTerm.hourInitial) {
      if (this.discountSend.timeTerm.hourFinally < this.discountSend.timeTerm.hourInitial) {
        this.discountSend.timeTerm.hourFinally = null;
        this.fechaMayor = true;
        return;
      }
    }
    this.fechaMayor = false;
  }

  search(): void {
    let data!: Array<any>;
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.listOfData;
    }
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.listOfDataFilter.filter((current) => {
        return this.utils.validateObject(current.id) && current.id!.toString().toUpperCase().includes(this.filterValue!.toUpperCase()) ||
          this.utils.validateObject(current.name) && current.name!.toString().toUpperCase().includes(this.filterValue!.toUpperCase()) ||
          this.utils.validateObject(current.nameService) && current.nameService!.toString().toUpperCase().includes(this.filterValue!.toUpperCase()) ||
          (this.utils.validateObject(current.dateInit) && current.dateInit!.toString().toUpperCase().includes(this.filterValue!.toUpperCase())) ||
          (this.utils.validateObject(current.datEnd) && current.datEnd!.toString().toUpperCase().includes(this.filterValue!.toUpperCase())) ||
          (this.utils.validateObject(current.dateInit) && this.utils.validateObject(current.datEnd) &&
            `${current.dateInit!.toString().toUpperCase()} - ${current.datEnd!.toString().toUpperCase()}`.includes(this.filterValue!.toUpperCase()))
        // this.utils.validateObject(current.value) && current.value!.toString().toUpperCase().includes(this.filterValue!.toUpperCase())
      });
      if (data) {
        this.listOfData = data;
      }
    } else {
      if (this.listOfDataFilter) {
        this.listOfData = this.listOfDataFilter;
        this.filterValue = ''
      }
    }
  }

  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

  nuevo() {
    this.crear = true;
    this.isEdit = false;
    this.enviarFormulario = false;
  }

  salir() {
    this.crear = false;
    this.resetDiscount();
    this.prueba = '';
    this.limpiar();
    this.checkOptionsOne.map(e => e.checked = false);
  }

  resetDiscount() {
    this.discountSend = {
      geographi: [],
      checkOptionsOne: [
        { label: 'Lunes', value: 'Lunes', checked: false },
        { label: 'Martes', value: 'Martes', checked: false },
        { label: 'Miércoles ', value: 'Miércoles', checked: false },
        { label: 'Jueves', value: 'Jueves', checked: false },
        { label: 'Viernes', value: 'Viernes', checked: false },
        { label: 'Sábado', value: 'Sábado', checked: false },
        { label: 'Domingo', value: 'Domingo', checked: false },
        { label: 'Festivos', value: 'Festivos', checked: false },
      ],
      userTerm: {
        bornLocation: { city: {}, country: {}, department: {} },
        residenceLocation: { city: {}, country: {}, department: {} },
      },
      timeTerm: { alwaysHours: true, rangeHours: false, days: {} }
    };

    this.departmentIdBornPlaceList = [];
    this.municipalyIdBornPlaceList = [];
    this.departmentIdResidencePlaceList = [];
    this.municipalyIdResidencePlaceList = [];
  }

  limpiarFecha() {
    this.discountSend.datEnd = null;
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
    if (!endValue || !this.discountSend.dateInit) {
      return false;
    }
    return endValue.getTime() <= this.discountSend.dateInit;
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
    this.discountSend.datEnd = null;
    // console.log('handleStartOpenChange', open);
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: false
      }));
    }
  }

  updateSingleChecked(event): void {
    this.prueba = "";
    const daysCheck = event.filter(x => x.checked == true);
    // CHANGE DE ESTA METODO: LUIS :)
    daysCheck.forEach((dayCheckItem) => {
      const { value } = dayCheckItem;
      this.prueba = "";

      this.dias.forEach((dia, i) => {
        dia.estado = i === value ? 1 : 0;
      });
    });
    this.dias.map((day) => {
      this.prueba = (this.prueba + "," + day.estado);
    })
    this.prueba.slice(2, 16)
  }

  loadDaysByDiscount(daysParams: string) {
    this.prueba = daysParams;
    if (!daysParams) return;
    const daysArray = daysParams.split(',');
    daysArray.map((res, i) => {
      let resValue = parseInt(res);
      if (resValue == 1) {
        this.checkOptionsOne[i].checked = true;
      }
    });
  }

  getNameZones(zones: string): any {
    if (!zones) return;
    let objs;
    objs = zones.replace(/\\/g, '');
    let objsnew = JSON.parse(objs);
    return objsnew.map(obj => obj.nombre).filter(item => !!item).join(", ");
  }

  validateDias(elements: any) {
    if (!elements) return;
    let dias = elements.split(',').map(Number);
    let nombre_dias = dias.map((res, index) => {
      if (res) {
        return ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Festivos'][index]
      };
      return null;
    }).filter(item => !!item).join(", ");
    return nombre_dias;
  }

  changeStatus(status: string) {
    if (status.includes('alwaysHours') && !this.discountSend.timeTerm.alwaysHours) {
      this.discountSend.timeTerm.rangeHours = true;
    } else if (status.includes('alwaysHours') && this.discountSend.timeTerm.alwaysHours) {
      this.discountSend.timeTerm.rangeHours = false;
    } else if (status.includes('rangeHours') && this.discountSend.timeTerm.rangeHours) {
      this.discountSend.timeTerm.alwaysHours = false;
    } else if (status.includes('rangeHours') && !this.discountSend.timeTerm.rangeHours) {
      this.discountSend.timeTerm.alwaysHours = true;
    }

    if (status == "alwaysHours") {
      this.discountSend.timeTerm.hourFinally = null;
      this.discountSend.timeTerm.hourInitial = null;
      this.fechaMayor = false;
    }
  }

  tipoDescuentoCambiado(event) {
    if (event == 450) this.discountSend.percentaje = true;
    this.discountSend.value = null;
  }
  tipoFrecuenciaCambiado() {
    this.discountSend.frequency = null;
  }


  cambiarEstado() {
    this.descuentoFormulario = false;
  }

  async saveData() {

    this.enviarFormulario = true;
    this.discountSend.timeTerm.days = this.prueba;
    if (!(this.discountSend.name && this.discountSend.serviceId && this.discountSend.dateInit && this.discountSend.datEnd && this.discountSend.discountUnit && this.discountSend.value && this.discountSend.frequencyUnit && this.discountSend.frequency)) {
      return;
    }
    const validateDay: string[] = this.discountSend.timeTerm.days.split(',');
    const jsonDias = validateDay.filter((element) => element == '1')


    Object.values(this.validateForm.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
    const dateInit = moment(this.discountSend.dateInit);
    const dateEnd = moment(this.discountSend.datEnd);
    
    if (dateInit.isAfter(dateEnd)) {
      // await this.utils.openErrorAlert('La fecha inicio no puede ser mayor a la fecha fin.');
      return;
    }

    if (this.discountSend.bolsa < 0) {
      // await this.utils.openErrorAlert('La fecha inicio no puede ser mayor a la fecha fin.');
      return;
    }

    // if (!this.discountSend.serviceId) {
    //   await this.utils.openErrorAlert('ingrese un servicio');
    //   return;
    // }

    // if (this.discountSend.value <= 0) {
    //   await this.utils.openErrorAlert('Ingrese un valor del descuento positivo.');
    //   return;
    // }

    if (this.discountSend.discountUnit == 450) {
      this.discountSend.percentaje = true;
    } else {
      this.discountSend.percentaje = false;
    }

    if (this.discountSend.percentaje && (this.discountSend.value < 0 || this.discountSend.value > 100)) {
      // await this.utils.openErrorAlert('Ingrese un valor del descuento entre 1 a 100%');
      return;
    }

    // if (this.discountSend.frequency <= 0) {
    //   await this.utils.openErrorAlert('La frecuencia debe ser mayor a 0.');
    //   return;
    // }
    const activos: number[] = [];
    this.checkOptionsOne.forEach((element) => {
      if (element.checked) {
        activos.push(1)
      } else {
        activos.push(0)
      }
    })

    if (!this.allChecked) {
      if (activos.includes(1)) {
        // 
      }
      else if (jsonDias.length == 0) {
        await this.utils.openErrorAlert('¡Por favor seleccione un día hábil!');
        return;
      } else {
        await this.utils.openErrorAlert('¡Por favor seleccione un día hábil!');
        return;
      }
    }


    if (this.discountSend.timeTerm.hourInitial && !this.discountSend.timeTerm.hourFinally) {
      await this.utils.openErrorAlert('¡Por favor seleccione una hora final!');
      return;
    }

    if (this.discountSend.timeTerm.rangeHours && (this.discountSend.timeTerm.hourInitial == undefined || this.discountSend.timeTerm.hourFinally == undefined) ||
      (this.discountSend.timeTerm.hourInitial == '' || this.discountSend.timeTerm.hourFinally == '')) {
      await this.utils.openErrorAlert('¡Por favor seleccione una hora inicial!');
      return;
    }

    if (!this.discountSend.timeTerm.rangeHours && !this.discountSend.timeTerm.alwaysHours) {
      await this.utils.openErrorAlert('¡Por favor, seleccione un rango de hora!');
      return;
    }

    if (this.discountSend.userTerm.initialAge || this.discountSend.userTerm.finalAge) {
      if ((this.discountSend.userTerm.initialAge != null && this.discountSend.userTerm.finalAge == null) ||
        (this.discountSend.userTerm.finalAge != null && this.discountSend.userTerm.initialAge == null)) {
        await this.utils.openErrorAlert('¡Por favor, ingrese ambas edades!');
        return;
      }
    }

    if (this.discountSend.userTerm.initialAge > this.discountSend.userTerm.finalAge) {
      await this.utils.openErrorAlert('La edad inicial no puede ser mayor a la edad final');
      return;
    }

    // Validar campos del Lugar de nacimiento
    if (this.discountSend.userTerm.bornLocation.country.id && !this.discountSend.userTerm.bornLocation.department.id) {
      await this.utils.openErrorAlert('¡Por favor, seleccione un departamento para el lugar de nacimiento!');
      return;
    }
    if (this.discountSend.userTerm.bornLocation.country.id && this.discountSend.userTerm.bornLocation.department.id && !this.discountSend.userTerm.bornLocation.city.id) {
      await this.utils.openErrorAlert('¡Por favor, seleccione una ciudad para el lugar de nacimiento!');
      return;
    }

    // Validar campos de Lugar de residencia:
    if (this.discountSend.userTerm.residenceLocation.country.id && !this.discountSend.userTerm.residenceLocation.department.id) {
      await this.utils.openErrorAlert('¡Por favor, seleccione un departamento para el lugar de residencia!');
      return;
    }
    if (this.discountSend.userTerm.residenceLocation.country.id && this.discountSend.userTerm.residenceLocation.department.id && !this.discountSend.userTerm.residenceLocation.city.id) {
      await this.utils.openErrorAlert('¡Por favor, seleccione una ciudad para el lugar de residencia!');
      return;
    }
    const json = {
      active: this.discountSend.active,
      condition: this.discountSend.condition,
      dateInit: this.utils.formatDate(this.discountSend.dateInit),
      datEnd: this.utils.formatDate(this.discountSend.datEnd),
      discountUnit: this.discountSend.discountUnit,
      frequency: this.discountSend.frequency,
      frequencyUnit: this.discountSend.frequencyUnit,
      id: this.discountSend.id,
      name: String(this.discountSend.name).trim(),
      nameService: this.discountSend.nameService,
      percentaje: this.discountSend.percentaje,
      serviceId: this.discountSend.serviceId,
      value: this.discountSend.value,
      entityId: this.entityId,
      bolsa: this.discountSend.bolsa,
      bolsaVigente: this.discountSend.bolsaVigente,
      timeTerm: {
        alwaysHours: this.discountSend.timeTerm.alwaysHours,
        // days: this.discountSend.id ? activos.toString() : this.discountSend.timeTerm.days.split(',').slice(1).toString(),
        days: activos.toString(),
        hourFinally: this.discountSend.timeTerm.alwaysHours ? null : this.discountSend.timeTerm.hourFinally.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hourInitial: this.discountSend.timeTerm.alwaysHours ? null : this.discountSend.timeTerm.hourInitial.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        rangeHours: this.discountSend.timeTerm.rangeHours
      },
      userTerm: {
        bornLocation: this.discountSend.userTerm.bornLocation.country.id ? this.discountSend.userTerm.bornLocation : { city: {}, country: {}, department: {} },
        finalAge: this.discountSend.userTerm.finalAge,
        initialAge: this.discountSend.userTerm.initialAge,
        professionId: this.discountSend.userTerm.professionId,
        residenceLocation: this.discountSend.userTerm.residenceLocation.country.id ? this.discountSend.userTerm.residenceLocation : { city: {}, country: {}, department: {} }
      }
    }
    // json['residenceLocation'] = this.discountSend.userTerm.residenceLocation.country.id ? this.discountSend.userTerm.residenceLocation : {};
    let response;
    if (this.discountSend.id) {
      response = await this.api.update(this.utils.getBasicEndPoint(`${this.DISTCOUNT_PATH}/${this.discountSend.id}`), JSON.stringify(json));
    } else {
      response = await this.api.create(this.utils.getBasicEndPoint(this.DISTCOUNT_PATH), JSON.stringify(json));
    }
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(this.discountSend.id ? 'Descuento actualizado con éxito.' : '¡El descuento ha sido creado correctamente!');
      this.salir();
      await this.loadData();
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
    // else {
    //   this.utils.openErrorAlert('Revise y complete todos los campos');
    // }

  }

  async editFindById(id) {
    this.editarFormulario = true;
    this.editarFormularioCopy = true;
    let fecha = new Date();
    let fecha2 = new Date();
    const response = await this.api.findById(this.utils.getBasicEndPoint(`${this.DISTCOUNT_PATH}/${id}`));
    if (response.status === this.utils.successMessage) {
      let data = response.data.discount;
      // set horas
      if (!data.timeTerm.alwaysHours) {
        fecha.setHours(data.timeTerm.hourInitial.split(':')[0]);
        fecha.setMinutes(data.timeTerm.hourInitial.split(':')[1]);
        data.timeTerm.hourInitial = fecha;
        fecha2.setHours(data.timeTerm.hourFinally.split(':')[0]);
        fecha2.setMinutes(data.timeTerm.hourFinally.split(':')[1]);
        data.timeTerm.hourFinally = fecha2;
      }


      this.discountSend = data;
      this.discountSend.bolsa = this.discountSend.bolsa ? this.discountSend.bolsa : 0;
      this.discountSend.bolsaVigente = this.discountSend.bolsaVigente ? this.discountSend.bolsaVigente : false;
      this.discountSend.dateInit = String(moment(this.discountSend.dateInit));
      this.discountSend.datEnd = String(moment(this.discountSend.datEnd));
      this.discountSend.discountUnit = String(this.discountSend.discountUnit)
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

  async loadData() {
    this.listOfData = [];
    const entity = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (entity) {
      this.entityId = entity.entities[0].id;
      const response = await this.api.getList(this.utils.getBasicEndPoint(`${this.DISTCOUNT_PATH}/${this.entityId}/findByIdEntity`));
      if (response.status === this.utils.successMessage) {
        const data = response.data.discounts;
        if (data) {
          this.listOfData = data.map((item: IDiscount) => {
            item.geographiName = this.getNameZones(item.geographi);
            item.timeTerm.nameDays = this.validateDias(item.timeTerm.days);
            return item;
          });
          const dataDescuento: any[] = [];
          this.listOfData.forEach(elements => {
            entity.services.forEach(element => {
              if (elements.serviceId == element.id) {
                dataDescuento.push(elements)
              }
            });
          });
          this.listOfData = dataDescuento;
          this.listOfData.sort((a, b) => (a.active > b.active ? -1 : 1));
        }
      } else if (response.showAlert) {
        await this.utils.openErrorAlert(response.message);
      }
    }
  }

  async editar(id) {
    this.crear = true;
    this.isEdit = true;
    this.enviarFormulario = false;
    await this.editFindById(id);
    this.validateForm.get('servicio')?.setValue(this.discountSend.serviceId)
  }

  async changeState(row) {
    const resp = await this.api.changeState(this.utils.getBasicEndPoint(`${this.DISTCOUNT_PATH}/${row.id}/change-state`), !row.active);
    if (resp.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('¡Se ha cambiado el estado del descuento correctamente!');
      await this.loadData();
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
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

    // this.api.listZones().subscribe(res => {
    //   this.zones = res.models;
    // //  console.log(res,'AQUI ESTAMOS');
    // })

  }

  async loadDepartmentCombo(value, type) {
    const response = await this.api.getList(this.utils.getBasicEndPoint(`masters/departments?countryId=${value}`));
    if (response.status === this.utils.successMessage) {
      if (type === 'born') {
        this.departmentIdBornPlaceList = response.data.departments;
        if (this.editarFormularioCopy) {
          if (this.vecesCambio1 > 0) {
            this.editarFormulario = false;
          }
          if (!this.editarFormulario && this.vecesCambio1 > 0) {
            this.discountSend.userTerm.bornLocation.department.id = null;
            this.discountSend.userTerm.bornLocation.city.id = null;
            if (!value) {
              this.departmentIdBornPlaceList.length = 0;
              this.municipalyIdBornPlaceList.length = 0;
            }
          }
        } else {
          this.discountSend.userTerm.bornLocation.department.id = null;
          this.discountSend.userTerm.bornLocation.city.id = null;
          if (!value) {
            this.departmentIdBornPlaceList.length = 0;
            this.municipalyIdBornPlaceList.length = 0;
          }
        }
        this.vecesCambio1 += 1;
      } else {
        this.departmentIdResidencePlaceList = response.data.departments;
        if (this.editarFormularioCopy) {
          if (this.vecesCambio2 > 0) {
            this.editarFormulario = false;
          }
          if (!this.editarFormulario && this.vecesCambio2 > 0) {
            this.discountSend.userTerm.residenceLocation.department.id = null;
            this.discountSend.userTerm.residenceLocation.city.id = null;
            if (!value) {
              this.departmentIdResidencePlaceList.length = 0;
              this.municipalyIdResidencePlaceList.length = 0;
            }
          };
        } else {
          this.discountSend.userTerm.residenceLocation.department.id = null;
          this.discountSend.userTerm.residenceLocation.city.id = null;
          if (!value) {
            this.departmentIdResidencePlaceList.length = 0;
            this.municipalyIdResidencePlaceList.length = 0;
          }
        }
        this.vecesCambio2 += 1;
      }
    } else {
      if (type === 'born') {
        this.departmentIdBornPlaceList.length = 0;
      } else {
        this.departmentIdResidencePlaceList.length = 0;
      }
    }
  }

  async loadCityCombo(value, type) {
    const response = await this.api.getList(this.utils.getBasicEndPoint(`masters/cities?departmentId=${value}`));
    if (response.status === this.utils.successMessage) {
      if (type === 'born') {
        if (this.editarFormularioCopy) {
          if (this.vecesCambio3 > 0) {
            this.editarFormulario = false;
          }
          if (!this.editarFormulario && this.vecesCambio3 > 0) {
            this.discountSend.userTerm.bornLocation.city.id = null;
          }
        } else {
          this.discountSend.userTerm.bornLocation.city.id = null;
        }

        this.municipalyIdBornPlaceList = response.data.cities;
        this.vecesCambio3 += 1;
      } else {
        if (this.editarFormularioCopy) {
          if (this.vecesCambio4 > 0) {
            this.editarFormulario = false;
          }
          if (!this.editarFormulario && this.vecesCambio3 > 0) {
            this.discountSend.userTerm.residenceLocation.city.id = null;
          }
        } else {
          this.discountSend.userTerm.residenceLocation.city.id = null;
        }
        this.municipalyIdResidencePlaceList = response.data.cities;
        this.vecesCambio4 += 1;
      }
    } else {
      if (type === 'born') {
        this.municipalyIdBornPlaceList.length = 0;
      } else {
        this.municipalyIdResidencePlaceList.length = 0;
      }
    }
  }

  async changeStateModal(data) {
    Swal.fire(this.utils.getQuestionModalOptions('¿Está seguro de que desea cambiar el estado de este descuento?',
      `El estado del descuento pasará de estar ${data.active ? 'activo a inactivo.' : 'inactivo a activo.'} `)).then(async (result) => {
        if (result.isConfirmed) {
          await this.changeState(data);
        } else {
          await this.loadData();
        }
      });
  }
}