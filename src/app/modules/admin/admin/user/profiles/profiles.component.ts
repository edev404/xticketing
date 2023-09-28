import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { Profile } from '../models/profiles';
import { ApiServiceUserAdmin } from '../service/user.admin.api';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss'],
})
export class ProfilesComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  @Output() porfileChange = new EventEmitter<any>()

  switchValue = true;
  profileAll!: Array<any>;
  lengthProfile: number = 5;
  profileEdit!: Profile | null;

  itemsNavsCreateProfile!: any;
  activateTabCreateProfile!: any;
  ngNameProfile!: any;
  checkItemsByTab!: Map<String, any>;
  checkAll: boolean = false;
  isEdit: boolean = false;

  // PATH PROFILE
  private PATHPROFILE = 'profiles';
  private PATHMASTERMODULE = 'masters/modules';

  constructor(private api: ApiServiceUserAdmin, public utils: UtilsService) {}

  async ngOnInit() {
    await this.loadDataTable();
    await this.moduleItems();
  }

  async openModalCreate() {
    this.isEdit = false;
    this.profileEdit = null;
    this.itemsNavsCreateProfile = null;
    this.ngNameProfile = null;
    await this.moduleItems();
  }

  checkboxAll(event, code) {
    if (!event.currentTarget.checked) {
      // para denegar permisos
      let temp: Array<any> = [];
      let permisos = this.checkItemsByTab.get(code);

      permisos.map((e) => {
        e.value = true; // va true porque por alguna razon lo pone en false

        temp.push(e);
        this.checkItem(e);
      });
      this.checkItemsByTab.delete(code);
      this.checkItemsByTab.set(code, temp);
      return false;
    }

    let temp: Array<any> = [];
    let permisos = this.checkItemsByTab.get(code);

    permisos.map((e) => {
      e.value = false; // va falso porque por alguna razon lo pone en true
      temp.push(e);
      this.checkItem(e);
    });

    this.checkItemsByTab.delete(code);
    this.checkItemsByTab.set(code, temp);

    return 0;
  }

  checkboxAllModules(event) {
    const seleccionar = !event.currentTarget.checked; // va negado porque por alguna razon lo pone el opuesto
    this.itemsNavsCreateProfile
      .filter((e) => e.code != 'AD' && e.code != 'ET')
      .map((permiso) => {
        let temp: Array<any> = [];
        let permisos = this.checkItemsByTab.get(permiso.code);
        permisos.map((e) => {
          e.value = seleccionar;
          temp.push(e);
          this.checkItem(e);
        });
        this.checkItemsByTab.delete(permiso.code);
        this.checkItemsByTab.set(permiso.code, temp);
      });
  }

  checkItem(object) {
    object.value = !object.value;
  }

  changeItemTab(code) {
    let unchechk = this.checkItemsByTab
      .get(code)
      .filter((e) => e.value == false);

    if (unchechk.length == 0) {
      this.checkAll = true;
    } else {
      this.checkAll = false;
    }
    this.activateTabCreateProfile = code;
  }

  createItemsNavsCreateProfile(object) {
    const json = {
      id: object.id,
      name: object.name,
      code: object.code,
    };
    this.itemsNavsCreateProfile.push(json);
  }

  chargeCheckItemsByTab(modules) {
    this.checkItemsByTab = new Map();
    for (let key in modules) {
      this.checkItemsByTab.set(
        modules[key].code,
        this.createOptionByModules(modules[key])
      );
    }
  }

  createOptionByModules(module) {   
    let temp = module.actions.map((e,i) => {      
      if (!e.parentId) e.parentId = e.parentId;
      e.value = false;
      return e;
    });

    const headers = temp.filter(obj => obj.parentId === undefined);

    headers.sort((a, b) => a.id - b.id);

    function getChildren(parentId) {
      const children = temp.filter(obj => obj.parentId === parentId);
      children.sort((a, b) => a.id - b.id);
      const result: any[] = [];
      children.forEach(child => {
        result.push(child);
        result.push(...getChildren(child.id));
      });
      return result;
    }
    const sortedData: any[] = [];
    headers.forEach(header => {
      sortedData.push(header);
      sortedData.push(...getChildren(header.id));
    });
    
    return sortedData;
  }

  validItemChecks(): any {
    const modules = new Array();
    this.checkItemsByTab.forEach((elemen, index, arr) => {
      let filter = elemen.filter((row) => row.value === true);
      if (filter && filter.length > 0) {
        let moduleFilter = this.itemsNavsCreateProfile.filter(
          (row) => row.code === index
        );
        if (this.utils.validateObject(moduleFilter)) {
          moduleFilter[0].actions = filter;
          modules.push(moduleFilter[0]);
        } else {
          this.utils.openErrorAlert('Ocurrio un error inesperado.');
          return;
        }
      }
    });

    return modules;
  }

  changeStateOfOptionsEdit({ module, actions }) {
    this.isEdit = true;
    for (let i in actions) {
      let json = module.filter((row) => row.code === actions[i].code);
      if (json && json.length > 0) {
        json[0].value = !json[0].value;
      }
    }
  }

  async saveProfile() {
    if (this.ngNameProfile == undefined) {
      await this.utils.openErrorAlert('Por favor digitar el nombre del perfil.');
      return;
    }
    
    const permission: [] = this.validItemChecks();
    if (permission && permission.length <= 0) {
      await this.utils.openErrorAlert('Por favor seleccionar al menos un permiso.');
      return;
    }

    const jsonSend = JSON.stringify({
      code: this.ngNameProfile,
      name: this.ngNameProfile,
      modules: permission,
    });

    let resp;
    if (this.profileEdit) {
      resp = await this.api.updateProfile(
        this.utils.getBasicEndPoint(
          `${this.PATHPROFILE}/${this.profileEdit.id}`
        ),
        jsonSend
      );
    } else {
      resp = await this.api.saveProfile(
        jsonSend,
        this.utils.getBasicEndPoint(this.PATHPROFILE)
      );
    }
    if (resp.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(resp.message);
      this.ngNameProfile = undefined;
      this.closebutton.nativeElement.click();
      location.reload();
      await this.ngOnInit();
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async showModalEdit() {
    await this.moduleItems();
    const resp = await this.api.getModulesByProfile(
      this.utils.getBasicEndPoint(
        `${this.PATHPROFILE}/${this.profileEdit!.id}/modules`
      )
    );

    if (resp.status === this.utils.successMessage) {
      this.ngNameProfile = this.profileEdit!.name;
      for (let key in resp.data.modules) {
        const module = this.checkItemsByTab.get(resp.data.modules[key].code);
        this.changeStateOfOptionsEdit({
          module: module,
          actions: resp.data.modules[key].actions,
        });
        console.log(this.changeStateOfOptionsEdit)
      }
    } else {
      this.utils.openErrorAlert('Ocurrio un error inesperado.');
    }
  }

  async changeStateProfile(event, totalUser) {
    if (totalUser > 0) {
      await this.utils.openInfoAlert('Este perfil cuenta con usuarios asociadados').then( async (value) => {
        const resp = await this.api.changeStateProfile(
          this.utils.getBasicEndPoint(
            `${this.PATHPROFILE}/${this.profileEdit!.id}/change-state`
          ),
          event.target.checked
        );
        if (resp.status === this.utils.successMessage) {
          await this.loadDataTable();
          await this.utils.openSuccessAlert('Estado Actualizado con éxito');
          this.porfileChange.emit(true);
        } else if (resp.showAlert) {
          await this.utils.openErrorAlert(resp.message);
        }
      });
    }else {
      const resp = await this.api.changeStateProfile(
        this.utils.getBasicEndPoint(
          `${this.PATHPROFILE}/${this.profileEdit!.id}/change-state`
        ),
        event.target.checked
      );
      if (resp.status === this.utils.successMessage) {
        await this.loadDataTable();
        await this.utils.openSuccessAlert('Estado Actualizado con éxito');
        this.porfileChange.emit(true);
      } else if (resp.showAlert) {
        await this.utils.openErrorAlert(resp.message);
      }
    }
  }

  async loadDataTable() {
    this.profileAll = [];
    const resp = await this.api.getProfileList(this.utils.getBasicEndPoint(this.PATHPROFILE));
    if (resp.status != this.utils.successMessage) await this.utils.openErrorAlert(resp.message);
    let profiles = resp.data.profiles;
    profiles.map((elemt) => {
      let permisos = JSON.parse(elemt.permissions).map((e) => {
        return { id: elemt.id, acciones: e.nom_acciones }
      });
      elemt.data = permisos;
    });
    
    this.profileAll = resp.data.profiles    

    this.profileAll = this.profileAll.sort((a: any, b: any) => a.id - b.id)

    this.profileAll = this.profileAll.sort((a, b) => {
      if (a.activa > b.activa) return -1;
      if (a.activa < b.activa) return 1;
      return 0;
    });

  }

  async moduleItems() {
    this.itemsNavsCreateProfile = [];
    const resp = await this.api.getMasterModules(
      this.utils.getBasicEndPoint(this.PATHMASTERMODULE)
    );
    if (resp.status === this.utils.successMessage) {
      for (let key in resp.data.modules) {
        this.createItemsNavsCreateProfile(resp.data.modules[key]);
      }
      this.chargeCheckItemsByTab(resp.data.modules);
    }
    this.activateTabCreateProfile =
      this.itemsNavsCreateProfile.length > 0
        ? this.itemsNavsCreateProfile[0].code
        : '';
  }
}
