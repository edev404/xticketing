import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { IPassenger } from '../../models/passenger';
import { PassengerAdminApiService } from '../../service/passenger.admin.api.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-passenger',
  templateUrl: './create-passenger.component.html',
  styleUrls: ['./create-passenger.component.scss', '../../../../../assets/themes/white/core/_formulario.scss'],
})
export class CreatePassengerComponent implements OnInit {
  // UTILS SERVICES
  private PATH = 'passengers';
  private CODE_GENERATE = 'generate-code';
  private CHECK_GENERATE = 'check-code';
  estado: boolean = true;

  // ARCHIVP
  extension: string = '';
  dataTabla: any[] = [];
  isVisible: boolean = false;
  haveFile: boolean = false;
  currentFileName!: string;
  currentFileSize!: string;

  // Manejar Modal de residencias
  departamentoModal: boolean = false;
  ciudadModal: boolean = false;

  // Conductor data
  conductorDisponible: boolean = true;

  // NG FORM
  passenger: IPassenger = new IPassenger();
  passengerCopy: IPassenger = new IPassenger();

  // MASTERS COMBO
  countryCombo;
  departmentResidenceCombo: any[] = [];
  cityResidenceCombo: any[] = [];
  departmentBornCombo: any[] = [];
  cityBornCombo: any[] = [];
  codeContryHas: any[] = [];
  comboNit;
  profileCombo;
  comboCompanies;
  maritalStatesCombo;
  occupationsCombo;
  genderChecks;
  date = null;
  validateForm!: FormGroup;

  companyDisable: boolean = false;
  perfilDisable: boolean = false;
  idUser!: number;

  // Almacena de donde se ha creado el formulario de cliente
  @Output() mostrarFormClientOPersonalizar: EventEmitter<boolean> = new EventEmitter();
  @Input() creadoDesdeMetodosPagos: boolean = false;
  estadoForm = false;
  @Output() creadoDesdeMetodosPagosEnviado: EventEmitter<boolean> = new EventEmitter();
  @Input() passengerId;
  @Input() saveAction?: Function;

