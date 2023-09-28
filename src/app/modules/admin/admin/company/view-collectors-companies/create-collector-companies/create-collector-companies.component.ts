import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { Company } from '../../models/models';
import * as XLSX from 'xlsx';
import { CompanyService } from '../../service/company.service';

@Component({
  selector: 'app-create-collector-companies',
  templateUrl: './create-collector-companies.component.html',
  styleUrls: ['./create-collector-companies.component.scss']
})
export class CreateCollectorCompaniesComponent implements OnInit {
  @Output() CreateOrEdit = new EventEmitter<any>();
  @Input() companyId!: number | null;
  @Input() idTypeCompanies!: number | null;
  @Input() isEdit: boolean = false;
  @Input() showLimit!: number;

  validateForm!: FormGroup;
  validateForm2!: FormGroup;
  addCompanyModel!: Company;
  companies!: any[];
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  // Extensión
  isVisible: boolean = false;
  haveFile: boolean = false;
  currentFileName!: string | null;
  currentFileSize!: string | null;
  extension: string = '';
  dataTabla: any[] = [];

  page: number = 1;
  numberRow: number = 5;

  officeEdit: boolean = false;

  listDataSucurasles: any[] = [];

  typeCompanies;
  countryCombo
  departmentResidenceCombo;
  departmentResidenceCombo2;
  cityResidenceCombo;
  cityResidenceCombo2;

  // PATH APIS
  pathTypeCompany = 'processType';
  COUNTRIES_PATH = "masters/countries";
  DEPARMENT_PATH = "masters/departments";
  OFFICES_PATH = 'offices';
  CITIES_PATH = "masters/cities"
  pathCompanies = 'companies';
  PATH = ''

  constructor(
    private fb: FormBuilder,
    public utils: UtilsService,
    private api: CompanyService,
  ) {
    this.validateForm = this.fb.group({
      typeCompany: [null, [Validators.required]],
      name: [null, [Validators.required]],
      nitcc: [null, [Validators.required]],
      email: [null, [Validators.required]],
      code: [null, [Validators.required]],
      contry: [null, [Validators.required]],
      department: [null, [Validators.required]],
      city: [null, [Validators.required]],
      responsible: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      minimumLots: [null, [Validators.required]],
      maximumLots: [null, [Validators.required]],
      address: [null, [Validators.required]],
      maxTransByDay: [null, [Validators.required]],
      maxMountByDay: [null, [Validators.required]],
      minMountRecharge: [null, [Validators.required]],
      MaxLimitMoney: [null]
    });

    this.validateForm2 = this.fb.group({
      id: [null],
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      contry: [null, [Validators.required]],
      department: [null, [Validators.required]],
      city: [null, [Validators.required]],
      address: [null, [Validators.required]],
      phone: [null, [Validators.required]],
    });
  }

  async ngOnInit() {
    this.validateForm.get('minimumLots')?.setValue(0);
    this.validateForm.get('maximumLots')?.setValue(0);
    this.addCompanyModel = { client: {} };
    if (this.showLimit != 2) {
      this.validateForm.controls['maxTransByDay'].disable()
      this.validateForm.controls['maxMountByDay'].disable()
      this.validateForm.controls['minMountRecharge'].disable()
      this.validateForm.controls['MaxLimitMoney'].disable()
    }

    if (this.companyId) {
      await this.findCompanyByIdToEdit(this.companyId);
      await this.viewAllOffices();
    }

    await this.loadTypesCompanies();
    await this.loadCountryCombos();
    await this.loadCompanies();

    if (this.idTypeCompanies != 2) {
      this.validateForm.controls['minimumLots'].disable();
      this.validateForm.controls['maximumLots'].disable();

    }

    this.validateForm.controls['typeCompany'].setValue(this.idTypeCompanies);
    this.validateForm.controls['typeCompany'].disable();
  }

  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

  cancelCompany() {
    this.CreateOrEdit.emit(false);
  }

