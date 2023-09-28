import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { LogService } from './services/log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
  listOfData: Array<any> = [];
  filterValue: string = '';
  listOfDataFilter!: Array<any>;
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  page: number = 1;
  numberRow: number = 5;

  filterReturn:boolean = false;

  constructor(private utils: UtilsService, private api: LogService) { }

  async ngOnInit() {
    await this.loadData();
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

  async loadData() {
    const resp = await this.api.getlogList(this.utils.getLogEndPoint('audit'));
    if (resp.length > 0) {
      this.listOfData = resp;
      console.log(this.listOfData);
    } else {                         
      await this.utils.openErrorAlert(this.utils.errorGeneralMessage);
    }
  }

}
