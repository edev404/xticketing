import { Component, OnInit } from '@angular/core';
import { ApiServiceCardMethodPayment } from '../../services/card.payment-methods.api';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { DetalleRecarga } from '../../models/detalleRecarga';

@Component({
  selector: 'app-details-recharge',
  templateUrl: './details-recharge.component.html',
  styleUrls: ['./details-recharge.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class DetailsRechargeComponent implements OnInit {
  // BUSCAR
  filterValueTable: string = ''
  sucursal: string = ''
  mostrarData: boolean = false;
  dateSelect!:Date;

  // PAGINATION
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  numberRow: number = 5;
  page: number = 1;
  detallesRecarga: DetalleRecarga[] = [];
  recargaSucursal: string[] = [];
  detallesRecargaCopy: DetalleRecarga[] = [];

  constructor(private _apiServiceCardMethodPayment: ApiServiceCardMethodPayment, public utils: UtilsService) { }

  async ngOnInit(): Promise<void> {
    const resp = await this._apiServiceCardMethodPayment.getRecharge(this.utils.getBasicEndPoint('cards/detalle-recarga'))
    if (resp.status == 'success') {
      this.detallesRecarga = resp.data.cards;
      this.detallesRecargaCopy = this.detallesRecarga;
      this.mostrarData = this.detallesRecarga.length > 0 ? true : false;

      this.detallesRecarga.forEach((element) => {
        this.recargaSucursal.push(element.nombre_sucursal)
      })
    }
    this.recargaSucursal = Array.from(new Set(this.recargaSucursal)).filter(element => element);
  }

  // Paginador
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }
  onChangePage(event: number): void {
    this.page = event;
  }

  search() {
    let data: any[];
    if (this.filterValueTable || (this.filterValueTable && this.filterValueTable.trim() != '')) {
      data = this.detallesRecargaCopy.filter(
        (current: any) => {
          return this.utils.validateObject(current.fecha_transaccion) && current.fecha_transaccion!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
          // this.utils.validateObject(current.numero_tarjeta) && current.numero_tarjeta.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
          // this.utils.validateObject(current.valor_recargado) && current.valor_recargado.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
          // this.utils.validateObject(current.nombre_empresa) && current.nombre_empresa.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
          // this.utils.validateObject(current.nombre_sucursal) && current.nombre_sucursal.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
        }
      );
      if (data) {
        this.detallesRecarga = data;
      }
    } else {
      if (this.detallesRecargaCopy) {
        this.detallesRecarga = this.detallesRecargaCopy;
        this.filterValueTable = ''
      }
    }
  }

  filtrarSucursal() {
    this.detallesRecarga = this.detallesRecargaCopy;
    if (this.sucursal) {
      this.detallesRecarga = this.detallesRecarga.filter((element) => element.nombre_sucursal == this.sucursal);
      return;
    }
  }

  filterbyDate() {
    if (!this.dateSelect) {
      this.utils.openInfoAlert('Por favor seleccione una fecha');
      return;
    }

    const resultadosFiltrados = this.detallesRecarga.filter((obj)=>{
      let fecha = this.utils.formatDate(new Date(obj.fecha_transaccion));      
      return fecha === this.utils.formatDate(this.dateSelect);
    });
    this.detallesRecarga = resultadosFiltrados;
  }

  clearData() {
    if (this.dateSelect) return;
    this.detallesRecarga = this.detallesRecargaCopy;
  }
}
