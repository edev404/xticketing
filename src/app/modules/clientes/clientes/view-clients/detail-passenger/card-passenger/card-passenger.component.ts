import { Component, Input, OnInit } from '@angular/core';
import { PassengerAdminApiService } from 'src/app/modules/clientes/service/passenger.admin.api.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { Cuenta } from '../../../../models/tabla.interface';

@Component({
  selector: 'app-card-passenger',
  templateUrl: './card-passenger.component.html',
  styleUrls: ['./card-passenger.component.scss']
})
export class CardPassengerComponent implements OnInit {

  // Paginado
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  page: number = 1;
  numberRow: number = 5;

  // @ViewChild('vincularTarjetaModal') vincularTarjetaModal;
  @Input() client: any;

  //DATATABLES
  tarjetastable: Cuenta[] = [];
  moveTable;
  historicoTable;

  sortTable = [
    {
      title: 'nameStateAccount',
      compare: (a: Cuenta, b: Cuenta) => a.nameStateAccount.localeCompare(b.nameStateAccount),
      priority: 2
    },
    {
      title: 'number',
      compare: (a: Cuenta, b: Cuenta) => a.number.localeCompare(b.number),
      priority: 1
    }
  ]

  isVincularActive: boolean = true;
  isVincular: boolean = true;
  isCardValid: boolean = false;
  isLastConfirm: boolean = false;

  numberCard: number | null = 0;
  nombrePersonalizado: string = '';
  numberCardCurrent: number | null = 0;
  balance: number = 0;
  mensaje: string = '';
  estadoMensaje: boolean = false;
  //ENDPOINT
  PATH = 'cards'
  modalChangeState: boolean = false;
  showData: boolean = false;

  constructor(
    public utils: UtilsService,
    private api: PassengerAdminApiService,
  ) { }

  async ngOnInit() {
    console.log(this.client)
    await this.loadData();
  }

  // Paginado met
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

  limpiarData() {
    this.isVincularActive = true;
    this.isVincular = true;
    this.isCardValid = false;
    this.isLastConfirm = false;
  }
  async loadData() {
    const response = await this.api.getList(
      this.utils.getBasicEndPoint(`${this.PATH}/${this.client.id}/findCardClient`)
    );
    if (response && response.status === this.utils.successMessage) {
      this.tarjetastable = response.data.card;
      this.tarjetastable = this.tarjetastable.sort((a: Cuenta, b: Cuenta) => (a.active > b.active ? -1 : 1));

    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async selectCard(tarjeta) {
    this.showData = true;

    const movimientos = await this.api.getList(
      this.utils.getBasicEndPoint(`${this.PATH}/${tarjeta.idAccount}/findMovement`)
    );

    if (movimientos && movimientos.status === this.utils.successMessage) {
      this.moveTable = movimientos.data.card;
    } else if (movimientos.showAlert) {
      await this.utils.openErrorAlert(movimientos.message);
    }

    const response = await this.api.getList(
      this.utils.getBasicEndPoint(`${this.PATH}/${tarjeta.idCard}/findTransaction`)
    );
    if (response && response.status === this.utils.successMessage) {
      this.historicoTable = response.data.card;
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }

  }

  donwload() {
  }

  searchMove() {
  }

  showModalVincular() {
    // const dialogRef = this.dialog.open(CardVinculateComponent, {
    //   width: '40%', disableClose: true, data: this.client
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   this.loadData();
    // });
  }

  async closeModalChange() {
    this.modalChangeState = false;
    this.numberCard = 0;
    this.isCardValid = false;
    this.isVincular = true;
    this.mensaje = '';
  }

  openModalChange() {
    this.modalChangeState = true;
  }

  async validCard() {
    this.isCardValid = false;
    const responses = await this.api.validateCuenta(this.utils.getBasicEndPoint(`passengers/has-account/${this.client.id}`));
    if (!responses.data.Pasajeros) {
      this.isCardValid = false;
      this.estadoMensaje = false;
      this.mensaje = 'El cliente no posee un perfil de cuenta.'
      setTimeout(() => {
        this.closeModalChange()
      }, 3000)
      return;
    }
    // http://ticketingws.extreme.com.co/ticketingws_prod/api/
    const response = await this.api.validateCard(this.utils.getBasicEndPoint(
      `cards/${this.client.id}/${this.client.profileAccount}/validation-card-link/?idCard=${this.numberCard}`
    ));
    if (response.status === this.utils.successMessage) {
      if (response.data.card) {
        this.isCardValid = response.data.card;
        if (this.isCardValid) {
          this.isVincular = false;
        }
        this.mensaje = 'La tarjeta es valida'
        this.estadoMensaje = true;
      } else {
        this.isCardValid = false;
        this.estadoMensaje = false;
        this.mensaje = 'Esta tarjeta no esta disponible para ser vinculada'
        this.numberCard = null;
      }
    } else {
      this.isCardValid = false;
      this.mensaje = response.message ? response.message : this.utils.errorMessage
    }
  }

  async vincularTarjeta(idCard: number = this.numberCard!) {
    this.numberCardCurrent = this.numberCard;
    const response = await this.api.getBalance(this.utils.getBasicEndPoint(`cards/${idCard}/find-balance`));
    if (response.status === this.utils.successMessage) {
      if (response.data.card > 0) {
        this.closeModalChange();
        this.isVincularActive = false;
        this.isVincular = false;
        this.balance = response.data.card;
        return;
      }

      this.vinculateCard(false);
    } else {
      await this.utils.openInfoAlert(response.message);
    }
  }

  async vinculateCard(isTransfer: boolean) {
    if (this.nombrePersonalizado != '') {
      const body = {
        isTransfer: isTransfer,
        card: this.numberCardCurrent,
        client: this.client.id,
        nombrePersonalizado: this.nombrePersonalizado
      }

      const response = await this.api.vincularCard(
        this.utils.getBasicEndPoint(`cards/card-link`), JSON.stringify(body)
      );
      if (response.status == this.utils.successMessage) {

        this.loadData()
        this.utils.openSuccessAlert('Tarjeta vinculada éxitosamente.');
        this.isVincularActive = true;
        this.closeModalChange();
      } else {
        this.utils.openErrorAlert(response.message ? response.message : this.utils.errorMessage);
      }
    }
  }
}