  constructor(
    private fb: FormBuilder,
    private _api: PassengerAdminApiService,
    public _datePipe: DatePipe,
    public utils: UtilsService,
    private route: ActivatedRoute,
    private Router: Router
  ) {
    this.validateForm = this.fb.group({
      perfilcuenta: [null, [Validators.required]],
      empresa: [null, [Validators.required]],
      nitType: [null, [Validators.required]],
      identificationNumber: [null, [Validators.required]],
      firtsname: [null, [Validators.required]],
      secondName: [[]],
      mail: [null, [this.gmailValidator]],
      profession: [null],
      born: [null, [Validators.required]],
      civilStatus: [null],
      passengerGender: [null, [Validators.required]],
      codePhone: [null],
      cellPhone: [null, [Validators.required]],
      countryResidenceLocation: [null],
      departmentBornLocation: [null],
      departmentResidenceLocation: [null],
      municipalityResidenceLocation: [null],
      countryBornLocation: [null],
      municipalityBornLocation: [null],
      address: [null],
      lastName: [null, [Validators.required]],
      secondLastName: [[]],
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

  onChange(result: Date): void {
    // console.log('onChange: ', result);
  }

  async ngOnInit() {
    this.idUser = parseInt(this.route.snapshot.paramMap.get('id')!);
    if (this.idUser) {
      this.estado = false;
      await this.chargeEditPassenger(this.idUser);
    }
    await this.loadProfileAccounts();
    await this.loadCompaniesCombo();
    await this.loadLocationCombos();
    await this.loadIdentificationCombo();
    await this.loadMaritalStateCombo();
    await this.loadOccupationsCombo();
    await this.loadGenders();
    this.codeContryHas = this.utils.getContryHas();
    this.validateForm.controls['codePhone'].setValue(57);
  }

  // CHARGE COMBOS
  async loadProfileAccounts() {
    const response = await this._api.getList(
      this.utils.getBasicEndPoint(`clientprofile/clientProfileAll`)
    );
    if (response && response.status === this.utils.successMessage) {
      this.profileCombo = response.data.service;
    } else {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async loadLocationCombos() {
    const response = await this._api.getCountries(
      this.utils.getBasicEndPoint('masters/countries')
    );
    if (response && response.status === this.utils.successMessage) {
      this.countryCombo = response.data.countries;
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async loadCompaniesCombo() {
    const entity = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (entity) {
      const idEntity = entity.entities[0].id;

      const response = await this._api.getList(
        this.utils.getBasicEndPoint(`users/${idEntity}/companies`)
      );

      if (response && response.status === this.utils.successMessage) {
        this.comboCompanies = response.data.companies;
      } else {
        await this.utils.openErrorAlert(response.message);
      }
    }
  }

  async loadIdentificationCombo() {
    const response = await this._api.getIdentificationTypes(
      this.utils.getBasicEndPoint(`masters/identification-types`)
    );
    if (response && response.status === this.utils.successMessage) {
      this.comboNit = response.data.identificationTypes;
      this.passenger.identificationTypeId = this.comboNit[0].id;
    }
  }

  disabledfechaMayor = (endValueNac): boolean => {
    // Convertimos la fecha inicial en un objeto Date
    const fechaInicial = new Date();
    // Aumentamos 12 años a la fecha inicial
    fechaInicial.setFullYear(fechaInicial.getFullYear() - 12);

    // Ahora puedes obtener la nueva fecha en el formato deseado
    const nuevaFechaString = fechaInicial.toISOString();
    if (endValueNac) {
      // console.log(endValueNac)
      return endValueNac.getTime() > new Date(nuevaFechaString).getTime();
    }
    return false
  };

  async loadMaritalStateCombo() {
    const response = await this._api.getMaritalState(
      this.utils.getBasicEndPoint(`masters/marital-states`)
    );
    if (response && response.status === this.utils.successMessage) {
      this.maritalStatesCombo = response.data.maritalStates;
    }
  }

  async loadOccupationsCombo() {
    const response = await this._api.getOccupations(
      this.utils.getBasicEndPoint(`masters/occupations`)
    );
    if (response && response.status === this.utils.successMessage) {
      this.occupationsCombo = response.data.occupations;
    }
  }

  async loadGenders() {
    const response = await this._api.getGenders(
      this.utils.getBasicEndPoint(`masters/genders`)
    );
    if (response && response.status === this.utils.successMessage) {
      this.genderChecks = response.data.genders;
      // console.log('genders', this.genderChecks);
    }
    //this.isOpen = !this.isOpen;
  }

  async diferentClient(event) {
    if (this.passenger.accountProfile != 3 && this.passenger.idCompany && event.charCode == 13) {
      const response = await this._api.getList(
        this.utils.getBasicEndPoint(
          `${this.PATH}/${this.passenger.identification}/dataClientXtrack?idProcess=${this.passenger.idCompany}`
        )
      );

      if (response && response.status === this.utils.successMessage) {
        if (response.data.Official) {
          await this.utils.openSuccessAlert('Datos encontrados correctamente');

          (this.passenger.address = response.data.Official.address),
            (this.passenger.firstName = response.data.Official.name),
            (this.passenger.cellPhone = response.data.Official.cellPhone),
            (this.passenger.email = response.data.Official.mail),
            (this.passenger.bornDate = response.data.Official.dateBirth);
        }
      } else {
        this.conductorDisponible = false;
        this.utils.openErrorAlert('¡No se encontró un funcionario con esta identificación!')
      }
    }
  }

  async loadResindeceDeparmentCombo(value) {
    let response: any;
    if (value) {
      response = await this._api.getDepartments(
        this.utils.getBasicEndPoint(
          `masters/departments?countryId=${value}`
        )
      );
    } else {
      response = await this._api.getDepartments(
        this.utils.getBasicEndPoint(
          `masters/departments?countryId=${this.validateForm.value.countryResidenceLocation}`
        )
      );
      this.passenger.residenceLocation!.department.id = '';
      this.passenger.residenceLocation!.city.id = '';
      if (!value) {
        this.departmentResidenceCombo.length = 0;
        this.cityResidenceCombo.length = 0;
      }
    }

    if (response && response.status === this.utils.successMessage) {
      this.departmentResidenceCombo = response.data.departments;
    }
  }

  setGenderCode(e) {
    let perfil = this.genderChecks.find(
      (g) => g.id == this.validateForm.value.passengerGender
    );
    this.passenger.genderCode = perfil.code;
  }

  async loadBornCityCombo(value) {
    let response: any;
    if (value) {
      response = await this._api.getCities(
        this.utils.getBasicEndPoint(
          `masters/cities?departmentId=${value}`
        )
      );
    } else {
      response = await this._api.getCities(
        this.utils.getBasicEndPoint(
          `masters/cities?departmentId=${this.validateForm.value.departmentBornLocation}`
        )
      );
      this.passenger.bornLocation!.city.id = '';
      if (!value) {
        this.cityBornCombo.length = 0;
      }
    }

    if (response && response.status === this.utils.successMessage) {
      this.cityBornCombo = response.data.cities;
    }
  }

  async loadResindeceCityCombo(value) {
    let response: any;
    if (value) {
      response = await this._api.getCities(
        this.utils.getBasicEndPoint(
          `masters/cities?departmentId=${value}`
        )
      );
    } else {
      response = await this._api.getCities(
        this.utils.getBasicEndPoint(
          `masters/cities?departmentId=${this.validateForm.value.departmentResidenceLocation}`
        )
      );
      this.passenger.residenceLocation!.city.id = '';
      if (!value) {
        this.cityResidenceCombo.length = 0;
      }
    }

    if (response && response.status === this.utils.successMessage) {
      this.passenger.residenceLocation!.city.id = null;
      this.cityResidenceCombo = response.data.cities;
    }
  }

  async loadBornDeparmentCombo(value) {
    let response: any;
    if (value) {
      response = await this._api.getDepartments(
        this.utils.getBasicEndPoint(
          `masters/departments?countryId=${value}`
        )
      );
    } else {
      response = await this._api.getDepartments(
        this.utils.getBasicEndPoint(
          `masters/departments?countryId=${this.validateForm.value.countryBornLocation}`
        )
      );
      this.passenger.bornLocation!.department.id = '';
      this.passenger.bornLocation!.city.id = '';
      if (!value) {
        this.departmentBornCombo.length = 0;
        this.cityBornCombo.length = 0;
      }
    }

    if (response && response.status === this.utils.successMessage) {
      this.passenger.bornLocation!.city.id = null;
      this.departmentBornCombo = response.data.departments;
    }
  }

  locationBornValidation(): boolean {
    let location = this.passenger.bornLocation;
    if (location!.country.id) {
      return location!.department.id && location!.city.id ? true : false;
    }
    return true;
  }

  locationResidenceValidation(): boolean {
    let location = this.passenger.residenceLocation;
    if (location!.country.id) {
      this.departamentoModal = location!.department.id ? true : false;
      this.ciudadModal = location!.city.id ? true : false;
      return location!.department.id && location!.city.id ? true : false;
    }
    return true;
  }

  emitirEvento(estado: boolean) {
    this.creadoDesdeMetodosPagosEnviado.emit(estado)
    this.creadoDesdeMetodosPagos = false;
  }

  clearSearch() {
    this.validateForm.reset();
  }

  getSelectedEntity() {
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));
    if (entity) {
      const username = entity.username;
      return username;
    }
    return null;
  }

  async saveData() {
    if (this.validateForm.valid) {
      if (!this.conductorDisponible) {
        await this.utils.openErrorAlert('Se debe realizar el registro del conductor en la plataforma Xtrack.');
        return;
      }

      if (!this.locationBornValidation()) {
        if (this.departmentResidenceCombo) {
          await this.utils.openErrorAlert(
            '¡Por favor seleccione una ciudad!'
          );
        } else {
          await this.utils.openErrorAlert(
            '¡Por favor seleccione un departamento!'
          );
        }
        return;
      }

      if (!this.locationResidenceValidation()) {
        if (this.departmentBornCombo) {
          await this.utils.openErrorAlert(
            '¡Por favor seleccione una ciudad!'
          );
        } else {
          await this.utils.openErrorAlert(
            '¡Por favor seleccione un departamento!'
          );
        }
        return;
      }

      this.passenger['userCreator'] = this.getSelectedEntity()
      if (!(this.passenger['email'] !== null && this.passenger['email'] !== undefined && this.passenger['email'] !== "")) {
        delete this.passenger.email;
      }

      this.passenger['bornLocation'] = this.passenger.bornLocation?.country.id ? this.passenger.bornLocation : { city: {}, country: {}, department: {} };
      this.passenger['residenceLocation'] = this.passenger.residenceLocation?.country.id ? this.passenger.residenceLocation : { city: {}, country: {}, department: {} };

      if (this.creadoDesdeMetodosPagos) {
        this.passenger.codePhone = '+' + this.passenger.codePhone;
        let response = await this._api.createPassenger(JSON.stringify(this.passenger), this.utils.getBasicEndPoint(`${this.PATH}`));
        if (response && response.status === this.utils.successMessage) {
          await Swal.fire(
            this.utils.getSuccessModalOptions(
              `Cliente ${response.data.passenger.firstName} ${response.data.passenger.lastName} (${response.data.passenger.id})`,
              this.utils.titleSuccessMessage
            )
          );
          this.estadoForm = true;
          this.validateForm.reset();
          this.validateForm.controls['codePhone'].setValue(57);
          this.mostrarFormClientOPersonalizar.emit(true)
        } else {
          this.estadoForm = false;
          await Swal.fire(this.utils.getErrorModalOptions(response.message));
          this.mostrarFormClientOPersonalizar.emit(false)
        }
      } else {
        this.passenger.codePhone = '+' + this.passenger.codePhone;
        let response = await this._api.createPassenger(JSON.stringify(this.passenger), this.utils.getBasicEndPoint(this.PATH));
        if (response && response.status === this.utils.successMessage) {
          await Swal.fire(this.utils.getSuccessModalOptions(
            `¡El cliente ${response.data.passenger.firstName} ${response.data.passenger.lastName} ha sido creado correctamente!`,
            this.utils.titleSuccessMessage
          )
          );
          this.validateForm.reset();
          this.validateForm.controls['codePhone'].setValue(57);
        } else {
          await Swal.fire(this.utils.getErrorModalOptions(response.message));
        }
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.utils.openErrorAlert('Revise y complete todos los campos');
          return;
        }
      });
    }

    if (this.creadoDesdeMetodosPagos && this.validateForm.valid && this.estadoForm) {
      this.emitirEvento(true)
    }
  }

  async editData() {
    if (!this.validateForm.valid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.utils.openErrorAlert('Revise y complete todos los campos');
          return;
        }
      });
      return
    }

    if (this.isNotValidEmailAndCellPhone()) {
      await Swal.fire(this.utils.getErrorModalOptions('No puede cambiar el teléfono y el correo al mismo tiempo. Elija uno de los dos y espere 24 horas para cambiar el otro dato'));
      return;
    }
    this.passenger['bornLocation'] = this.passenger.bornLocation?.country.id ? this.passenger.bornLocation : { city: {}, country: {}, department: {} };
    this.passenger['residenceLocation'] = this.passenger.residenceLocation?.country.id ? this.passenger.residenceLocation : { city: {}, country: {}, department: {} };
    this.passenger['userCreator'] = this.getSelectedEntity()
    const resp = await this._api.updatePassenger(JSON.stringify(this.passenger), this.utils.getBasicEndPoint(`${this.PATH}/${this.passenger.id}`));
    if (resp.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(resp.message);
      this.Router.navigateByUrl('/main/clientes');
    } else {
      await this.utils.openErrorAlert('No se ha podido editar el cliente');
    }
    this.perfilDisable = false;
  }

