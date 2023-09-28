import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit {
  titelBreadcrumb: string = 'Administrar archivos';
  tabSelecte: any;
  listTabs: any[] = [];

  constructor(private utils: UtilsService,) { }

  ngOnInit(): void {
    const module = JSON.parse(this.utils.decrypt(localStorage.getItem("md-inspector-modu")!));
    const pathModule = JSON.parse(this.utils.decrypt(localStorage.getItem("md-inspector-path")!));
    this.listTabs = module.categories.find(e => e.path == pathModule.at(-1)).actions;
    this.tabSelecte = this.listTabs[0].code;
    console.log(this.listTabs)
  }

  tabSelect(event) {
    this.tabSelecte = event.code;
    switch (event.code) {
      case 'ACCF':
        this.titelBreadcrumb = 'Administrar archivos';
        break;
      case 'ACM':
        this.titelBreadcrumb = 'Movil';
        break;
      case 'ACCAL':
        this.titelBreadcrumb = 'Administrar listas';
        break;
      case 'ACG':
        this.titelBreadcrumb = 'General';
        break;
        case 'PLA':
          this.titelBreadcrumb = 'Plantilla';
          break;
    }
  }

}