  createObj(pojo) {
    this.validateForm.controls['typeCompany'].enable();
    // this.validateForm.controls['minimumLots'].disable();
    // this.validateForm.controls['maximumLots'].disable();

    this.addCompanyModel.code = pojo.code;
    this.addCompanyModel.name = pojo.name;
    this.addCompanyModel.client.nit = pojo.nitcc;
    this.addCompanyModel.client.address = pojo.address;
    this.addCompanyModel.client.cityId = pojo.city;
    this.addCompanyModel.client.email = pojo.email;
    this.addCompanyModel.client.managerName = pojo.responsible;
    this.addCompanyModel.client.managerCellPhone = pojo.phone;
    this.addCompanyModel.typeId = this.idTypeCompanies;
    this.addCompanyModel.minQuantityCardByLot = pojo.minimumLots ? pojo.minimumLots : 0;
    this.addCompanyModel.maxQuantityCardByLot = pojo.maximumLots ? pojo.maximumLots : 0;
    this.addCompanyModel.maxTransactionByDay = pojo.maxTransByDay || 0;
    this.addCompanyModel.maxAmountByDay = pojo.maxMountByDay || 0;
    this.addCompanyModel.minAmountByDay = pojo.minMountRecharge || 0;
    this.addCompanyModel.tope_dinero = pojo.MaxLimitMoney || 0;
  }

  setCompanyToEdit(obj) {
    this.addCompanyModel.id = obj.id;
    this.addCompanyModel.serverHost = obj.serverHost;
    this.validateForm.controls['typeCompany'].setValue(obj.typeId);
    this.validateForm.controls['name'].setValue(obj.name);
    this.validateForm.controls['code'].setValue(obj.code);
    this.validateForm.controls['nitcc'].setValue(obj.client.nit);
    this.validateForm.controls['email'].setValue(obj.client.email);
    this.validateForm.controls['city'].setValue(obj.client.cityId);
    this.validateForm.controls['address'].setValue(obj.client.address);
    this.validateForm.controls['contry'].setValue(obj.client.countryId);
    this.validateForm.controls['phone'].setValue(obj.client.managerCellPhone);
    this.validateForm.controls['department'].setValue(obj.client.departmentId);
    this.validateForm.controls['responsible'].setValue(obj.client.managerName);
    this.validateForm.controls['minimumLots'].setValue(obj.minQuantityCardByLot ? obj.minQuantityCardByLot : 0 );
    this.validateForm.controls['maximumLots'].setValue(obj.maxQuantityCardByLot ? obj.maxQuantityCardByLot : 0);
    this.validateForm.controls['maxTransByDay'].setValue(obj.maxTransactionByDay);
    this.validateForm.controls['maxMountByDay'].setValue(obj.maxAmountByDay);
    this.validateForm.controls['minMountRecharge'].setValue(obj.minAmountByDay);
    this.validateForm.controls['MaxLimitMoney'].setValue(obj.maxBalance);
  }

  setOfficeToEdit(obj) {
    this.officeEdit = true;
    this.validateForm2.controls['id'].setValue(obj.id);
    this.validateForm2.controls['code'].setValue(obj.code);
    this.validateForm2.controls['name'].setValue(obj.name);
    this.validateForm2.controls['contry'].setValue(obj.countryId);
    this.validateForm2.controls['department'].setValue(obj.departmentId);
    this.validateForm2.controls['city'].setValue(obj.cityId);
    this.validateForm2.controls['address'].setValue(obj.address);
    this.validateForm2.controls['phone'].setValue(obj.phone);
  }

  async changeSelect(type, id) {
    switch (type) {
      case "Department":
        await this.loadResindeceDeparmentCombo(1, id);
        break;
      case "city":
        await this.loadResindeceCityCombo(1, id);
        break;
    }
  }

  async changeSelect2(type, id) {
    switch (type) {
      case "Department":
        await this.loadResindeceDeparmentCombo(2, id);
        break;
      case "city":
        await this.loadResindeceCityCombo(2, id);
        break;
    }
  }

