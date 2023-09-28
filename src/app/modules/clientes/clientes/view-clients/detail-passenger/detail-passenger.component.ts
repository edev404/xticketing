import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IDiscount } from 'src/app/modules/descuentos/models/modulos';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { PassengerAdminApiService } from '../../../service/passenger.admin.api.service';
import { CardPassengerComponent } from './card-passenger/card-passenger.component';

@Component({
  selector: 'app-detail-passenger',
  templateUrl: './detail-passenger.component.html',
  styleUrls: ['./detail-passenger.component.scss'],
})
export class DetailPassengerComponent implements OnInit {
  @Input() client: any;
  @Output() showTable = new EventEmitter<any>();
  @ViewChild(CardPassengerComponent) hijo!: CardPassengerComponent;

  dataTable!: IDiscount[];
  btnProperties: any[] = [
    { name: 'Cambiar estado', isDisable: true },
    { name: 'Visualizar descuento', isDisable: false },
  ];

  // SERVICES UTILS
  DISTCOUNT_PATH = 'discounts';
  entityId!: number;

  cardPassenger:boolean = false;
  isActive = 'DIP';

  // Menu
  navDetail = [
    { id: 1, code: 'DIP', name: 'Información personal' },
    { id: 2, code: 'DC', name: 'Cuenta' },
    { id: 3, code: 'DT', name: 'Tarjetas' },
    { id: 4, code: 'DD', name: 'Descuentos' },
  ];

  constructor(
    public utils: UtilsService,
    private api: PassengerAdminApiService,
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.dataTable = [];
    const response = await this.api.findAssignedDiscounts(this.utils.getBasicEndPoint(`${this.DISTCOUNT_PATH}/${this.client.id}/findAssignedDiscounts`));
    if (response.status === this.utils.successMessage) {
      this.dataTable = response.data.discount;
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  activeTarjeta() {
    this.hijo.openModalChange();
  }

  showSearch() {
    this.showTable.emit(false);
  }
}
