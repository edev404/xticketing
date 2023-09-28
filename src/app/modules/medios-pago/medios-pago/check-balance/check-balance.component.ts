import { Component, OnInit } from '@angular/core';
import { IPassengerAccount, IStatementAccount, IexportDetailAccount, IhistoricalState } from 'src/app/modules/clientes/models/client';
import { PassengerAdminApiService } from 'src/app/modules/clientes/service/passenger.admin.api.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Component({
  selector: 'app-check-balance',
  templateUrl: './check-balance.component.html',
  styleUrls: ['./check-balance.component.scss']
})
export class CheckBalanceComponent implements OnInit {
  exportDetailAccount: IexportDetailAccount = {};
  dataTableHistoricalState: IhistoricalState[] = [];
  dataTableStatementAccount: any[] = [];
  dataTableStatementCopy: IStatementAccount[] = [];
  dataTableCopy!: IStatementAccount[];
  passengerAccount!: IPassengerAccount;
  accountCardSelect

  filterValue: string | null = null;

  listOfData: any[] = [];
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  page: number = 1;
  numberRow: number = 5;
  idCard!: number;
  accountNumber!: number;

  isEdit: boolean = false;

  constructor(
    private utils: UtilsService,
    private api: PassengerAdminApiService,
  ) { }

  async ngOnInit() {
    this.passengerAccount = { accountNo: '', summary: { accountBalance: 0 } };
  }

  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

  getSelectedEntity() {
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));
    if (entity) {
      const idEntity = entity.entities[0].id;
      return idEntity;
    }
    return null;
  }

  async findOrDetail(id, row) {
    if (id) {
      this.isEdit = true;
      this.idCard = id;
      this.accountCardSelect = row;
      await this.findCardDetail();
      return;
    }

    this.isEdit = false;
    this.dataTableStatementCopy = [];
    this.dataTableStatementAccount = [];
    this.passengerAccount = { accountNo: '', summary: { accountBalance: 0 } };
  }

  async findCard() {
    if (this.filterValue) {
      const response = await this.api.getFilteredCards(this.utils.getBasicEndPoint(`cards/filter-initialized/${this.filterValue}/${this.getSelectedEntity()}`))
      if (response.data.cards.length > 0) {
        this.listOfData = response.data.cards;
      } else {
        this.utils.openInfoAlert('¡No se encontraron datos para su busqueda!');
        this.listOfData = [];
      }
      return;
    }
    this.listOfData = [];
  }

  async findCardDetail() {
    if (this.accountCardSelect.accountNumber) {
      await this.loadNumberAccountCoreBanking(this.accountCardSelect.accountNumber);
      await this.loadStatementAccount(this.accountCardSelect.accountNumber);
    }
  }

  async loadNumberAccountCoreBanking(idSavings: number) {
    const response = await this.api.getList(this.utils.getCoreBankingEndPoint(`account/id/${idSavings}`));
    if (response && response.status === 'Success') {
      this.passengerAccount = response.data;
      this.passengerAccount.accountNo = `#${this.passengerAccount.accountNo}`;
      this.exportDetailAccount.numberAccount = this.passengerAccount.accountNo;
    }
  }

  async loadStatementAccount(idSavings: number) {
    const response = await this.api.getList(this.utils.getCoreBankingEndPoint(`account/transactions/${idSavings}`));
    if (response && response.status === 'Success') {
      this.dataTableStatementAccount = response.data;
      if (this.dataTableStatementAccount) {
        this.dataTableStatementCopy = this.dataTableStatementAccount.map(data => {
          return {
            id: data.transactionType?.id,
            date: `${data.date[2]}/${data.date[1]}/${data.date[0]}`,
            lugar: '-',
            transferdescription: data.transfer?.transferDescription ? data.transfer?.transferDescription : '',
            trasferid: data.transfer?.id ? data.transfer?.id : '',
            amount: data.amount,
            transactionType: data.transactionType
          };
        });
      }
    }
  }

}
