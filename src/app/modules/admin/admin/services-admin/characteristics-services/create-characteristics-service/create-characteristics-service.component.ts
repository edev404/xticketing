import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ServicesService } from '../../service/services.service';

@Component({
  selector: 'app-create-characteristics-service',
  templateUrl: './create-characteristics-service.component.html',
  styleUrls: ['./create-characteristics-service.component.scss']
})
export class CreateCharacteristicsServiceComponent implements OnInit {
  @Output() CreateOrEdit = new EventEmitter<any>();
  @Input() serviceId!: number | null;
  @Input() isEdit: boolean = false;
  @Input() data: any;

  validateForm!: FormGroup;
  validateFormCharacteristics!: FormGroup;

  listOfData2: any[] = [];

  title!: string;

  idCharacteristics!: any;

  // PATH APIS
  pathCharacteristcsServices = 'characteristicservices';

  constructor(
    private fb: FormBuilder,
    public utils: UtilsService,
    private api: ServicesService
  ) {
    this.validateForm = this.fb.group({
      code: [null, [Validators.required]],
      nombre: [null, [Validators.required]],
    });
    this.validateFormCharacteristics = this.fb.group({
      code: [null, [Validators.required]],
      valor: [null, [Validators.required]]
    })
   }

  ngOnInit(): void {
    if (this.serviceId) {
      this.isEdit = true;
      this.validateForm.controls['code'].disable();      
      this.loadDataByEdit(this.data.find(e=>e.id == this.serviceId));
    }else{      
      this.validateForm.reset()
      this.validateForm.controls['code'].disable();
    }
  }

  cancelService() {
    this.CreateOrEdit.emit(false);
  }

  async changeStatus(event,rowId){
    if(!event.currentTarget.checked){
      await this.changeStateValue(false,rowId);
      return;
    }
    await this.changeStateValue(true,rowId);
  }

  async loadDataByEdit(data){
    let form =  this.validateForm;
    form.controls['code'].setValue(data.id);
    form.controls['nombre'].setValue(data.name);
    await this.loadValuesCharacterics(data.id);
  };

  async saveService(){
    let forms = this.validateForm;
    let entities = JSON.parse(localStorage.getItem('selectedEntity')!).entities[0].id;
    let resp = await this.api.create(this.utils.getBasicEndPoint(`${this.pathCharacteristcsServices}`), JSON.stringify({
      name: forms.value.nombre,
      idEntity: entities
    }));
    if (resp.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(resp.message);
      this.CreateOrEdit.emit(false);
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async saveCharacterics() {
    let form = this.validateFormCharacteristics;
    const duplicatedCode = this.listOfData2.find((elemt) => elemt.code == form.value.code);
    const duplicatedValue = this.listOfData2.find((elemt) => elemt.value.toUpperCase() == form.value.valor.toUpperCase().trim());
    if (duplicatedCode) {
      this.utils.openInfoAlert('El código ya existe.');
      return;
    }
    if (duplicatedValue) {
      this.utils.openInfoAlert('El nombre ya existe.');
      return;
    }
    const resp = await this.api.create(this.utils.getBasicEndPoint(`${this.pathCharacteristcsServices}/addValueCharacteristic`), JSON.stringify({
      code: form.value.code,
      value: form.value.valor,
      idCharacteristicServices: this.serviceId
    }))
    if (resp.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('Valor de la característica creado correctamente.')
      await this.loadValuesCharacterics(this.data.find(e=>e.id == this.serviceId).id);
      this.validateFormCharacteristics.reset();
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async editService(){
    let forms = this.validateForm;
    let entities = JSON.parse(localStorage.getItem('selectedEntity')!).entities[0].id;

    // const validateDuplicated = this.data.find(elemt => elemt.name == forms.value.nombre);   
    // if(validateDuplicated) {
    //   this.utils.openInfoAlert('El nombre de la característica ya existe.');
    //   return;
    // }

    let resp = await this.api.update(this.utils.getBasicEndPoint(`${this.pathCharacteristcsServices}/${this.serviceId}`), JSON.stringify({
      id: this.serviceId,
      idEntity: entities,
      name: forms.value.nombre,
      status: true
    }))
    if (resp.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('Característica de servicio editado correctamente.')
      this.CreateOrEdit.emit(false);
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async changeStateValue(status,id) {
    const resp = await this.api.changeState(this.utils.getBasicEndPoint(`${this.pathCharacteristcsServices}/${id}/change-value`), status);
    if (resp.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('Estado cambiado correctamente.')
      await this.loadValuesCharacterics
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async loadValuesCharacterics(idCharactcs: number) {
    const response = await this.api.findByIdCharacteristcs(this.utils.getBasicEndPoint(`${this.pathCharacteristcsServices}/${idCharactcs}/servicesListVCharacServices`));
    if (response.status === this.utils.successMessage) {
      this.listOfData2 = response.data.service;
    } else {
        await this.utils.openErrorAlert(response.message);
    }
  }

}
