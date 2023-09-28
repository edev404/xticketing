import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

// Services
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { SearchFraudeService } from '../../services/search-fraude.service';

// Interfaces
import { CompanyByUser, EntityAssignedToUser, ServiceByUser } from 'src/app/modules/antifraudes/antifraude/search-controls/interfaces/entities-assigned-to-user.interfaces';
import { TipoLista } from 'src/app/modules/antifraudes/antifraude/search-controls/interfaces/lists-controls.interfaces';
import { ResponseSearchFraudes } from '../../../interfaces/fraude.interfaces';
import { SearchFraude } from '../../interfaces/search-fraude.interfaces';
import { FORM_INIT_SEARCH_FRAUDE } from './formInit';

@Component({
  selector: 'app-search-fraude',
  templateUrl: './search-fraude.component.html',
  styleUrls: ['./search-fraude.component.scss', '../../../../../../../assets/themes/white/core/_formulario.scss']
})
export class SearchFraudeComponent implements OnInit {

  /** Objeto para mostrar en la tabla */
  fraudesData: ResponseSearchFraudes = { fraudes: [], grupos: [] };

  /** Objetos tipos listas */

  // Tipos controles
  tpFraudes: TipoLista[] = [];

  // Tipos components
  tpComponentes: TipoLista[] = [];

  // Tipos de fuentes
  tpFuentes: TipoLista[] = [];

  // Tipos de impactos
  tpImpactos: TipoLista[] = [];

  // Servicios por entidad para el usuario
  servicesList: ServiceByUser[] = [];

  // Compañias por entidad para el usuario
  companiesList: CompanyByUser[]= [];

  /** Fin Objetos tipos listas */

  /** Variable para mostrar los filtros */
  filters: boolean = true;

  /** Variable para mostrar filtros avanzados */
  filterAdvanced: boolean = false;

  /** Variable para mostrar data table al buscar */
  searchData: boolean = false;

  /** Formulario reactivo */
  form!: FormGroup;

  // Variable para manejar la suscripción
  subscriptions: Subscription[] = [];

  constructor(private searchFraudeService: SearchFraudeService,
              private _api: AuthServiceService,
              private fb: FormBuilder,
              private utils: UtilsService) {
    this.form = this.fb.group({
      // Información básica
      fecha_ini_re:  [new Date()],
      fecha_fin_re:  [new Date()],
      fecha_ini_ocu: [new Date()],
      fecha_fin_ocu: [new Date()],
      id:            [''],
      descripcion:   [''],
      tipo_fraude:   ['0'],
      componente:    ['0'],
      fuente:        ['0'],
      // Información avanzada
      usuario:       [''],
      riesgo:        [''],
      impacto:       ['0'],
      empresa:       [''],
      servicio:      ['0']
    });
  }

  ngOnInit(): void {
    /** Cargar listas tipos */
    this.loadListasTipos();
    this.loadServicesByUser();
    this.loadCompaniesByUser();
    // Se Subscribe para refrescar busqueda de fraudes
    this.subscriptions.push(this.searchFraudeService.refreshFraudesSubjectBehavior.subscribe((refreshFraude: boolean) => {
      /** Si se emite un valor TRUE, se procede a refrescar data de fraudes  */
      if (refreshFraude) this.search();
    }));
  }

  /**
   * Obtener listas tipos
   */
  async loadListasTipos(): Promise<void> {
    this.tpFraudes        = await this._api.getLista('TIPO_FRAUDE');
    this.tpComponentes    = await this._api.getLista('COMPONENETES');
    this.tpFuentes        = await this._api.getLista('FUENTE_ANTIFRAUDE');
    this.tpImpactos       = await this._api.getLista('IMPACTO');
  }

