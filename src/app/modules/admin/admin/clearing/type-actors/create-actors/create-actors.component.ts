import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { TypeActor } from '../../models/models';
import { CompanyService } from '../../../company/service/company.service';
import { ClearingAdminService } from '../../service/clearingAdmin.service';

@Component({
  selector: 'app-create-actors',
  templateUrl: './create-actors.component.html',
  styleUrls: ['./create-actors.component.scss']
})
export class CreateActorsComponent implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() ActorsId;
  @Output() CreateOrEdit = new EventEmitter<any>();

  typeActor: TypeActor = {};
  typeCompanies: any[] = [];

  PATH = 'involveds';
  pathTypeCompany = 'processType';

  constructor(
    private api: ClearingAdminService,
    private company_api: CompanyService,
    public utils: UtilsService
  ) { }

  async ngOnInit() {    
    await this.loadTypesCompanies();
    if (this.ActorsId) {
      const response = await this.api.findById(this.utils.getBasicEndPoint(`${this.PATH}/${this.ActorsId}`));
      if (response && response.status === this.utils.successMessage) {
        this.typeActor = response.data.involved;
      } else if (response.showAlert) {
        await this.utils.openErrorAlert(response.message);
      }
    } else {
      this.typeActor = {};
    }
  }

  cancelCompany(){
    this.CreateOrEdit.emit(false);
  }

  emailLowerCase() {
    if (this.typeActor && this.typeActor.responsableEmail) {
      this.typeActor.responsableEmail = this.typeActor.responsableEmail.toLowerCase();
    }
  }

  async saveData() {    
    let response;
    if (this.ActorsId) {
      response = await this.api.update(this.utils.getBasicEndPoint(`${this.PATH}/${this.ActorsId}`), JSON.stringify(this.typeActor));
    } else {
      response = await this.api.create(this.utils.getBasicEndPoint(this.PATH), JSON.stringify(this.typeActor));
    }
    if (response.status === this.utils.successMessage) {
      this.utils.openSuccessAlert(this.typeActor.id ? 'Tipo de actor editado correctamente' : 'Tipo de actor creado correctamente').then(()=>{
        this.CreateOrEdit.emit(false);
      })
    } else if (response.showAlert){
      await this.utils.openErrorAlert(response.message);
    }
  }

  async loadTypesCompanies() {
    const response = await this.company_api.findAllTypesCompanies(this.utils.getBasicEndPoint(`${this.pathTypeCompany}`));
    if (response.status === this.utils.successMessage) {
      const typesCompanies = response.data.tipoProceso;
      this.typeCompanies = typesCompanies.filter(typeCompany => typeCompany.id != 1);
      this.typeCompanies.sort((a,b) => {
        const nameA = a.description.toLowerCase();
        const nameB = b.description.toLowerCase();
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      });
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

}
