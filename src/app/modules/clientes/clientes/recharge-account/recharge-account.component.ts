import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ClientAccountsData } from '../../models/clientAccountsData';
import { Motivos } from '../../models/motivos';
import { PassengerAdminApiService } from '../../service/passenger.admin.api.service';
import { IClient } from '../../models/client';
import { PQR } from '../../models/pqr.interface';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';
import { ApiServiceCardMethodPayment } from 'src/app/modules/medios-pago/services/card.payment-methods.api';

@Component({
  selector: 'app-recharge-account',
  templateUrl: './recharge-account.component.html',
  styleUrls: [
    './recharge-account.component.scss',
    '../../../../../assets/themes/white/core/_formulario.scss',
  ],
})
export class RechargeAccountComponent implements OnInit {
  public form!: FormGroup;
  validateForm: FormGroup;
  public searchInput = '';
  public accountData!: ClientAccountsData | undefined;
  idPassengers: number = 0;
  passengers: any;
  typeRecharge: any[] = [];
  pqr: PQR[] = [];
  pqrAsociadas: boolean = false;
  showCard: boolean = false;
  showPhone: boolean = false;
  validarPqr: boolean = false;
  public motivos: Motivos | any = new Motivos();

  public servicios: any;

  clientForm: IClient = new IClient();

  private PATH = 'passengers';
  private RECHARGE_PATH = 'transaction/recharge';
  private RECHARGE = 'transaction';
  private PATH_MOTIVOS = 'listvalues';

  // PQR
  listaPQR: any[] = [];

  public tiposAjuste: any = [
    {
      label: 'Aumentar saldo',
      value: 'A',
      motivo: 'MOTIVOS AUMENTAR',
    },
    {
      label: 'Disminuir saldo',
      value: 'D',
      motivo: 'MOTIVOS DISMINUIR',
    },
  ];

  constructor(
    private _api: ApiServiceService,
    private api: PassengerAdminApiService,
    public utils: UtilsService,
    private fb: FormBuilder,
    private api_: ApiServiceCardMethodPayment
  ) {
    this.form = this.fb.group({
      motivo: ['', [Validators.required]],
      valor: ['', [Validators.required]],
      pqr: [''],
      descripcion: ['', [Validators.required]],
      tipoAjuste: ['', [Validators.required]],
      casoFraude: [''],
    });
    this.validateForm = this.fb.group({
      typeRechar: [null, [Validators.required]],
      identifier: [null],
      phone: [null],
    });
    this.setValidatorFalse(false, 'pqr');
  }

  async ngOnInit() {
    this.getTypeRecharge();
    this.typeChange(undefined);
  }

  cleanInput(event: any) {
    const input = event.target.value;
    const cleanValue = input.replace(/[^\d]/g, ''); // Elimina todos los caracteres no numéricos excepto los dígitos
    if (cleanValue !== input) {
      event.target.value = cleanValue;
    }
  }

