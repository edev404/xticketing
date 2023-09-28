import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { IAdminListConfiguration, INameListConfiguration } from '../models/models';
import Swal from 'sweetalert2';
import { ParametersService } from '../service/parameters.service';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebutton2') closebutton2;

  nameList: INameListConfiguration = {};
  listCombo: INameListConfiguration[] = [];
  dataValues: IAdminListConfiguration = {};
  isEdit: boolean = false;
  idListValue;
  idlista;
  messaggeState;

  dataRowSelected;
  dataTable: any[] = [];
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  page: number = 1;
  numberRow: number = 5;

  changeState;
  edit;
  config;
  PATH;
  reload;

  constructor(
    private api: ParametersService,
    public utils: UtilsService
  ) { }

  async ngOnInit() {
    await this.loadData();
  }

  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

  reset() {
    this.nameList = {};
    this.dataValues = {};
  }

  changeStateList() {
    this.api.getByIdList(this.idlista).subscribe(
      response => {
        this.dataRowSelected = response.data.listas
        this.reload = true;
        this.PATH = 'adminlist';
        this.messaggeState = '¿Deseas cambiar el estado de esta lista?';
        this.changeStateModal();
      });
  }

  loadDataTable(id) {
    this.api.getByIdList(id).subscribe(
      response => {
        if (response.data.listas.active) {
          this.idListValue = id;
          this.reload = false;
          this.api.getAllValuesByList(this.idListValue).subscribe(
            response => {
              this.dataTable = response.data.valores;
            });
        }
        //INACTIVE TO ACTIVE STATE
        if (!response.data.listas.active) {
          this.dataRowSelected = response.data.listas
          this.PATH = 'adminlist';
          this.reload = false;
          this.idListValue = id;
          this.messaggeState = '¿Deseas cambiar el estado de esta lista?';
          this.changeStateModal();
        }
      }
    );

  }

  loadUpdateValues(id) {
    this.dataRowSelected = id;
    this.api.getByIdValues(id).subscribe(
      response => {
        this.isEdit = true;
        this.dataValues.code = response.data.valor.code;
        this.dataValues.description = response.data.valor.description
        this.dataValues.order = response.data.valor.order;
      }
    );
  }

  async loadData() {
    this.PATH = 'adminlist';
    const response = await this.api.getList(this.utils.getBasicEndPoint(`${this.PATH}`));
    if (response.status === this.utils.successMessage) {
      this.listCombo = response.data.listas;
      if (this.listCombo.length > 0) {
        this.loadDataTable(this.listCombo[0].id);
        this.idlista = this.listCombo[0].id;
      }
    } else {
      await this.utils.openErrorAlert(response.message);
    }

  }

  async saveNewList() {
    let findName = this.listCombo.find(e => e.name!.toUpperCase().trim() == this.nameList.name!.toUpperCase().trim());
    if (findName) {
      this.utils.openErrorAlert('El nombre ya existe');
      return
    }
    if (this.nameList.name!.trim() == '') {
      this.utils.openErrorAlert('El nombre no puede estar vacio');
      return
    }
    this.api.addNewList(this.nameList).subscribe(
      async response => {
        this.loadDataTable(response.data.list.id);
        this.PATH = 'adminlist';
        const reloadList = await this.api.getList(this.utils.getBasicEndPoint(`${this.PATH}`));
        this.listCombo = reloadList.data.listas;
        for (let i = 0; i < this.listCombo.length; i++) {
          if (response.data.list.id == this.listCombo[i].id) {
            this.idlista = response.data.list.id
          }
        }
        this.utils.openSuccessAlert('Lista creada correctamente');
        this.closebutton2.nativeElement.click();
        this.reset();
      }
    )
  };

  async saveNewValues() {
    if (this.dataTable != undefined) {
      for (let i = 0; i < this.dataTable.length; i++) {
        if (this.dataTable[i].code.trim() == this.dataValues.code!.trim()) {
          this.utils.openErrorAlert('El código ya existe');
          return
        }
        if (this.dataTable[i].description.toUpperCase().trim() == this.dataValues.description!.toUpperCase().trim()) {
          this.utils.openErrorAlert('Ya existe una lista registrada con este nombre');
          return
        }
      }
    }
    if (this.dataValues.code!.trim() == '') {
      this.utils.openErrorAlert('El código no puede estar vacio');
      return
    }
    if (this.dataValues.description!.trim() == '') {
      this.utils.openErrorAlert('El nombre no puede estar vacio');
      return
    }
    if (this.dataValues.order! <= '0') {
      this.utils.openErrorAlert('El orden debe ser mayor a cero');
      return
    }
    this.dataValues.idlista = Number(this.idListValue);
    this.dataValues.id_entidad = this.utils.getSelectedEntity();
    this.api.addNewValues(this.dataValues).subscribe(
      async response => {
        this.loadDataTable(this.idListValue);
        this.utils.openSuccessAlert('Valores agregados correctamente.').then(() => {
          this.closebutton.nativeElement.click();
        });
        this.reset();
      }
    )
  };

  async UpdateValues() {
    let findDesciption = this.dataTable.find(e => e.description.toUpperCase().trim() == this.dataValues.description!.toUpperCase().trim() && e.id != this.dataRowSelected);
    if (findDesciption) {
      this.utils.openErrorAlert('Ya existe una lista registrada con este nombre');
      return
    }
    if (this.dataValues.description!.trim() == '') {
      this.utils.openErrorAlert('El nombre no puede estar vacio');
      return
    }
    if (this.dataValues.order! <= '0') {
      this.utils.openErrorAlert('El orden debe ser mayor a cero');
      return
    }
    this.api.putValues(this.dataValues, this.dataRowSelected).subscribe(
      async response => {
        this.utils.openSuccessAlert('Valores actualizados correctamente');
        this.reset();
        this.closebutton.nativeElement.click();
        this.loadDataTable(this.idListValue);
      });
  }

  async changeStateModal() {
    Swal.fire(this.utils.getQuestionModalOptions(this.messaggeState,
      `El estado pasará de estar ${this.dataRowSelected.active ? 'activo a inactivo.' : 'inactivo a activo.'} `)).then(async (result) => {
        if (result.isConfirmed) {
          await this.changeStates();
        } else {
          this.loadData();
        }
        this.dataRowSelected = undefined;
      });
  }

  async changeStates() {
    const response = await this.api.changeState(this.utils.getBasicEndPoint(`${this.PATH}/${this.dataRowSelected.id}/change-state`), !this.dataRowSelected.active);
    if (response.status === this.utils.successMessage) {
      if (this.reload) {
        await this.utils.openSuccessAlert('Estado cambiado correctamente').then(async () =>
          await this.loadData()
        );
      } else {
        await this.utils.openSuccessAlert('Estado cambiado correctamente').then(async () =>
          await this.loadDataTable(this.idListValue)
        );
      }
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async changeStatesList(data) {
    const response = await this.api.changeState(this.utils.getBasicEndPoint(`listvalues/${data.id}/change-state`), !data.active);
    if (response.status === this.utils.successMessage) {
      if (this.reload) {
        await this.utils.openSuccessAlert('Estado cambiado correctamente').then(async () =>
          await this.loadData()
        );
      } else {
        await this.utils.openSuccessAlert('Estado cambiado correctamente').then(async () =>
          await this.loadDataTable(this.idListValue)
        );
      }
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }


}
