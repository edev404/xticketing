import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Component({
  selector: 'app-clearing',
  templateUrl: './clearing.component.html',
  styleUrls: ['./clearing.component.scss']
})
export class ClearingComponent implements OnInit {
  titelBreadcrumb: string = 'Recargas';
  titelBreadcrumbChild: string = '% Pasajes';
  breadcrumb: boolean = false;
  tabSelecte:number = 0;
  listTabs: any[] = [];

  constructor(private utils: UtilsService,) { }

  ngOnInit(): void {
    // const module = JSON.parse(this.utils.decrypt(localStorage.getItem("md-inspector-modu")!));
    // const pathModule = JSON.parse(this.utils.decrypt(localStorage.getItem("md-inspector-path")!));
    // this.listTabs = module.categories.find(e => e.path == pathModule.at(-1)).actions;
    // console.log(this.listTabs);
    
  }

  tabSelect(event){
    switch (event) {
      case 0:
        this.titelBreadcrumb = 'Recargas';
        this.breadcrumb = false;
        break;
      case 1:
        this.titelBreadcrumb = 'Pasajes';
        this.breadcrumb = true;
        break;
      case 2:
        this.titelBreadcrumb = 'Tipos de hallazgos';
        this.breadcrumb = false;
        break;
    }    
  }

  tabSelectChild(event){
    switch (event) {
      case 0:
        this.titelBreadcrumbChild = '% Pasajes';
        this.breadcrumb = true;
        break;
      case 1:
        this.titelBreadcrumbChild = 'Tipos de Actores';
        this.breadcrumb = true;
        break;
    } 
  }

}
