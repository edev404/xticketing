import { Component, OnInit } from '@angular/core';
import { ServiceRateService } from '../../service/service-rate.service';
import { UtilsService } from '../../../../myUtils/utils.service';
import { Tarifas } from '../../models/tarifas';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tarifas-servicio',
  templateUrl: './tarifas-servicio.component.html',
  styleUrls: ['./tarifas-servicio.component.scss', '../../../../../assets/themes/white/white-theme.scss'],
})
export class TarifasServicioComponent implements OnInit {
  entitySubscription: Subscription | undefined;

  PATH = 'fareServices';
  /** Variable para la busqueda global */
  filterValue: string = '';
  listOfData: Array<Tarifas> = [];
  listOfDataFilter!: Array<Tarifas>;
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  page: number = 1;
  numberRow: number = 5;

  filterReturn:boolean = false;

  constructor(private utils: UtilsService, private api: ServiceRateService) {}

  async ngOnInit() {
    this.entitySubscription = this.utils.permisosEntitysBehavior.subscribe(
      async (Behavior) => {
        await this.loadData();
      }
    );

  }

  filterItems() {
    const searchTerm = this.filterValue.toLowerCase();
  
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.listOfData;
    }
  
    if (searchTerm === '') {
      this.listOfData = this.listOfDataFilter;
      this.filterReturn = false;
    }
  
    this.listOfData = this.listOfDataFilter.filter(item => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          const value = item[key];
          if (value && typeof value === 'string') {
            const lowercaseValue = value.toLowerCase();
            if (lowercaseValue.includes(searchTerm)) {
              return true;
            }
          } else if (value instanceof Date) { 
            const dateValue = value.toISOString().toLowerCase();
            if (dateValue.includes(searchTerm)) {
              return true;
            }
          }
        }
      }
      return false;
    });
  
    if (this.listOfData.length === 0) {
      this.listOfData = this.listOfDataFilter;
      this.filterReturn = true;
    }
  }  

  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

  async changeStateModal(data) {
    Swal.fire(this.utils.getQuestionModalOptions('¿Está seguro de que desea cambiar el estado de esta tarifa?',
      `El estado de la tarifa pasará de estar ${data.status ? 'activo a inactivo.' : 'inactivo a activo.'} `)).then(async (result) => {
      if (result.isConfirmed) {
        await this.changeState(data);
      }else{
        await this.loadData();
      }
    });
  }

  async changeState(dataRowSelected) {
    const response = await this.api.changeState(this.utils.getBasicEndPoint(`${this.PATH}/${dataRowSelected.id}/change-state`), !dataRowSelected.status);
    if (response.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert('¡Se ha cambiado el estado correctamente!').then(async () =>{
        await this.loadData();
      });
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async loadData() {
  const entity = JSON.parse(localStorage.getItem('selectedEntity')!);
  
  if (entity) {
    const idEntity = entity.entities[0].id;

    const response = await this.api.getList(
      this.utils.getBasicEndPoint(`${this.PATH}/${idEntity}/fareServicesAll`)
    );
    if (response.status === this.utils.successMessage) {
      let tarifas = response.data.service.filter(item => {
        return entity.companies.some(obj => obj.id === item.company);
      });
      
      tarifas.map((x) => {
        var res = new Date(x.validityEnd);
        res.setDate(res.getDate() + 1);
        x.validityEnd = res;
      });
      
      
      var fechas = tarifas.sort(
        (a, b) => a.validityEnd - b.validityEnd
      );
      
      var sortedData = fechas.sort((a, b) => {
        if (a.status > b.status) return -1;
        if (a.status < b.status) return 1;
        return 0;
      });
      
      this.listOfData = sortedData;
      
    } else {
      await this.utils.openErrorAlert(response.message);
    }
  }
}
}
