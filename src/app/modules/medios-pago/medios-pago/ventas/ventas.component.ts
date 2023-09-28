import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/modules/admin/admin/company/service/company.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ApiServiceCardMethodPayment } from '../../services/card.payment-methods.api';
import { CardInfo, VentasValid } from '../../models/Ventas.interface';
import { EntitesService } from 'src/app/modules/admin/admin/entites/service/entites.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  listOfData: any[] = [];
  listDataSucurasles: any[] = [];
  listOfDataEntities: any[] = [];

  validateForm!: FormGroup;

  pathCompanies = 'companies';
  OFFICES_PATH = 'offices';

  habilitarBoton = true;


  constructor(
    private formBuilder: FormBuilder,
    public utils: UtilsService,
    private company_api: CompanyService,
    private api: EntitesService,
    private api_: ApiServiceCardMethodPayment) {
    this.validateForm = this.formBuilder.group({
      company: [null, [Validators.required]],
      branchOffices: [null, [Validators.required]],
      serial: [null, [Validators.required]],
      activo: [null]
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
    this.loadData();
  }

  
  getSelectedEntity() {
    return JSON.parse(localStorage.getItem('selectedEntity')!).entities[0].id;
  }

  async loadData() {
    console.log(this.getSelectedEntity())
    this.api.ListEntities().subscribe(
      response => {
        this.listOfDataEntities = response.data.entities.sort((a, b) => b.active - a.active);
        console.log(this.listOfDataEntities)
      }
    );
  }



  async loadCompanies() {
    const resp = await this.company_api.getCompanies(this.utils.getBasicEndPoint(`${this.pathCompanies}/sucursales?type-id=2`));
    if (resp.status === this.utils.successMessage) {
      let data = resp.data.companies;
      let companies: Array<any> = [];
      for (let i = 0; i < data.length; i++) {
        let d = data[i];
        companies.push({ ...d, ...d.client });
      }
      this.listOfData = companies;

    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async viewAllOffices(companyId) {
    if (!companyId) return;

    const resp = await this.company_api.list(this.utils.getBasicEndPoint(`${this.OFFICES_PATH}/virtual?companyId=${companyId.id}`));
    if (resp.status === this.utils.successMessage) {
      this.listDataSucurasles = resp.data.offices;

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

  limpiar() {
    this.validateForm.reset();
    this.listDataSucurasles.length = 0;
  }

  async validarCard() {
    if (this.validateForm.valid) {
      const data = await this.listOfDataEntities.find((element) => element.id == this.getSelectedEntity())
      const json: VentasValid = {
        source: {
          company: this.validateForm.value.company.code,
          branch: this.validateForm.value.branchOffices,
          entity: data.code
        },
        serial: this.validateForm.value.serial,
        fabricsr: this.validateForm.value.activo ? this.validateForm.value.activo : false
      }
      this.api_.validarCard('transaction/card/validate', json)
        .subscribe(
          {
            next: (value: any) => {
              if (!value.data.avaliable) {

                this.utils.openInfoAlert(`${value.data.message ? value.data.message : 'No fue posible procesar la tarjeta proporcionada'}`)
                this.habilitarBoton = true;
                return;
              }
              this.utils.openInfoAlert(`La tarjeta es valida para su comercialización, tiene un costo de: $${value.data.value}`).then();
              this.habilitarBoton = false;

            }, error: (err: any) => {
              console.log()
            }
          }
        )
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          return;
        }
      });
    }
  }
  venderCard() {
    const data = this.listOfDataEntities.find((element) => element.id == this.getSelectedEntity())
    if (this.validateForm.valid) {
      const json: VentasValid = {
        source: {
          company: this.validateForm.value.company.code,
          branch: this.validateForm.value.branchOffices,
          entity: data.code
        },
        serial: this.validateForm.value.serial,
        fabricsr: this.validateForm.value.activo ? this.validateForm.value.activo : false
      }
      this.api_.validarCard('transaction/card/sell', json)
        .subscribe(
          {
            next: (value: any) => {
              if (value.error) {
                this.utils.openErrorAlert(`${value.message}`)
              } else {
                this.utils.openSuccessAlert(`${value.message}`)
                this.validateForm.reset();
                this.listDataSucurasles.length = 0;
                this.habilitarBoton = true;
              }
            }, error: (err: any) => {
              console.log()
            }
          }
        )
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          return;
        }
      });
    }
  }
}
