import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ApiServiceCardMethodPayment } from '../../services/card.payment-methods.api';
import { CompanyService } from 'src/app/modules/admin/admin/company/service/company.service';

@Component({
  selector: 'app-recharges',
  templateUrl: './recharges.component.html',
  styleUrls: ['./recharges.component.scss']
})
export class RechargesComponent implements OnInit {

  validateForm!: FormGroup;

  listOfData: any[] = [];
  listDataSucurasles: any[] = [];
  typeRecharge: any[] = [];

  showCard: boolean = false;
  showPhone: boolean = false;

  pathCompanies = 'companies';
  OFFICES_PATH = 'offices';

  constructor(
    private fb: FormBuilder,
    public utils: UtilsService,
    private company_api: CompanyService,
    private api_: ApiServiceCardMethodPayment
  ) { 
    this.validateForm = this.fb.group({
      company: [null, [Validators.required]],
      branchOffices: [null,[Validators.required]],
      typeRecharge: [null,[Validators.required]],
      numberCard: [null],
      phone: [null],
      ValueRecharge: [null,[Validators.required]],
      // code:[null,[Validators.required]]
    });
  }

  async ngOnInit() {
    await this.loadCompanies();
    await this.getTypeRecharge();
    this.validateForm.controls['typeRecharge'].setValue('pj');
    if (this.listDataSucurasles.length <= 0) this.validateForm.controls['branchOffices'].disable();
  }

  handlerTypeRecharge(event){
    switch (event) {
      case 'tj':
        this.showPhone = false; 
        this.showCard = true; 
        break;
      case 'pj':
        this.showCard = false; 
        this.showPhone = true; 
        break;
    }
  }

  createObj(pojo: any){
    const json = this.listOfData.filter((element) => element.id == pojo.company)
    return {
      amount: pojo.ValueRecharge,
      branch: pojo.branchOffices,
      company: json[0].code,
      identifier: pojo.numberCard,
      phone: pojo.phone
    }
  }

  cleanForm(){
    this.validateForm.reset();
    this.listDataSucurasles = [];
  }

  async loadCompanies() {
    const resp = await this.company_api.getCompanies(this.utils.getBasicEndPoint(`${this.pathCompanies}/sucursales?type-id=2`));
    if (resp.status === this.utils.successMessage) {
      let data = resp.data.companies;
      let companies:Array<any> = [];
      for (let i = 0; i < data.length; i++) {
        let d = data[i];
        companies.push({...d, ...d.client});
      }
      this.listOfData = companies;
      
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async viewAllOffices(companyId) {
    if(!companyId) return;
    
    const resp = await this.company_api.list(this.utils.getBasicEndPoint(`${this.OFFICES_PATH}/virtual?companyId=${companyId}`));
    if (resp.status === this.utils.successMessage) {
      this.listDataSucurasles = resp.data.offices;
      console.log(this.listDataSucurasles.length > 0);
      
      if (this.listDataSucurasles.length > 0) {
        this.validateForm.controls['branchOffices'].enable();
      } else {
        this.validateForm.controls['branchOffices'].setValue(null);
        this.validateForm.controls['branchOffices'].disable();
      }
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async getTypeRecharge() {
    this.typeRecharge = await this.api_.getLista('TIPOS_DE_RECARGAS');      
  }

  async saveRecharge() {
    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    let json = this.createObj(this.validateForm.value);
    const resp = await this.api_.createRecharge(this.utils.getRecahrgeEndPoint('recharge-external/deposit'), json)
    if (!resp.error) {
      await this.utils.openSuccessAlert('¡Recarga realizada exitosamente!');
      this.validateForm.reset();
      this.listDataSucurasles = [];
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

}