  async chargeEditPassenger(passengerData) {
    if (passengerData) {
      const response = await this._api.getPassengerById(this.utils.getBasicEndPoint(`passengers/${passengerData}`));
      if (response.status === this.utils.successMessage) {
        this.passenger = await this.createPassengerObject(response.data.passenger);
        this.validateForm.get('perfilcuenta')?.disable()
        this.validateForm.get('empresa')?.disable()
        this.perfilDisable = true;
      }
      this.passengerCopy = JSON.parse(JSON.stringify(this.passenger));
    }
  }

  getNewPassenger(): IPassenger {
    return {
      bornLocation: { city: {}, country: {}, department: {} },
      residenceLocation: { city: {}, country: {}, department: {} }
    };
  }

  async createPassengerObject(pojo) {
    const result: IPassenger = this.getNewPassenger();
    result.id = pojo.id;
    result.accountProfile = pojo.accountProfile;
    result.idCompany = pojo.idCompany;
    result.identification = pojo.identification;
    result.identificationType = pojo.identificationType;
    result.identificationTypeId = pojo.identificationTypeId;
    result.lastName = pojo.lastName;
    result.maritalState = pojo.maritalState;
    result.maritalStateId = pojo.maritalStateId;
    result.occupation = pojo.occupation;
    result.occupationId = pojo.occupationId;
    result.residenceLocation = pojo.residenceLocation;
    result.secondName = pojo.secondName;
    result.secondLastName = pojo.secondLastName;
    result.active = pojo.active;
    result.address = pojo.address;
    result.age = pojo.age;
    result.bornDate = pojo.bornDate;
    result.bornLocation = pojo.bornLocation;
    result.card = pojo.card;
    result.cardId = pojo.cardId;
    result.cellPhone = pojo.cellPhone;
    result.email = pojo.email;
    result.firstName = pojo.firstName;
    result.gender = pojo.gender;
    result.genderId = pojo.genderId;
    result.canUpdateCellPhone = pojo.canUpdateCellPhone;
    result.canUpdateEmail = pojo.canUpdateEmail;

    if (!result.bornLocation) {
      result.bornLocation = { city: {}, country: {}, department: {} };
    }

    if (!result.residenceLocation) {
      result.residenceLocation = { city: {}, country: {}, department: {} };
    }
    console.log("undefined?", result.residenceLocation.country.id);

    if (result.residenceLocation.country.id) {
      await this.loadResindeceDeparmentCombo(result.residenceLocation.country.id);
      await this.loadResindeceCityCombo(result.residenceLocation.department.id);
      result.residenceLocation.department.id = result.residenceLocation.department.id;
      result.residenceLocation.city.id = result.residenceLocation.city.id;
    }
    if (result.bornLocation.country.id) {
      await this.loadBornDeparmentCombo(result.bornLocation.country.id);
      await this.loadBornCityCombo(result.bornLocation.department.id);
      result.bornLocation.department.id = result.bornLocation.department.id;
      result.bornLocation.city.id = result.bornLocation.city.id;
    }
    return result;
  }