  selectMotivo(e) {
    try {
      let motivo = this.motivos.find((m) => {
        return m.code == 'SNC';
      });
      if (this.form.value.motivo == motivo.id) {
        return;
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  clientNull() {
    this.accountData!.cuenta = 0;
    this.accountData!.idClienteExterno = null;
    this.accountData!.identificacion = null;
    this.accountData!.nombre = null;
    this.accountData!.saldo = null;
    this.accountData!.tarjeta = null;
  }

  setValidatorFalse(e: boolean, field) {
    if (e) {
      this.form.controls[field].setValidators([Validators.required]);
      this.form.controls[field].enable();
    } else {
      this.form.controls[field].clearValidators();
      this.form.controls[field].disable();
      this.formChangeValue(field);
    }
  }

  formChangeValue(field) {
    this.form.controls[field].setValue('');
  }

  async typeChange(e) {
    let list = this.tiposAjuste.find((t) => {
      return t.value == this.form.value.tipoAjuste;
    });
    if (list != undefined) {
      if (list.value == 'D') {
        this.setValidatorFalse(true, 'casoFraude');
        this.setValidatorFalse(false, 'pqr');
        this.form.controls['pqr'].enable();
        this.validarPqr = false;
      } else {
        this.setValidatorFalse(false, 'casoFraude');
        this.setValidatorFalse(true, 'pqr');
        this.validarPqr = true;
        if (this.pqrAsociadas) {
          this.form.get('tipoAjuste')?.setValue(undefined);
        }
      }
      await this.getMotivos(list);
      return;
    } else {
      this.validarPqr = false;
    }
    this.setValidatorFalse(false, 'casoFraude');
    this.motivos.length = 0;
  }

  handlerTypeRecharge(event) {
    switch (event) {
      case 'ct':
        this.showPhone = false;
        this.showCard = true;
        this.validateForm.get('identifier')?.setValidators(Validators.required);
        this.validateForm.get('identifier')?.updateValueAndValidity();
        this.validateForm.get('phone')?.clearValidators();
        this.validateForm.get('phone')?.updateValueAndValidity();
        break;
      case 'pj':
        this.showCard = false;
        this.showPhone = true;
        this.validateForm.get('identifier')?.clearValidators();
        this.validateForm.get('identifier')?.updateValueAndValidity();
        this.validateForm.get('phone')?.setValidators(Validators.required);
        this.validateForm.get('phone')?.updateValueAndValidity();
        break;
      default: {
        this.showCard = false;
        this.showPhone = false;
      }
    }
  }

  async showBoucher(id) {
    const response = await this._api.getFile(
      this.utils.getBasicEndPoint(
        `http://calidad.extreme.com.co:9008/api/v1/jasper/CONN?fileName=rep_recharge_v2&type=PDF&ID=${id}`
      )
    );
  }

  getSelectedEntity() {
    return JSON.parse(localStorage.getItem('selectedEntity')!).entities[0].id;
  }

  preventPaste(event: ClipboardEvent) {
    event.preventDefault();
    // También puedes mostrar un mensaje de aviso al usuario si lo deseas.
  }

  async obtenerUsuario() {
    this.clientForm.document = Number(this.accountData!.identificacion);
    let entity = this.utils.getSelectedEntity();
    const response = await this.api.loadClients(
      this.utils.getBasicEndPoint(`passengers/${entity}/dataClient`),
      JSON.stringify(this.clientForm)
    );
    this.passengers = response.data.client;
    this.idPassengers = response.data.client[0].id;
    this.cargarPQR();
  }

  async buscarDatosCuenta() {
    let response;
    if (this.validateForm.valid) {
      // if (this.validateForm.get('identifier')?.value) {
      response = await this._api.get(
        this.utils.getBasicEndPoint(
          `${this.RECHARGE}/account-filter?identifier=${this.validateForm.value.identifier || ''
          }&phone=${this.validateForm.value.phone || ''}`
        )
      );

      this.validateForm.get('identifier')?.setValue(this.validateForm.value.identifier ?  this.validateForm.value.identifier : null);
      this.validateForm.get('phone')?.setValue(this.validateForm.value.phone ?  this.validateForm.value.phone : null);
      this.form.reset();
      if (response.status === this.utils.successMessage) {
        if (response.data.filter) {
          this.accountData! = response.data.filter;
          this.obtenerUsuario();
        } else {
          await this.utils.openInfoAlert(
            'No se encontró información con esos parámetros de búsqueda.'
          );
          this.clientNull();
        }
      } else {
        await this.utils.openErrorAlert(
          response.message ? response.message : this.utils.errorMessage
        );
      }
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

  async recargar() {
    const json = this.form.value.tipoAjuste;

    if (this.form.valid) {
      // if (this.form.value.valor > this.accountData!.saldo! && json.value == "D") {
      //   await this.utils.openErrorAlert("El saldo a disminuir debe ser menor al saldo actual");
      //   return;
      // }
      let body = {
        tarjeta: this.validateForm.value.identifier ? this.validateForm.value.identifier : null,
        phone: this.validateForm.value.phone
          ? this.validateForm.value.phone
          : null,
        identifier: this.validateForm.value.identifier
          ? this.validateForm.value.identifier
          : null,
        ...this.form.value,
      };
      console.log(body);
      const response = await this.api.rechargeAccount(
        this.utils.getBasicEndPoint(`${this.RECHARGE_PATH}`),
        body
      );
      if (response.status == 'success') {
        await this.buscarDatosCuenta();
        // await this.showBoucher(response.result);
        await this.utils.openSuccessAlert('Se realizó el ajuste con exito.');
        this.cargarPQR();
      } else {
        await this.utils.openErrorAlert(response.message);
      }
      return;
    }
    Object.values(this.form.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
        return;
      }
    });
  }

  cargarPQR() {
    this.api.cargarPQR(Number(this.idPassengers)).subscribe({
      next: (value: any) => {
        this.pqr = value.data.pqr;
        if (value.data.pqr.length == 0) {
          this.pqrAsociadas = true;
          return;
        }
        this.pqrAsociadas = false;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  async getMotivos(list) {
    const response = await this._api.get(
      this.utils.getBasicEndPoint(
        `${this.PATH_MOTIVOS
        }/list-motive?idEntidad=${this.utils.getSelectedEntity()}&nameList='${list.motivo
        }'&active=true`
      )
    );
    if (response.status === this.utils.successMessage) {
      if (response.data.value) {
        this.motivos = response.data.value;
      }
    }
    this.formChangeValue('motivo');
  }

  async getTypeRecharge() {
    this.typeRecharge = await this.api_.getLista('AJUSTES_SALDO');
  }
}
