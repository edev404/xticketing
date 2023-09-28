import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Component({
  selector: 'app-services-admin',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesAdminComponent implements OnInit {
  titelBreadcrumb: string = 'Servicios';
  tabSelecte: any;
  listTabs: any[] = [];

  constructor(private utils: UtilsService,) { }

  ngOnInit(): void {
    const module = JSON.parse(this.utils.decrypt(localStorage.getItem("md-inspector-modu")!));
    const pathModule = JSON.parse(this.utils.decrypt(localStorage.getItem("md-inspector-path")!));
    this.listTabs = module.categories.find(e => e.path == pathModule.at(-1)).actions;
    this.tabSelecte= this.listTabs[0].code;    
  }

  tabSelect(event){
    console.log(event);
    
    this.tabSelecte = event.code;
    switch (event) {
      case 0:
        this.titelBreadcrumb = 'Servicios';
        break;
      case 1:
        this.titelBreadcrumb = 'Caracteristicas de los servicios';
        break;
    }    
  }

}