  /**
   * Cargar los servicios asignados al usuario
   */
  loadServicesByUser(): void {
    let hash = {};
    const entitySelect: EntityAssignedToUser = JSON.parse(localStorage.getItem('selectedEntity')!);
    if ( !entitySelect ) return;
    if ( entitySelect && !entitySelect.services ) return;
    this.servicesList = entitySelect.services.filter( (service: ServiceByUser) => (service.active && hash[service.name]) ? false : hash[service.name] = true )
                                             .sort((a,b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0 );
  }

  /**
   * Cargar las empresas asignadas al usuario
   */
  loadCompaniesByUser(): void {
    let hash = {};
    const entitySelect: EntityAssignedToUser = JSON.parse(localStorage.getItem('selectedEntity')!);
    if ( !entitySelect ) return;
    if ( entitySelect && !entitySelect.companies ) return;
    this.companiesList = entitySelect.companies.filter( (company: CompanyByUser) => (company.active && hash[company.name]) ? false : hash[company.name] = true )
                                               .sort((a,b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0 );                           
  }

  /**
   * Buscar fraudes
   */
  async search(): Promise<void> {
    /** Limpiar objeto que muestra la data en la tabla */
    this.fraudesData = { fraudes: [], grupos: [] };
    // Obtener formulario
    const data: SearchFraude = this.form.getRawValue();
    // Validaciones de reglas de negocios para fechas
    if ( this.validateFechas(data) ) return;
    // Validar si el formulario es invalido
    if ( this.form.invalid ) {
      this.utils.validateForm(this.form);
      return;
    }
    // Formatear la fecha a tipo string ejemplo = (2023-02-09)
    data.fecha_ini_re  === null ? data.fecha_ini_re  = '' : data.fecha_ini_re   = this.utils.formatDateToString(new Date(data.fecha_ini_re));
    data.fecha_fin_re  === null ? data.fecha_fin_re  = '' : data.fecha_fin_re   = this.utils.formatDateToString(new Date(data.fecha_fin_re));
    data.fecha_ini_ocu === null ? data.fecha_ini_ocu = '' : data.fecha_ini_ocu  = this.utils.formatDateToString(new Date(data.fecha_ini_ocu));
    data.fecha_fin_ocu === null ? data.fecha_fin_ocu = '' : data.fecha_fin_ocu  = this.utils.formatDateToString(new Date(data.fecha_fin_ocu));
    
    // Si se ocultan los filtros avanzados, no se tendrán en cuenta en la búsqueda
    /** if (!this.filterAdvanced) {
      data.usuario  = '';
      data.riesgo   = '';
      data.impacto  = '0';
      data.empresa  = '';
      data.servicio = '0';
    } */
    localStorage.setItem("controlFraude", JSON.stringify(data))
    // Realizar petición para crear fraude
    const response = await this.searchFraudeService.getFiltroFraudes(data);
    if (response && response.status === this.utils.successMessage) {
      this.filterAdvanced = false;
      this.fraudesData = response.data.grupos_fraudes;
      this.searchData = this.fraudesData.fraudes.length > 0 ? true : false;
    } else {
      await this.utils.openErrorAlert(response.message);
    }
  }

  /**
   * Validaciones fechas
   * @param data: SearchFraude
   * @returns boolean
   */
  validateFechas(data: SearchFraude): boolean {
    // Obtener fecha actual para validar con la fecha del formulario
    const fechaActual = new Date();
    /** Validar fecha registro desde no sea mayor a fecha actual */
    if ( data.fecha_ini_re > fechaActual ) {
      this.form.controls['fecha_ini_re'].setErrors( { error: true } );
      this.utils.openErrorAlert('La fecha registro desde no puede ser mayor a la fecha actual.');
      return true;
    }
    /** Validar fecha registro desde no sea mayor a fecha registro hasta */
    else if ( data.fecha_ini_re > data.fecha_fin_re ) {
      this.form.controls['fecha_ini_re'].setErrors( { error: true } );
      this.utils.openErrorAlert('La fecha registro desde no puede ser mayor a la fecha registro hasta.');
      return true;
    }
    /** Validar fecha registro hasta no sea mayor a fecha actual */
    else if ( data.fecha_fin_re > fechaActual ) {
      this.form.controls['fecha_fin_re'].setErrors( { error: true } );
      this.utils.openErrorAlert('La fecha registro hasta no puede ser mayor a la fecha actual.');
      return true;
    }
    /** Validar fecha ocurrencia desde no sea mayor a fecha actual */
    else if ( data.fecha_ini_ocu > fechaActual ) {
      this.form.controls['fecha_ini_ocu'].setErrors( { error: true } );
      this.utils.openErrorAlert('La fecha ocurrencia desde no puede ser mayor a la fecha actual.');
      return true;
    }
    /** Validar fecha ocurrencia desde no sea mayor a fecha ocurrencia hasta */
    else if ( data.fecha_ini_ocu > data.fecha_fin_ocu ) {
      this.form.controls['fecha_ini_ocu'].setErrors( { error: true } );
      this.utils.openErrorAlert('La fecha ocurrencia desde no puede ser mayor a la fecha ocurrencia hasta.');
      return true;
    }
    /** Validar fecha registro hasta no sea mayor a fecha actual */
    else if ( data.fecha_fin_ocu > fechaActual ) {
      this.form.controls['fecha_fin_ocu'].setErrors( { error: true } );
      this.utils.openErrorAlert('La fecha ocurrencia hasta no puede ser mayor a la fecha actual.');
      return true;
    }
    return false;
  }

  /**
   * Preguntar al usuario si desea limpiar el formulario
   */
  async clearFormQuestion(): Promise<void> {
    await Swal.fire(this.utils.getQuestionModalOptions('¿Desea limpiar la información ingresada?', ''))
      .then((result) => {
        /* Si el usuario le da click en aceptar, limpiar los campos */
        if (result.isConfirmed) { 
          this.clearForm();
        }
      });
  }

  /**
   * Limpiar el formulario
   */
  clearForm(): void {
    /** Resetear formulario*/
    this.fraudesData = { fraudes: [], grupos: [] };
    const formInit = { ...FORM_INIT_SEARCH_FRAUDE };
    this.form.reset(formInit);
  }

  /**
   * Remover item searchFraude al destruir componente
   */
  ngOnDestroy(): void {
    this.fraudesData = { fraudes: [], grupos: [] };
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
