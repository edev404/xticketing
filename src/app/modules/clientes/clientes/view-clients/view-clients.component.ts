import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { IClient } from '../../models/client';
import { PassengerAdminApiService } from '../../service/passenger.admin.api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ServiceRateService } from 'src/app/modules/tarifas/service/service-rate.service';
import { UserInfo } from '../../models/tabla.interface';
import { ILocation } from '../../models/location';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';

@Component({
  selector: 'app-view-clients',
  templateUrl: './view-clients.component.html',
  styleUrls: ['./view-clients.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class ViewClientsComponent implements OnInit {

  //Table
  listOfData: UserInfo[] = [];
  listOfDataCopy: UserInfo[] = [];
  buscar: boolean = false;
  // Filter advanced
  advanced = false;
  // Paginado
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  page: number = 1;
  numberRow: number = 5;

  filterValueTable: string = '';
  sortTable = [
    {
      title: 'documento',
      compare: (a: IClient, b: IClient) => a.document! - b.document!,
      priority: false
    },
    {
      title: 'name',
      compare: (a: IClient, b: IClient) => a.name!.localeCompare(b.name!),
      priority: 2
    },
    {
      title: 'lastName',
      compare: (a: IClient, b: IClient) => a.lastName!.localeCompare(b.lastName!),
      priority: 3
    },
    {
      title: 'cellPhone',
      compare: (a: IClient, b: IClient) => a.cellPhone!.localeCompare(b.cellPhone!),
      priority: 4
    },
    {
      title: 'email',
      compare: (a: IClient, b: IClient) => a.email!.localeCompare(b.email!),
      priority: 5
    },
    {
      title: 'typeAccount',
      compare: (a: IClient, b: IClient) => a.typeAccount! - b.typeAccount!,
      priority: 6
    },
    {
      title: 'profileAccount',
      compare: (a: IClient, b: IClient) => a.profileAccount! - b.profileAccount!,
      priority: 7
    },
    {
      title: 'numberAccount',
      compare: (a: IClient, b: IClient) => a.numberAccount! - b.numberAccount!,
      priority: 8
    }
  ]
  // Object
  clientForm: IClient = new IClient;

  // Masters combos
  comboNit;
  maritalStatesCombo;
  occupationsCombo;
  genderCombo;
  countryCombo;
  departmentIdBornPlaceList;
  departmentIdResidencePlaceList;
  municipalyIdBornPlaceList;
  municipalyIdResidencePlaceList;
  clientsProfiles;
  typeAccount;

  showColum = {
    tipoDocumento: true,
    documento: true,
    nombre: true,
    apellido: true,
    correoElectronico: true,
    telefono: true,
    tipoDeCuenta: true,
    perfilDeCuenta: true,
    numeroDeCuenta: true,
    fechaDeRegistro: true
  }

  //Fechas
  startValue: Date | null = null;
  endValue: Date | null = null;
  startValueNac: Date | null = null;
  endValueNac: Date | null = null;
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  validateForm!: FormGroup;
  avanzadoMore: boolean = false;

  // All Variables
  showFilter: boolean = true;
  viewDetails: boolean = false;
  dataRowSelected;

  // PDF
  urlFile;
  isVisiblePDF: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _api: PassengerAdminApiService,
    private sanitazer: DomSanitizer,
    private api: DescuentosService,
    public utils: UtilsService
  ) {
    this.listOfData = [];
    this.validateForm = this.fb.group({
      tipo: [null],
      documento: [null, [Validators.required]],
      nombre: [null],
      apellido: [null],
      genero: [null],
      telefono: [null],
      correo_electronico: [null, [this.gmailValidator]],
      estado_civil: [null],
      profesion: [null],
      rangePickerstartValue: [null],
      rangePickerendValue: [null],
      pais: [null],
      countryResidenceLocation: [null],
      departmentBornLocation: [null],
      departmentResidenceLocation: [null],
      ciudad: [null],
      ciudad2: [null],
      numero_cuenta: [null],
      tipo_cuenta: [null],
      nombre_usuario: [null],
      numero_tarjeta: [null],
      perfil_cuenta: [null],
      rangePickerstartValueCard: [null],
      rangePickerendValueCard: [null],
    });


  }

  // Validar formato correo
  gmailValidator(control: FormControl): any {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      // El campo está vacío, no se aplica la validación
      return null;
    }
    // const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2})?$/;
    const emailRegex: RegExp = /^[a-z-0-9.-]*[a-z-0-9._%+-]+@[a-z.-]+\.[a-z]+$/;
    // const emailRegex: RegExp = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-z]+$/

    console.log(emailRegex.test(value))
    // Ejemplo de uso:
    if (!emailRegex.test(value)) {
      return { invalidEmailFormat: true };
    }
    return null
  }

  limpiarData() {
    this.clientForm.bornLocation =   new ILocation(); 
    this.clientForm.residenceLocation = new ILocation();
    this.clientForm.name = '';
    this.clientForm.email = '';
  }

  reset() {
    this.validateForm.reset();
    this.clientForm.type = this.validateForm.value.tipo;
    this.clientForm.bornLocation!.country.id = this.validateForm.value.pais;
    this.clientForm.bornLocation!.department.id = this.validateForm.value.departmentBornLocation;
    this.clientForm.residenceLocation!.country.id = this.validateForm.value.countryResidenceLocation;
    this.clientForm.residenceLocation!.department.id = this.validateForm.value.departmentResidenceLocation;
    this.clientForm.name = this.validateForm.value.nombre;
    this.clientForm.document = this.validateForm.value.documento;
    this.clientForm.lastName = this.validateForm.value.apellido;
    this.clientForm.email = this.validateForm.value.correo_electronico;
    this.clientForm.cellPhone = this.validateForm.value.telefono;
    this.clientForm.genderId = this.validateForm.value.genero;
    this.clientForm.stateId = this.validateForm.value.estado_civil;
    this.clientForm.professionId = this.validateForm.value.profesion;
    this.clientForm.dateInit = this.validateForm.value.rangePickerstartValue;
    this.clientForm.datEnd = this.validateForm.value.rangePickerendValue;
    this.clientForm.bornLocation!.city.id = this.validateForm.value.ciudad;
    this.clientForm.residenceLocation!.city.id = this.validateForm.value.ciudad2;
    this.clientForm.numberAccount = this.validateForm.value.numero_cuenta;
    this.clientForm.typeAccount = this.validateForm.value.tipo_cuenta;
    this.clientForm.userName = this.validateForm.value.nombre_usuario;
    this.clientForm.numberCard = this.validateForm.value.numero_tarjeta;
    this.clientForm.profileAccount = this.validateForm.value.perfil_cuenta;
    this.clientForm.dateInitCard = this.validateForm.value.rangePickerstartValueCard;
    this.clientForm.datEndCard = this.validateForm.value.rangePickerendValueCard;

    this.validateForm.get('documento')?.disable();
  }

  clearSearch() {
    this.buscar = false;
    this.validateForm.reset();
    this.listOfData = [];
  }

  // Paginado met
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

  async ngOnInit() {
    this.validateForm.get('documento')?.disable();
    await this.loadIdentificationCombo();
    await this.loadGenders();
    await this.loadMaritalStateCombo();
    await this.loadOccupationsCombo();
    await this.loadLocationCombos();
    await this.loadTypeAccount();
    await this.loadClientProfile();
  }

  viewColum(event, check) {
    switch (check) {
      case 1:
        this.showColum.tipoDocumento = !this.showColum.tipoDocumento
        break;
      case 2:
        this.showColum.documento = !this.showColum.documento
        break;
      case 3:
        this.showColum.nombre = !this.showColum.nombre
        break;
      case 4:
        this.showColum.apellido = !this.showColum.apellido
        break;
      case 5:
        this.showColum.correoElectronico = !this.showColum.correoElectronico
        break;
      case 6:
        this.showColum.telefono = !this.showColum.telefono
        break;
      case 7:
        this.showColum.tipoDeCuenta = !this.showColum.tipoDeCuenta
        break;
      case 8:
        this.showColum.perfilDeCuenta = !this.showColum.perfilDeCuenta
        break;
      case 9:
        this.showColum.numeroDeCuenta = !this.showColum.numeroDeCuenta
        break;
      case 10:
        this.showColum.fechaDeRegistro = !this.showColum.fechaDeRegistro
        break;
    }
  }

  async loadIdentificationCombo() {
    const response = await this._api.getIdentificationTypes(this.utils.getBasicEndPoint(`masters/identification-types`));
    if (response && response.status === this.utils.successMessage) {
      this.comboNit = response.data.identificationTypes;
    }
  }

  async loadGenders() {
    const response = await this._api.getGenders(this.utils.getBasicEndPoint(`masters/genders`));
    if (response && response.status === this.utils.successMessage) {
      this.genderCombo = response.data.genders;
    }
  }

  async loadMaritalStateCombo() {
    const response = await this._api.getMaritalState(this.utils.getBasicEndPoint(`masters/marital-states`));
    if (response && response.status === this.utils.successMessage) {
      this.maritalStatesCombo = response.data.maritalStates;
    }
  }

  async loadOccupationsCombo() {
    const response = await this._api.getOccupations(this.utils.getBasicEndPoint(`masters/occupations`));
    if (response && response.status === this.utils.successMessage) {
      this.occupationsCombo = response.data.occupations;
    }
  }

  async loadLocationCombos() {
    const response = await this._api.getCountries(this.utils.getBasicEndPoint('masters/countries'));
    if (response && response.status === this.utils.successMessage) {
      this.countryCombo = response.data.countries;
    }
  }

  async loadTypeAccount() {
    const response = await this._api.getList(this.utils.getBasicEndPoint('passengers/typeAccount'));
    if (response && response.status === this.utils.successMessage) {
      this.typeAccount = response.data.accountsData;
    }
  }

  async loadClientProfile() {
    const response = await this._api.getProfiles(this.utils.getBasicEndPoint('clientprofile/clientProfileAll'));
    if (response && response.status === this.utils.successMessage) {
      this.clientsProfiles = response.data.service;
    }
  }


  saveData() {

  }

  async changeType() {
    const type = this.validateForm.value.tipo;
    if (type == null) {
      this.clientForm.type = null;
      this.clientForm.document = null;
      this.validateForm.get('documento')?.disable();
      return;
    }
    this.validateForm.get('documento')?.enable();
  }

  async loadDepartmentCombo(value, type) {
    var response;
    if (type === 'born') {
      response = await this._api.getDepartments(this.utils.getBasicEndPoint(`masters/departments?countryId=${this.validateForm.value.pais}`));
      this.clientForm.bornLocation!.department.id = null;
      this.clientForm.bornLocation!.city.id = null;
      if (!value) {
        this.departmentIdBornPlaceList = [];
        this.municipalyIdBornPlaceList = [];
      }
    } else {
      response = await this._api.getDepartments(this.utils.getBasicEndPoint(`masters/departments?countryId=${this.validateForm.value.countryResidenceLocation}`));
      this.clientForm.residenceLocation!.department.id = null;
      this.clientForm.residenceLocation!.city.id = null;
      if (!value) {
        this.departmentIdResidencePlaceList = [];
        this.municipalyIdResidencePlaceList = [];
      }
    }
    if (response.status === this.utils.successMessage) {
      if (type === 'born') {
        this.departmentIdBornPlaceList = response.data.departments;
      } else {
        this.departmentIdResidencePlaceList = response.data.departments;
      }
    }
  }

  async loadCityCombo(value, type) {
    var response;
    if (type === 'born') {
      response = await this._api.getCities(this.utils.getBasicEndPoint(`masters/cities?departmentId=${this.validateForm.value.departmentBornLocation}`));
      this.clientForm.bornLocation!.city.id = null;
      if (!value) {
        this.municipalyIdBornPlaceList = [];
      }
    } else {
      response = await this._api.getCities(this.utils.getBasicEndPoint(`masters/cities?departmentId=${this.validateForm.value.departmentResidenceLocation}`));
      this.clientForm.residenceLocation!.city.id = null;
      if (!value) {
        this.municipalyIdResidencePlaceList = [];
      }
    }
    if (response.status === this.utils.successMessage) {
      if (type === 'born') {
        this.municipalyIdBornPlaceList = response.data.cities;
      } else {
        this.municipalyIdResidencePlaceList = response.data.cities;
      }
    }
  }

  searchTable() {
    let data: any[];
    if (this.filterValueTable || (this.filterValueTable && this.filterValueTable.trim() != '')) {
      data = this.listOfDataCopy.filter(
        (current: any) => {
          return this.utils.validateObject(current.identificationType) && current.identificationType!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            this.utils.validateObject(current.identification) && current.identification!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            this.utils.validateObject(current.email) && current.email!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            this.utils.validateObject(current.cellPhone) && current.cellPhone!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            this.utils.validateObject((current.firstName + " " + current.secondName)) && (current.firstName + " " + current.secondName)!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            this.utils.validateObject((current.lastName + " " + current.secondLastName)) && (current.lastName + " " + current.secondLastName)!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            this.utils.validateObject(current.nameTypeAccount) && current.nameTypeAccount!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            this.utils.validateObject(current.nameProfileAccount) && current.nameProfileAccount!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            this.utils.validateObject(current.idSavings) && current.idSavings!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            this.utils.validateObject(current.dateRegister) && current.dateRegister!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
        }
      );
      if (data) {
        this.listOfData = data;
      }
    } else {
      if (this.listOfDataCopy) {
        this.listOfData = this.listOfDataCopy;
        this.filterValueTable = ''
      }
    }
  }

  removeNullProperties(obj) {
    for (const prop in obj) {
      if (obj[prop] === null) {
        delete obj[prop];
      } else if (typeof obj[prop] === 'object') {
        this.removeNullProperties(obj[prop]); // Recursivamente llamamos la función para objetos anidados
      }
    }
  }

  async search() {
    this.buscar = false;
    this.listOfData = [];
    if (!this.validateForm.value.tipo && !this.validateForm.value.pais && !this.validateForm.value.departmentBornLocation &&
      !this.validateForm.value.countryResidenceLocation && !this.validateForm.value.departmentResidenceLocation &&
      !this.validateForm.value.nombre && !this.validateForm.value.documento && !this.validateForm.value.apellido &&
      !this.validateForm.value.correo_electronico && !this.validateForm.value.telefono && !this.validateForm.value.genero &&
      !this.validateForm.value.estado_civil && !this.validateForm.value.profesion && !this.validateForm.value.rangePickerstartValue &&
      !this.validateForm.value.rangePickerendValue && !this.validateForm.value.ciudad && !this.validateForm.value.ciudad2 &&
      !this.validateForm.value.numero_cuenta && !this.validateForm.value.tipo_cuenta && !this.validateForm.value.nombre_usuario &&
      !this.validateForm.value.numero_tarjeta && !this.validateForm.value.cuenta && !this.validateForm.value.rangePickerstartValueCard &&
      !this.validateForm.value.rangePickerendValueCard && !this.validateForm.value.perfil_cuenta) {
      await this.utils.openInfoAlert('Debe llenar alguno de los campos para poder filtrar');
      return;
    }

    if (this.clientForm.type != null && this.clientForm.document == undefined) {
      await this.utils.openInfoAlert('Debe ingresar el documento de identidad.');
      return;
    }

    // Validar campos del Lugar de nacimiento
    if (this.clientForm.bornLocation!.country.id && this.clientForm.bornLocation!.department.id == undefined) {
      await this.utils.openInfoAlert('Debe seleccionar el departamento en el lugar de nacimiento.');
      return;
    }

    if (this.clientForm.bornLocation!.country.id && this.clientForm.bornLocation!.department.id && this.clientForm.bornLocation!.city.id == null) {
      await this.utils.openInfoAlert('Debe seleccionar la ciudad en el lugar de nacimiento.');
      return;
    }

    // Validar campos de Lugar de residencia:
    if (this.clientForm.residenceLocation!.country.id && this.clientForm.residenceLocation!.department.id == undefined) {
      await this.utils.openInfoAlert('Debe seleccionar el departamento en el lugar de residencia.');
      return;
    }

    // tslint:disable-next-line: max-line-length
    if (this.clientForm.residenceLocation!.country.id && this.clientForm.residenceLocation!.department.id && this.clientForm.residenceLocation!.city.id == null) {
      await this.utils.openInfoAlert('Debe seleccionar la ciudad en el lugar de residencia.');
      return;
    }

    if (this.validateForm.get('correo_electronico')?.invalid) {
      return;
    }

    // Validar fecha
    if (this.clientForm.dateInit && this.clientForm.datEnd == undefined || this.clientForm.dateInit == undefined && this.clientForm.datEnd ||
      this.clientForm.dateInitCard && this.clientForm.datEndCard == undefined || this.clientForm.dateInitCard == undefined && this.clientForm.datEndCard) {
      await this.utils.openInfoAlert('Debe seleccionar fecha inicio y fecha fin.');
      return;
    }

    if (this.clientForm.dateInit! > this.clientForm.datEnd! || this.clientForm.dateInitCard! > this.clientForm.datEndCard!) {
      await this.utils.openInfoAlert('La fecha inicio no puede ser mayor a la fecha fin.');
      return;
    }

    // if (this.clientForm.cellPhone === undefined) {
    //   this.clientForm.cellPhone = null;
    // }

    this.advanced = false;
    let entity = this.utils.getSelectedEntity();

    const response = await this._api.loadClients(this.utils.getBasicEndPoint(`passengers/${entity}/dataClient`), JSON.stringify(this.clientForm));
    if (response && response.status === this.utils.successMessage) {
      const data = response.data.client.map(value => {
        if (!value.nameTypeAccount) {
          value.nameTypeAccount = '';
        }
        if (!value.nameProfileAccount) {
          value.nameProfileAccount = '';
        }
        if (!value.numberAccount) {
          value.numberAccount = '';
        }
        return value;
      });

      this.listOfData = data;
      this.listOfDataCopy = this.listOfData;
      this.avanzadoMore = false;
      if (this.listOfData.length > 0) {
        this.buscar = true;
      }
      if (this.listOfData.length == 0) {
      await this.utils.openInfoAlert('Cliente no encontrado');
      }
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
    this.reset();
    this.limpiarData()
  }

  avanzado() {
    if (this.avanzadoMore === false) {
      this.avanzadoMore = true;
    } else {
      this.avanzadoMore = false;
    }
  }

  resetearValor(event) {
    this.startValueNac = event;
    // this.clientForm.datEnd = null;
  }
  resetearValor2(event) {
    this.startValue = event;
    // this.clientForm.datEndCard = null;
  }
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue) {
      return false; // Permitir seleccionar el día de hoy si no hay fecha seleccionada
    }

    const today = new Date();
    // today.setHours(0, 0, 0, 0); // Establecer las horas, minutos, segundos y milisegundos a cero para comparar solo las fechas

    return startValue.getTime() > today.getTime(); // Inhabilitar días anteriores (estrictamente menor que el día de hoy)
  };


  disabledEndDate = (endValue: Date) => {
    if (!this.startValueNac) {
      return false; // Permitir seleccionar el día de hoy si no hay fecha seleccionada
    }
    return endValue.getTime() <= this.startValueNac!.getTime() || endValue.getTime() >= new Date().getTime(); // Inhabilitar días anteriores (estrictamente menor que el día de hoy)
  };

  disabledStartDate2 = (startValue: Date): boolean => {
    if (!startValue) {
      return false; // Permitir seleccionar el día de hoy si no hay fecha seleccionada
    }

    const today = new Date();
    // today.setHours(0, 0, 0, 0); // Establecer las horas, minutos, segundos y milisegundos a cero para comparar solo las fechas

    return startValue.getTime() > today.getTime(); // Inhabilitar días anteriores (estrictamente menor que el día de hoy)
  };


  // disabledEndDate2 = (endValue: Date): boolean => {
  //   if (!this.validateForm.value.rangePickerstartValueCard) {
  //     return false; // Permitir seleccionar el día de hoy si no hay fecha seleccionada
  //   }
  //   return endValue.getTime() <= this.validateForm.value.rangePickerstartValueCard!.getTime(); // Inhabilitar días anteriores (estrictamente menor que el día de hoy)
  // };

  disabledEndDate2 = (endValue: Date): boolean => {
    if (!this.validateForm.value.rangePickerstartValueCard) {
      return false; // Permitir seleccionar el día de hoy si no hay fecha seleccionada
    }

    // Validar si la fecha de vigencia hasta es mayor o igual a la fecha de vigencia desde
    const startDate = this.validateForm.value.rangePickerstartValueCard;
    return endValue.getTime() <= startDate.getTime() || endValue.getTime() >= new Date().getTime();
  };

  handleStartOpenChange(open: boolean): void {
    // if (!open) {
    //   this.endDatePicker.open();
    // }
    // console.log('handleStartOpenChange', open);
  }

  handleEndOpenChange(open: boolean): void {
    // console.log('handleEndOpenChange', open);
  }

  showFilterInputs() {
    if (this.showFilter) {
      this.showFilter = false;
    } else {
      this.showFilter = true;
    }
  }

  showDetail(event, dataRow) {
    if (event && dataRow) {
      this.viewDetails = true;
      this.dataRowSelected = dataRow;
    } else {
      this.viewDetails = false;
      this.dataRowSelected = null;
    }
  }

  /**
 * Cerrar modal detalle de fraude
 */
  closeModalShow(): void {
    this.isVisiblePDF = false;
  }

  renderFileInTemplateDownloads() {
    this.isVisiblePDF = true;
    const body = {
      "fileName": "XT_ReporteClientes_202307",
      "type": "PDF",
      "typeDataSource": "CONN",
      "connect": "TICKETING",
      "params": {
        "USUARIO": "Alison Prieto",
        "IDENTIFICACION": this.validateForm.value.documento ? this.validateForm.value.documento : null,
        "TIPO_IDENTIFICACION": this.validateForm.value.tipo ? this.validateForm.value.tipo : null,
        "ID_GENERO": this.validateForm.value.genero ? this.validateForm.value.genero : null,
        "ID_PROFESION": this.validateForm.value.profesion ? this.validateForm.value.profesion : null,
        "TIPO_CUENTA": this.validateForm.value.tipo_cuenta ? this.validateForm.value.tipo_cuenta : null,
        "TELEFONO": this.validateForm.value.telefono ? this.validateForm.value.telefono : null,
        "NOMBRE": this.validateForm.value.nombre ? this.validateForm.value.nombre : null,
        "APELLIDO": this.validateForm.value.apellido ? this.validateForm.value.apellido : null,
        "EMAIL": this.validateForm.value.correo_electronico ? this.validateForm.value.correo_electronico : null,
        "ID_EST_CIVIL": this.validateForm.value.estado_civil ? this.validateForm.value.estado_civil : null,
        "ID_MUN": this.validateForm.value.ciudad ? this.validateForm.value.ciudad : null,
        "ID_PAIS": this.validateForm.value.pais ? this.validateForm.value.pais : null,
        "ID_DEPTO": this.validateForm.value.departmentBornLocation ? this.validateForm.value.departmentBornLocation : null,
        "NOM_USU": this.validateForm.value.nombre_usuario ? this.validateForm.value.nombre_usuario : null,
        "PERFIL_CUENTA": this.validateForm.value.perfil_cuenta ? this.validateForm.value.perfil_cuenta : null,
        "ID_AHORRO": this.validateForm.value.numero_cuenta ? this.validateForm.value.numero_cuenta : null,
        "NUMERO_TARJ": this.validateForm.value.numero_tarjeta ? this.validateForm.value.numero_tarjeta : null,
        "FECHA_FIN_NAC": this.endValueNac ? this.validateForm.value.endValueNac : null,
        "FECHA_INI_NAC": this.startValueNac ? this.validateForm.value.startValueNac : null,
        "FECHA_INI": this.startValue ? this.validateForm.value.startValue : null,
        "FECHA_FIN": this.endValue ? this.validateForm.value.endValue : null
      }
    }
    this.api.downloadImageDiscountReports(body)
      .subscribe(
        {
          next: (value: Blob) => {
            const urlCreator = window.URL || window.webkitURL;
            this.urlFile = this.sanitazer.bypassSecurityTrustUrl(urlCreator.createObjectURL(value));
            this.urlFile = this.urlFile.changingThisBreaksApplicationSecurity;
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

}
