import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { UtilsService } from 'src/app/myUtils/utils.service';
import {ApiServiceService} from 'src/app/serivces/api-service/api-service.service';
import { TransporteService } from '../../service/transporte.service';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss']
})
export class TransportComponent implements OnInit {

  routes: any[] = [];

  filterValue: string = '';
  listOfDataFilter!: Array<any>;
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  page: number = 1;
  numberRow: number = 5;

  pass:boolean = false;

  constructor(
    private aRouter: ActivatedRoute,
    private utils: UtilsService,
    private api: TransporteService,
  ) { }

  async ngOnInit() {
    this.aRouter.params.subscribe(async (params) => {
      this.routes = [];
      const selectedCompany = JSON.parse(localStorage.getItem('selectedCompany')!);
      if (selectedCompany) {  
        const routes = await this.api.listRoutes(this.utils.getBasicEndPoint(`companies/${selectedCompany.id}/routes`));
        if (routes.status === 'success') {
          this.routes = routes.data.routes;
        }
      }
    });
  }

  filterItems() {
    let data!: Array<any>;
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.routes;
    }    
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.listOfDataFilter.filter((current) => {
          return current.code.toUpperCase().includes(this.filterValue.toUpperCase()) ||
              current.name.toUpperCase().includes(this.filterValue.toUpperCase())
      });
      if (data) {
        this.routes = data;
      }
    } else {
      if (this.listOfDataFilter) {
        this.routes = this.listOfDataFilter;
        this.filterValue = ''
      }
    }
    
  }

  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

}