  disabledCompany(event) {
    let form = this.validateForm;
    if (event == 3) {
      this.conductorDisponible = true;
      form.controls['empresa'].disable();
      this.validateForm.get('empresa')?.setValue(null);
      this.companyDisable = true;
    } else {
      form.controls['empresa'].enable();
      this.companyDisable = false;
    }
  }


  isNotValidEmailAndCellPhone() {
    return this.passenger.email !== this.passengerCopy.email && this.passenger.cellPhone !== this.passengerCopy.cellPhone;
  }

  // Configuracion de cargar masivos
  async handleFile() {
    // Linea que cuenta la linea del excel
    const inputElement = document.getElementById('fileInput') as HTMLInputElement; // Obtener el elemento de entrada de archivo por su id
    if (inputElement.files && inputElement.files.length > 0) { // Verificar si se ha seleccionado un archivo
      const file = inputElement.files[0]; // Obtener el primer archivo seleccionado
      const fileNameParts = file.name.split('.'); // Dividir el nombre del archivo en partes separadas por punto
      this.extension = fileNameParts[fileNameParts.length - 1]; // Obtener la última parte como la extensión
      this.currentFileName = file.name;
      this.currentFileSize = this.utils.formatBytes(file.size);
      const jsonData = await this.leerArchivos(this.extension, file);
      if (inputElement.value) {
        this.haveFile = true;
      } else {
        this.haveFile = false;
      }
      inputElement.value = ''; // Restablecer el valor a una cadena vacía
    }
    console.log(this.dataTabla)
  }

