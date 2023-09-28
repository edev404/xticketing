import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { CompanyService } from '../../../company/service/company.service';
import { ServicesService } from '../../service/services.service';


@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss'],
})
export class CreateServiceComponent implements OnInit {
  @Output() CreateOrEdit = new EventEmitter<any>();
  @Input() serviceId!: number | null;
  @Input() isEdit: boolean = false;

  typeCompanies;
  dataService;

  validateCode: any;
  validateNombre: any;

  idServicio: number = 0;
  
  title!: string;
  validateForm!: FormGroup;
  optionsChecks: Array<any> = [
    { 
        id: 1,
        code: '01', 
        name: 'Zona de cobertura', 
        value: false
    }, 
    { 
        id: 2, 
        code: '02', 
        name: 'Rutas', 
        value: false
    }
  ]

  // PATH APIS
  PATH = 'services';
  pathTypeCompany = 'processType';

  constructor(
    private fb: FormBuilder,
    public utils: UtilsService,
    private api: ServicesService,
    private company_api: CompanyService,
  ) {
    this.validateForm = this.fb.group({
      code: [null, [Validators.required]],
      nombre: [null, [Validators.required]],
      description: [null, [Validators.required]],
      company: [null, [Validators.required]],
    });
  }

  async ngOnInit() {
    await this.chargeService();
    await this.loadTypesCompanies();
    if (this.serviceId) {
      this.validateForm.get('code')?.disable();
      await this.loadDataByEdit();
    }else{
      this.validateForm.reset()
    }
  }

  cancelService() {
    this.CreateOrEdit.emit(false);
  }

  selectCheck(event,item){
    if(!event.currentTarget.checked){      
      item.value = false;
      return
    }
    item.value = 1;    
  }

  async saveService() {
    let form = this.validateForm
    if(!form.valid){
      Object.values(form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.utils.openErrorAlert('Revise y complete todos los campos');
          return;
        }
      });
      return
    }
    const validateCode = this.dataService.findIndex(service => service.code == form.value.code);
    const validateNombre = this.dataService.findIndex(service => service.name == form.value.name);
    
    if (!this.serviceId && validateCode > -1) {
      await this.utils.openErrorAlert('El código ingresado ya se encuentra registrado.');
      return;
    }
    if (!this.serviceId && validateNombre > -1) {
      await this.utils.openErrorAlert('El nombre ingresado ya se encuentra registrado.');
      return;
    }

    const optionsValues = this.optionsChecks.map(item => item.value ? 1 : 0);
    let resp = await this.api.create(this.utils.getBasicEndPoint(`${this.PATH}`), JSON.stringify({
        code: form.value.code,
        name: form.value.nombre,
        description: form.value.description,
        type_company: form.value.company,
        options: optionsValues.toString()
    }));
    if (resp.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(resp.message);
      form.reset();
      await this.chargeService();
      await this.loadTypesCompanies();
      this.CreateOrEdit.emit(false);
    } else if (resp.showAlert){
      await this.utils.openErrorAlert(resp.message);
    }
  }

  cambioEstado() {
    this.validateCode = this.dataService.findIndex(service => service.code == this.validateForm.value.code);
  }

  cambioNombre() {
    this.validateNombre = this.dataService.findIndex(service => service.name == this.validateForm.value.name);
  }

  async editService(){
    let form = this.validateForm
    
    if (!this.serviceId && this.validateCode > -1) {
      return;
    }
    if (!this.serviceId && this.validateNombre > -1) {
      return;
    }

    const optionsValues = this.optionsChecks.map(item => item.value ? 1 : 0);

    let resp = await this.api.update(this.utils.getBasicEndPoint(`${this.PATH}/${this.serviceId}`), JSON.stringify({
        // code: form.value.code,
        code: this.idServicio,
        name: form.value.nombre,
        description: form.value.description,
        type_company: form.value.company,
        options: optionsValues.toString(),
        active: true
    }));
    if (resp.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(resp.message);
      form.reset();
      await this.chargeService();
      await this.loadTypesCompanies();
      this.CreateOrEdit.emit(false);
    } else if (resp.showAlert){
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async chargeService() {
    const resp = await this.api.findAll(this.utils.getBasicEndPoint(`${this.PATH}/servicesAll`));
    if (resp.status === this.utils.successMessage) {
      this.dataService = resp.data.service;
    } else {
        await this.utils.openErrorAlert(resp.message);
    }
  }

  async loadOptions(options: string) {
    let optionsArray: number[] = [];
    if (options) {
      optionsArray = options.split(',').map(Number);
      this.optionsChecks = optionsArray.map((res, index) => {
        return {
          name: ['Zona de cobertura', 'Rutas'][
            index
          ],
          value: res,
        };
      });
    }    
  }

  async loadTypesCompanies() {
    const resp = await this.company_api.findAllTypesCompanies(
      this.utils.getBasicEndPoint(`${this.pathTypeCompany}`)
    );
    if (resp.status === this.utils.successMessage) {
      this.typeCompanies = resp.data.tipoProceso;
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async loadDataByEdit() {
    let form = this.validateForm;
    const resp = await this.api.findById(this.utils.getBasicEndPoint(`${this.PATH}/${this.serviceId}`));
    if (resp && resp.status === this.utils.successMessage) {
      let data = resp.data.service;      
      this.idServicio = data.code;
      form.controls['code'].setValue(data.code);
      form.controls['nombre'].setValue(data.name);
      form.controls['description'].setValue(data.description);
      form.controls['company'].setValue(parseInt(data['type_company']));
      this.loadOptions(data.options);
    } else if (resp.showAlert) {
        await this.utils.openErrorAlert(resp.message);
    }
  }
}
