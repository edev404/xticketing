import { Component, OnInit, ViewChild} from '@angular/core';
import { Subject } from 'rxjs';
import { CreateUserComponent } from './create-user/create-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild(ViewUserComponent) hijo2!: ViewUserComponent;

  tabActive!:number;
  tabSelecte: any;
  userId!:number;
  titelBreadcrumb: string = 'Ver perfiles';
  listTabs: any[] = [];

  constructor(private utils: UtilsService,) { }

  ngOnInit(): void {
    const module = JSON.parse(this.utils.decrypt(localStorage.getItem("md-inspector-modu")!));
    const pathModule = JSON.parse(this.utils.decrypt(localStorage.getItem("md-inspector-path")!));
    this.listTabs = module.categories.find(e => e.path == pathModule.at(-1)).actions.reverse(); 
    this.tabSelecte= this.listTabs[0].code;
  }

  setTab(event: any, code: any) {    
    if (event.isEdit) { // Si salio de editar
      this.userId = 0;
      this.tabActive = event.tabId;
      this.tabSelecte = code;

      this.hijo2.loadData();
      return
    }    

    this.tabActive = event.tabId;
    this.tabSelecte = code;
    this.userId = event.idUser;
  }

  loadData(event){
    if(event) this.hijo2.loadData();
  }

  tabSelect(event){
    this.tabSelecte = event.code;
    switch (event) {
      case 0:
        this.titelBreadcrumb = 'Ver Perfiles';
        break;
      case 1:
        this.titelBreadcrumb = 'Crear usuarios';
        break;
      case 2:
        this.titelBreadcrumb = 'Ver usuarios';
        break;
    }    
  }

}