  async findCompanyByIdToEdit(companyId) {
    const response = await this.api.getCompanyById(this.utils.getBasicEndPoint(`${this.pathCompanies}/${companyId}`));
    if (response && response.status === this.utils.successMessage) {
      this.setCompanyToEdit(response.data.company);
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async saveCompany() {
    if (!this.validateForm.valid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.createObj(this.validateForm.value);// crea el objeto de tipo Company segun la interfaz
    if (this.companies.find(e => e.code == this.addCompanyModel.code)) {
      this.utils.openInfoAlert('El código ya existe.');
      return;
    }
    const response = await this.api.create(this.utils.getBasicEndPoint(`${this.pathCompanies}`), JSON.stringify(this.addCompanyModel));
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('¡Se ha creado correctamente la empresa!');
      this.validateForm.controls['maxTransByDay'].enable();
      this.validateForm.controls['maxMountByDay'].enable();
      this.validateForm.controls['minMountRecharge'].enable();
      this.validateForm.controls['MaxLimitMoney'].enable();
      this.CreateOrEdit.emit(false);
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async editCompany() {
    if (!this.validateForm.valid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    this.createObj(this.validateForm.value);
    const response = await this.api.update(this.utils.getBasicEndPoint(`${this.pathCompanies}/${this.addCompanyModel.id}`), JSON.stringify(this.addCompanyModel));
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('Se ha actualizado la empresa correctamente');
      this.validateForm.controls['maxTransByDay'].enable();
      this.validateForm.controls['maxMountByDay'].enable();
      this.validateForm.controls['minMountRecharge'].enable();
      this.validateForm.controls['MaxLimitMoney'].enable();
      this.CreateOrEdit.emit(false);
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async createOffice() {
    let form = this.validateForm2;
    if (!form.valid) {
      Object.values(form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    let response;
    const json = {
      code: form.value.code,
      id: form.value.id,
      name: form.value.name,
      address: form.value.address,
      phone: form.value.phone,
      cityId: form.value.city,
      departmentId: form.value.department,
      countryId: form.value.contry,
      companyId: this.addCompanyModel.id
    }

    if (this.officeEdit) {
      response = await this.api.update(this.utils.getBasicEndPoint(`${this.OFFICES_PATH}/${json.id}`), JSON.stringify(json));
    } else {
      response = await this.api.create(this.utils.getBasicEndPoint(`${this.OFFICES_PATH}`), JSON.stringify(json));
    }
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert("Sucursal creada con éxito");
      this.officeEdit = false;
      form.reset();
      await this.viewAllOffices();
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async viewAllOffices() {
    const resp = await this.api.list(this.utils.getBasicEndPoint(`${this.OFFICES_PATH}?companyId=${this.companyId}`));
    if (resp.status === this.utils.successMessage) {
      this.listDataSucurasles = resp.data.offices;
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async changeStateOffice(data) {
    const response = await this.api.changeState(this.utils.getBasicEndPoint(`${this.OFFICES_PATH}/${data.id}/change-state`), !data.active);
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(response.message);
      await this.viewAllOffices();
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async loadTypesCompanies() {
    const resp = await this.api.findAllTypesCompanies(
      this.utils.getBasicEndPoint(`${this.pathTypeCompany}`)
    );
    if (resp.status === this.utils.successMessage) {
      this.typeCompanies = resp.data.tipoProceso;
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async loadCountryCombos() {
    let response = await this.api.getCountries(this.utils.getBasicEndPoint(`${this.COUNTRIES_PATH}`));
    if (response && response.status == this.utils.successMessage) {
      this.countryCombo = response.data.countries;
    }
  }

  async loadResindeceDeparmentCombo(type, value) {
    switch (type) {
      case 1:
        let response = await this.api.getDeparments(this.utils.getBasicEndPoint(`${this.DEPARMENT_PATH}?countryId=${value}`));
        if (response && response.status == this.utils.successMessage) {
          this.departmentResidenceCombo = response.data.departments;
        }
        break;
      case 2:
        let response2 = await this.api.getDeparments(this.utils.getBasicEndPoint(`${this.DEPARMENT_PATH}?countryId=${value}`));
        if (response2 && response2.status == this.utils.successMessage) {
          this.departmentResidenceCombo2 = response2.data.departments;
        }
        break;
    }
  }

  async loadResindeceCityCombo(type, value) {
    switch (type) {
      case 1:
        let response = await this.api.getCities(this.utils.getBasicEndPoint(`${this.CITIES_PATH}?departmentId=${value}`));
        if (response && response.status == this.utils.successMessage) {
          this.cityResidenceCombo = response.data.cities;
        }
        break;
      case 2:
        let response2 = await this.api.getCities(this.utils.getBasicEndPoint(`${this.CITIES_PATH}?departmentId=${value}`));
        if (response2 && response2.status == this.utils.successMessage) {
          this.cityResidenceCombo2 = response2.data.cities;
        }
        break;
    }

  }

  async loadCompanies() {
    const resp = await this.api.getCompanies(this.utils.getBasicEndPoint(`${this.pathCompanies}`));
    if (resp.status === this.utils.successMessage) {
      this.companies = resp.data.companies;
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
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

  }

  async enviar() {
    const resp = await this.api.createMasiveList(JSON.stringify(this.dataTabla), this.utils.getBasicEndPoint(`offices/create-masively`))
    if (resp.status == 'success') {
      this.utils.openSuccessAlert("Sucursales masivamente agregadas correctamente").then(() => {
        this.currentFileName = null;
        this.currentFileSize = null;
        this.haveFile = false;
        this.viewAllOffices();
      });
    } else {
      this.utils.openInfoAlert("No se lograron cargar las sucursales correctamente, vuelva a intentarlo");
    }
  }

}
