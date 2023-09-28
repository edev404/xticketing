import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../myUtils/utils.service';
import { LoginServiceService } from '../../serivces/login-service/login-service.service';
import { AuthServiceService } from '../../serivces/auth-service/auth-service.service';
import { ApiServiceUserAdmin } from 'src/app/modules/admin/admin/user/service/user.admin.api';
import { Logo } from '../models/navbar.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  SelectEntitySubscription: Subscription | undefined;

  isCollapsed = true;
  imgLogo: Logo = {};
  imageFile: boolean = false;
  disabledSelect: boolean = false;
  isActive = '';
  companies: any;
  entities: any[] = [];
  navModules: any[] = [];
  selectedEntity: any;
  width: any;
  showLeftMenu = false;
  activeModule: any;
  nameUser: any;
  errormessage: any;
  entitiesDuplicated: any[] = [];
  user!: string;
  inicioSesion: boolean = false;


  constructor(
    private utils: UtilsService,
    private apiAdmin: ApiServiceUserAdmin,
    private authService: LoginServiceService,
    private api: AuthServiceService
  ) {
  }

  async ngOnInit() {    
    const auth = this.authService.getAuth();
    if (auth === null) {
      return;
    }
    this.nameUser = 'Bienvenido ' + auth.user.firstName;
    this.user = auth.user.firstName[0].toUpperCase() + auth.user.lastName[0].toUpperCase();

    if (localStorage.getItem('auth')) { const entities = JSON.parse(localStorage.getItem('auth')!) }
    const entities = await this.api.listEntities(auth.user.id);
    if (entities.status === 'success') {
      this.entities = entities.data.entities;
      this.entities.sort((a, b) =>
        a.entities[0].name.toLowerCase() < b.entities[0].name.toLowerCase()
          ? -1
          : a.entities[0].name.toLowerCase() > b.entities[0].name.toLowerCase()
            ? 1
            : 0
      );
      this.entities.forEach((entity) =>
        entity.default_entity == (localStorage.getItem("selectedEntity") ? JSON.parse(String(localStorage.getItem("selectedEntity"))).default_entity : 1) ? this.setSelectedEntity(entity) : null
      );
      let hash: any = {};
      this.entities = this.entities
        .filter((entity) =>
          hash[entity.entities[0].id]
            ? this.entityRepeat(entity)
            : (hash[entity.entities[0].id] = true)
        )
        .map((entityFilter) => {
          this.entitiesDuplicated.forEach((entityDuplicated) => {
            if (
              entityDuplicated.entities[0].id == entityFilter.entities[0].id
            ) {
              for (const key in entityDuplicated.companies) {
                entityFilter.companies.push(entityDuplicated.companies[key]);
              }
              entityFilter.services.push(entityDuplicated.services[0]);
            }
          });
          return entityFilter;
        });
    }
    this.entidadCargada();

    this.utils.disabledSelectEntiysBehavior.subscribe(
      (Behavior)=>{
        this.disabledSelect = Behavior;
      }
    )
  }

  getSelectedEntity() {
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));
    if (entity) {
      const idEntity = entity.entities[0].id;
      return idEntity;
    }
    return null;
  }

  entidadCargada() {
    this.apiAdmin.getLogoEntities(this.getSelectedEntity()).subscribe({
      next: (value: any) => {
        if (value.data.result) {
          this.imgLogo = value.data.result;
        }
      },
      error: (err: any) => {
        // console.log(err)
      }
    })
  }

  sidebar(ok: any) {
    this.utils.señalesBehavior(ok);
  }

  changueTwoPassword(ok: any) {
    this.utils.señalespasswordBehavior(ok);
  }

  entityRepeat(entity: any) {
    this.entitiesDuplicated.push(entity)
  }

  closeSession() {
    this.authService.closeSession();
  }

  async setSelectedEntity(entity: any) {
    this.selectedEntity = entity;
    localStorage.setItem('selectedEntity', JSON.stringify(entity));
    localStorage.removeItem('selectedCompany');
    this.utils.señalesEntityBehavior(this.selectedEntity);
  }

}
