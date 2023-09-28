import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { Card } from '../../models/Card';
import { CardsDashboard } from '../../models/cardsDashboard';
import { Registry } from '../../models/Registry';
import { ApiServiceCardMethodPayment } from '../../services/card.payment-methods.api';
import { Historial } from '../../models/historial';
import { ApiServiceUserAdmin } from 'src/app/modules/admin/admin/user/service/user.admin.api';
import { EntitesService } from 'src/app/modules/admin/admin/entites/service/entites.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class DashboardComponent implements OnInit {
  adminData: any[] = [];
  navModules = [];
  isActive = '';
  isVisibleModel: boolean = false;
  menu = true;
  width;
  cardsDashboard: any[] = [];
  stock: any = 0;
  stocktarjetas: any = 0;
  filterValue!: string;
  filterValueTable!: string;
  selectedCard!: Card;

  historyTable: Historial[] = []
  fechas = []

  // PAGINATION
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  numberRow: number = 5;
  page: number = 1;


  // permission
  changeState;
  edit;

  // OCULTAMIENTO
  mostrarData!: boolean;
  loading: boolean = false;
  isVisible: boolean = false;

  dataTable!: any[];
  dataTableCopy!: any[] | any;

  PATH = "cards";

  detailType!: string
  detailTitle!: string
  detailNumber!: number
  dangerClass!: boolean

  actions: any = [];
  columns: { label: string, name: string, type?: string }[] = []

  purchaseBatches: Registry[] = []
  purchaseBatchesAggregated: any[] = []

  initializationBatches: any[] = []
  initializationBatchesAggregated: any[] = []

  distributionBatches: any[] = []
  activeResponse: any

  constructor(
    private entites_api: EntitesService,
    private api: ApiServiceCardMethodPayment,
    private utils: UtilsService,
    private router: Router,
  ) {
    this.actions = [
      { label: undefined, action: this.history, class: "", tooltip: "Historial", text: "Historial" },
    ]
    this.columns = [
      { label: '', name: 'check', type: 'string' },
      { label: 'ID Tarjeta', name: 'id', type: 'string' },
      { label: 'Estado', name: 'status' },
      { label: 'Proveedor', name: 'provider' },
      { label: 'Fecha de compra', name: 'purchase_date' },
      { label: 'Lote inicialización', name: '' },
      { label: 'Fecha inicialización', name: 'init_request_date' },
      { label: 'Ente recaudador', name: '' },
      { label: 'Lote distribución', name: 'inventory_date' },
      { label: 'Fecha activación', name: '' },
      { label: 'Número de cuenta', name: 'account' },
      { label: 'Tipo tarjeta', name: 'card_type' }
    ]
  }

  // paginado
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }
  onChangePage(event: number): void {
    this.page = event;
  }

  closeModal(): void {
    this.isVisible = false;
  }
  history = (card: Card): void => {
    this.selectedCard = card
    this.loadHistory()
    //this.openModalCardHistory(this.modalCardHistory)
  }

  async loadHistory() {
    const response = await this.api.getCardHistory(this.selectedCard.id)
    if (response) {
      this.historyTable = response.data.history
      this.historyTable = [
        {
          fechaRegistro: this.historyTable[0].fechaRegistro,
          evento: "Registro",
          detalle: "-"
        },
        {
          fechaRegistro: this.historyTable[0].fechaCompra,
          evento: "Compra",
          detalle: "-"
        },
        {
          fechaRegistro: this.historyTable[0].fechaInventario,
          evento: "Inventario",
          detalle: "-"
        },
        {
          fechaRegistro: this.historyTable[0].fechaCreacion,
          evento: "Creacion",
          detalle: "-"
        }
        // Agrega más objetos con los datos que desees mostrar
      ];
    }
  }

  async ngOnInit() {

    this.chargeOptions();
    this.getSelectedNavModule();
    this.getDashboardData();
    this.entidadCargada();
    this.getSelectedEntity();
  }


  entidadCargada() {
    this.entites_api.ListEntities()
      .subscribe(
        {
          next: (value: any) => {
            this.adminData = value.data.entities;
            this.adminData = this.adminData.filter((element) => element.id == this.getSelectedEntity())
          },
          error: (err: any) => {
            console.log(err)
          }
        }
      )
  }

  async getDashboardData() {
    const entity = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (entity) {
      const idEntity = entity.entities[0].id;
      const response = await this.api.getDashboard(idEntity);
      if (response.status === this.utils.successMessage) {
        this.cardsDashboard = response.data.cardsDashboard
        // this.stock = this.cardsDashboard ? this.cardsDashboard[0].total : 0;
        // this.stocktarjetas = this.cardsDashboard.stocktarjetas;
      } else {
        await this.utils.openErrorAlert(response.message);
      }
    }
  }

  public getSelectedNavModule() {
    const m = this.router.url.split('/');
    if (m.length > 2) {
      this.isActive = m[3];
    }
  }

  chargeOptions() {
    const menuOptions = JSON.parse(localStorage.getItem('actionsByModules')!);
    if (menuOptions) {
      this.navModules = menuOptions[0].actions;
      this.setActions(menuOptions[0].actions[0].subActions);
    }
  }

  setActions(object) {
    this.utils.setActions(JSON.stringify(object));
  }

  search() {
    let data: Card[];
    if (this.filterValueTable || (this.filterValueTable && this.filterValueTable.trim() != '')) {
      data = this.dataTableCopy.filter(
        (current: Card) => {
          return this.utils.validateObject(current.id) && current.id!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
        }
      );
      if (data) {
        this.dataTable = data;
      }
    } else {
      if (this.dataTableCopy) {
        this.dataTable = this.dataTableCopy;
        this.filterValueTable = ''
      }
    }
  }

  openModalDetail(type: string, number: number, dangerClass: boolean = false) {
    this.isVisibleModel = true;
    this.detailType = type
    this.detailNumber = number
    this.dangerClass = dangerClass

    if (this.detailType === 'stock') {
      this.detailTitle = 'En Stock'
      this.loadStockDetail(this.getSelectedEntity())
    }

    if (this.detailType === 'initialized') {
      this.detailTitle = 'Inicializadas'
      this.loadInitializedDetail(this.getSelectedEntity())
    }

    if (this.detailType === 'distributed') {
      this.detailTitle = 'Distribuidas'
      this.loadDistributionDetail(this.getSelectedEntity())
    }

    if (this.detailType === 'actived') {
      this.detailTitle = 'Vendidas'
      this.loadActiveSummarizedCards(this.getSelectedEntity())
    }

    if (this.detailType === 'total') {
      this.detailTitle = 'Total'
    }


  }

  async openModal() {
    this.isVisible = true;
    this.loadHistory()
  }
  getSelectedEntity() {
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));
    if (entity) {
      const idEntity = entity.entities[0].id;
      return idEntity;
    }
    return null;
  }

  async reloadTable() {
    const response = await this.api.getFilteredCards(this.filterValue, this.getSelectedEntity())
    console.log(response)
    if (response) {
      this.purchaseBatches = response.data.batches
    }
    if (!this.loading) {
      // && this.filterValue.length >= 3
      if (this.filterValue) {
        // this.loading = true
        const response = await this.api.getFilteredCards(this.filterValue, this.getSelectedEntity())
        // this.selectedCards=[]
        if (response) {
          this.dataTable = response.data.cards
          this.dataTable = this.dataTable.map(x => {
            if (this.actions && this.actions.length > 0) {
              for (let action of this.actions) {
                if (action.filter) {
                  x[action.label] = action.filter(x) !== undefined
                }
              }
            }
            // this.purchaseBatches.filter((element) => element.id == )
            this.dataTableCopy = this.dataTable;
            const data: Card | undefined = this.dataTable.find(element => element.id == element.id)
            this.selectedCard = data!;
            return x
          })

        }
      } else {
        this.dataTable = []
      }
    }
    this.mostrarData = this.dataTable.length > 0 ? true : false;
  }

  ngOnChanges(): void {
    this.reloadTable();
  }

  async loadStockDetail(id: number) {
    const response = await this.api.getStockDetail(id)
    console.log(response)
    if (response.status == 'success') {
      this.purchaseBatches = response.data.stock;
    //   const tmp = new Map()
    //   this.purchaseBatches.forEach(x => {
    //     if (!tmp.has(x.provider_name)) {
    //       tmp.set(x.provider_name, x.available_cards)
    //     } else {
    //       tmp.set(x.provider_name, tmp.get(x.provider_name) + x.available_cards)
    //     }
    //   })
    //   this.purchaseBatchesAggregated = Array.from(tmp, ([name, value]) => ({ provider: name, quantity: value }))
    }
  }

  async loadInitializedDetail(id: number) {
    const response = await this.api.getInitListForDistribution(id)
    if (response) {
      this.initializationBatches = response.data.initializationForDistribution;
      // const tmp = new Map()
      // this.initializationBatches.forEach(x => {
      //   if (!tmp.has(x.label)) {
      //     tmp.set(x.label, x.available_quantity)
      //   } else {
      //     tmp.set(x.label, tmp.get(x.label) + x.available_quantity)
      //   }
      // })
      // this.initializationBatchesAggregated = Array.from(tmp, ([name, value]) => ({ provider: name, quantity: value }))
    }
  }

  async loadDistributionDetail(id: number) {
    const response = await this.api.getDistributionDashboardDetail(id)
    if (response) {
      this.distributionBatches = response.data.distributionDetails
    }
  }

  async loadActiveSummarizedCards(id: number) {
    const response = await this.api.loadActiveSummarizedCards(id)
    if (response) {
      this.activeResponse = response.data.activesDashboardDetail
      console.log(response)
      console.log(this.activeResponse)
    }
  }
}
