import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { IEntitiesConfiguration, LocationBasic } from '../models/entites';
import { EntitesService } from '../service/entites.service';

@Component({
  selector: 'app-create-entites',
  templateUrl: './create-entites.component.html',
  styleUrls: ['./create-entites.component.scss']
})
export class CreateEntitesComponent implements OnInit {
  @Input() entityId;
  @Input() isEdit: boolean = false;
  @Input() listEntites!: any[];
  @Output() CreateOrEdit = new EventEmitter<any>();

  enviarFormulario: boolean = false;

  countryCombo
  departmentResidenceCombo;
  cityResidenceCombo;

  entitiesForm: IEntitiesConfiguration = {};
  location!: LocationBasic;
  validateForm!: FormGroup;
  inputErrorFileLogo!: boolean;
  selectedFileLogo!: File;
  nameUpdate: any;
  idContry: any;
  idDeparment: any;
  idCity: any;

  ENTITIES_PATH = 'entities';
  COUNTRIES_PATH = "masters/countries"
  DEPARMENT_PATH = "masters/departments"
  CITIES_PATH = "masters/cities"


  constructor(
    private api: EntitesService,
    public utils: UtilsService,
    private fb: FormBuilder,
  ) {
    this.validateForm = this.fb.group({
      contry: [null, [Validators.required]],
      deparment: [null, [Validators.required]],
      city: [null, [Validators.required]]
    });
  }

  async ngOnInit() {
    if (this.entityId) {
      this.api.getByIdEntities(this.entityId).subscribe(
        response => {
          let logoName = response.data.entities.logo ? response.data.entities.logo.split('/') : '';
          this.entitiesForm = response.data.entities;
          this.nameUpdate = response.data.entities.name;
          this.entitiesForm.logo = logoName ? logoName[logoName.length - 1] : 'Cargar logo';
          this.loadLocationEdit(this.entitiesForm);
        }
      );
    }
    await this.loadCountryCombos();
  }

  fileLogoEvent(event) {
    this.inputErrorFileLogo = false;
    let file = <File>event.target.files[0];
    if (file && (file.type == "image/png" || file.type == "image/jpg")) {
      this.selectedFileLogo = <File>event.target.files[0];
      this.entitiesForm.logo = this.selectedFileLogo.name;
    } else {
      this.inputErrorFileLogo = true;
    }
  }

  createLocation(location) {
    this.entitiesForm.location = {
      country: { id: location.countryId },
      department: { id: location.deparmentId },
      city: { id: location.cityId }
    };
  }

  saveCompany() {
    this.enviarFormulario = true;
    let url;
    let metodo;
    let form = this.validateForm;
    if ( this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          return;
        }
      });
      return;
    }

    if (!this.entityId) {
      this.idContry = this.countryCombo.find(e => e.id == form.value.contry);
      this.idDeparment = this.departmentResidenceCombo.find(e => e.id == form.value.deparment);
      this.idCity = this.cityResidenceCombo.find(e => e.id == form.value.city);

      let code = this.listEntites.find(e => e.code == this.entitiesForm.code);
      if (code) {
        this.utils.openErrorAlert('El código ya existe');
        return
      }
      let name = this.listEntites.find(e => e.name.toLowerCase() == this.entitiesForm.name!.toLowerCase());
      if (name) {
        this.utils.openErrorAlert('El nombre de la entidad ya existe');
        return
      }
    }
    this.entitiesForm.location = {
      country: { id: this.idContry.id },
      department: { id: this.idDeparment.id },
      city: { id: this.idCity.id }
    };

    let formData = new FormData();
    formData.append('logo', this.selectedFileLogo);
    // formData.append('style', this.selectedFileCSS);
    formData.append('json', JSON.stringify({
      name: this.entitiesForm.name,
      description: this.entitiesForm.description ? this.entitiesForm.description : '',
      messageInstitutional: this.entitiesForm.messageInstitutional,
      mail: this.entitiesForm.mail,
      phone: this.entitiesForm.phone,
      direction: this.entitiesForm.direction ? this.entitiesForm.direction : '',
      id_pais: this.entitiesForm.location.country.id,
      id_departamento: this.entitiesForm.location.department.id,
      id_municipio: this.entitiesForm.location.city.id,
      webSite: this.entitiesForm.webSite,
      logo: this.entitiesForm.logo,
      geographicalAreas: "[]",
      code: this.entitiesForm.code,
      stocktarjetas: this.entitiesForm.stocktarjetas
    }));

    if (this.entityId) {
      url = this.utils.getBasicEndPoint(`${this.ENTITIES_PATH}/${this.entityId}/update`);
      metodo = 'PUT'
    } else {
      url = this.utils.getBasicEndPoint(`${this.ENTITIES_PATH}/add`);
      metodo = 'POST'
    }

    const header = {};
    const auth = JSON.parse(localStorage.getItem('auth')!);
    if (auth) {
      header['username'] = auth.user.username;
      header['Authorization'] = `Bearer ${auth.token}`;
    }
    // no preguntes por que, solo llora y luego continua :)
    fetch(url, { method: metodo, body: formData, redirect: 'follow', headers: header })
      .then((response) => { return response.text() })
      .then((result) => {
        const resp = JSON.parse(result);
        console.log(resp);

        if (resp.status === this.utils.successMessage) {
          this.utils.openSuccessAlert(this.entitiesForm.id ? 'Entidad editada correctamente' : 'Entidad creada correctamente').then()
          this.entitiesForm = {};
          this.CreateOrEdit.emit(false);
        } else {
          this.utils.openErrorAlert(this.entitiesForm.id ? '¡Error al editar la entidad!' : '¡Error al crear la entidad!').then();
        }
      })
  }

  cancelCompany() {
    this.CreateOrEdit.emit(false);
  }

  loadLocationEdit(entityLocation: IEntitiesConfiguration) {
    let from = this.validateForm;
    this.location = {};
    // pais
    this.idContry = entityLocation.location!.country;
    from.controls['contry'].setValue(entityLocation.location!.country.id);
    // departamento
    this.idDeparment = entityLocation.location!.department;
    from.controls['deparment'].setValue(entityLocation.location!.department.id);
    // ciudad
    this.idCity = entityLocation.location!.city;
    from.controls['city'].setValue(entityLocation.location!.city.id);
  }

  async changeSelect(type, event) {
    switch (type) {
      case "Department":
        await this.loadResindeceDeparmentCombo(event);
        break;
      case "city":
        await this.loadResindeceCityCombo(event);
        break;
    }
  }

  async loadCountryCombos() {
    let response = await this.api.getCountries(this.utils.getBasicEndPoint(`${this.COUNTRIES_PATH}`));
    if (response && response.status == this.utils.successMessage) {
      this.countryCombo = response.data.countries;
    }
  }

  async loadResindeceDeparmentCombo(value) {
    let response = await this.api.getDeparments(this.utils.getBasicEndPoint(`${this.DEPARMENT_PATH}?countryId=${value}`));
    if (response && response.status == this.utils.successMessage) {
      this.departmentResidenceCombo = response.data.departments;
    }
  }

  async loadResindeceCityCombo(value) {
    let response = await this.api.getCities(this.utils.getBasicEndPoint(`${this.CITIES_PATH}?departmentId=${value}`));
    if (response && response.status == this.utils.successMessage) {
      this.cityResidenceCombo = response.data.cities;
    }

  }

}