  leerArchivos(fileExtension: string, file: File): any {
    switch (fileExtension) {
      case 'xlsx': {
        // console.log(fileExtension);
        return new Promise((resolve, reject) => {
          const reader: FileReader = new FileReader();

          reader.onload = (e: any) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
            const header = jsonData[0]; // Obtener la primera fila como encabezado
            // Validamos columnas
            const result: any[] = [];
            for (let i = 1; i < jsonData.length; i++) { // Iterar a través de las filas de datos (omitir la primera fila que es el encabezado)
              const row = jsonData[i];
              const obj: any = {};

              for (let j = 0; j < header.length; j++) { // Iterar a través de las columnas y asignar los valores a las propiedades del objeto
                const key = header[j];
                const value = row[j];
                obj[key] = value;
              }
              result.push(obj); // Agregar el objeto al resultado final
            }
            this.dataTabla = result;
            resolve(result);
          };

          reader.onerror = (e) => {
            reject(e);
          };

          reader.readAsArrayBuffer(file);
        });
      }
      case 'csv': {
        // console.log(fileExtension);
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const contents = e.target!.result as string; // Obtener el contenido del archivo como una cadena de texto
            const lines = contents.split('\n'); // Dividir el contenido en líneas
            const header = lines[0].split('.csv'); // Obtener la primera línea como encabezado
            const result: any[] = [];

            for (let i = 1; i < lines.length - 1; i++) { // Iterar a través de las líneas de datos (omitir la primera línea que es el encabezado)
              const line = lines[i];
              const row = line.split('.csv');

              const obj: any = {};
              for (let j = 0; j < header.length; j++) { // Iterar a través de las columnas y asignar los valores a las propiedades del objeto
                const key = header[j];
                const value = row[j];
                obj[key] = value;
              }
              result.push(obj); // Agregar el objeto al resultado final
            }
            this.dataTabla = result;
            resolve(result)
          };
          reader.onerror = (error) => {
            reject(error);
          };

          reader.readAsText(file);
        })
      }
      case 'txt': {
        // console.log(fileExtension);
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const contents = e.target!.result as string;
            const rows = contents.split("\n"); // Dividir el contenido por saltos de línea para obtener filas individuales
            const headers = rows[0].split('.txt'); // Obtener los encabezados de la primera fila
            headers.pop();
            rows.pop();

            const jsonData: any[] = [];

            for (let i = 1; i < rows.length - 1; i++) {
              const values = rows[i].split('.txt'); // Obtener los valores de cada fila
              const rowObject = {};

              for (let j = 0; j < headers.length; j++) {
                rowObject[headers[j]] = values[j]; // Asignar los valores a las claves correspondientes
              }

              jsonData.push(rowObject); // Agregar el objeto de fila al arreglo de datos JSON
            }
            this.dataTabla = jsonData;
            resolve(jsonData);
          };

          reader.onerror = (error) => {
            reject(error);
          };

          reader.readAsText(file);
        });
      }
      default: {
        console.log("Esta extensión no está disponible");
      }
    }
  }


}
