import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  titelBreadcrumb: string = 'Transporte público';
  tabSelecte: any;
  listTabs: any[] = [];

  constructor(private utils: UtilsService,) { }

  ngOnInit(): void {
    const module = JSON.parse(this.utils.decrypt(localStorage.getItem("md-inspector-modu")!));
    const pathModule = JSON.parse(this.utils.decrypt(localStorage.getItem("md-inspector-path")!));
    this.listTabs = module.categories.find(e => e.path == pathModule.at(-1)).actions;
    this.tabSelecte = this.listTabs[0].code;
  }

  tabSelect(event) {
    this.tabSelecte = event.code;
    switch (event.code) {
      case 'AVETE':
        this.titelBreadcrumb = 'Tipos de empresa';
        break;
      case 'AVECF':
        this.titelBreadcrumb = 'Transporte público';
        break;
      case 'AVEER':
        this.titelBreadcrumb = 'Otras empresas';
        break;
    }
  }

}
