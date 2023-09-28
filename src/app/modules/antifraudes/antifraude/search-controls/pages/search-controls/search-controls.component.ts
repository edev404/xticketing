import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

// Services
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { SearchControlesService } from '../../services/search-controles.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

// Interfaces
import { FORM_INIT } from './formInit';
import { TipoLista } from '../../interfaces/lists-controls.interfaces';
import { EntityAssignedToUser, ServiceByUser, CompanyByUser } from '../../interfaces/entities-assigned-to-user.interfaces';
import { SearchControl, ControlView } from '../../interfaces/search-controles.interfaces';

@Component({
  selector: 'app-search-controls',
  templateUrl: './search-controls.component.html',
  styleUrls: ['./search-controls.component.scss', '../../../../../../../assets/themes/white/core/_formulario.scss']
})
export class SearchControlsComponent implements OnInit {

  /** Objeto para mostrar en la tabla */
  controlesData: ControlView[] = [];

  /** Objetos tipos listas */

  // Tipos estados
  tpEstados: TipoLista[] = [];

  // Tipos controles
  tpControles: TipoLista[] = [];

  // Tipos components
  tpComponentes: TipoLista[] = [];

  // Tipos de criticidad
  tpCriticidad: TipoLista[] = [];

  // Tipos de fuentes
  tpFuentes: TipoLista[] = [];

  // Tipos de detecciones
  tpDetecciones: TipoLista[] = [];

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

  constructor(private searchControlesService: SearchControlesService,
              private _api: AuthServiceService,
              private fb: FormBuilder,
              private utils: UtilsService) {
    this.form = this.fb.group({
      /** Basica */
      estado:            ['0'],
      codigo:            [''],
      control:           [''],
      tipo_control:      [''],
      componente:        [''],
      descripcion:       [''],
      /** Avanzada */
      criticidad:        [''],
      fuente:            [''],
      deteccion:         [''],
      accion_resultante: [''],
      servicio:          ['0'],
      empresa:           [''],
      /** Checkbox para controles activados */
      activo:            [false],
      /** Controles activados */
      fecha_ini:         [new Date()],
      fecha_fin:         [new Date()],
      serviceac:         [0],
      empreac:           [0],
      causa:             [''],
      accion_eje:        ['']
    });
  }

  ngOnInit(): void {
    /** Cargar listas tipos */
    this.loadListasTipos();
    this.loadServicesByUser();
    this.loadCompaniesByUser();
  }

  /**
   * Obtener listas tipos
   */
  async loadListasTipos(): Promise<void> {
    this.tpEstados     = await this._api.getLista('ESTADO_ANTIFRAUDE');
    this.tpControles   = await this._api.getLista('TIPO_CONTROL');
    this.tpComponentes = await this._api.getLista('COMPONENETES');
    this.tpCriticidad  = await this._api.getLista('CRITICA_ANTIFRAUDE');
    this.tpFuentes     = await this._api.getLista('FUENTES');
    this.tpDetecciones = await this._api.getLista('DETENCION');
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
   * Buscar controles
   */
  async search(): Promise<void> {
    /** Limpiar objeto que muestra la data en la tabla */
    this.controlesData = [];
    // Obtener formulario
    const data: SearchControl = this.form.getRawValue();
    // Validaciones de reglas de negocios para fechas
    if ( this.validateFechas(data) ) return;
    // Validar si el formulario es invalido
    if ( this.form.invalid ) {
      this.utils.validateForm(this.form);
      return;
    }
    // Formatear la fecha a tipo string ejemplo = (2023-02-09)
    data.fecha_ini  === null ? data.fecha_ini  = '' : data.fecha_ini   = this.utils.formatDateToString(new Date(data.fecha_ini));
    data.fecha_fin  === null ? data.fecha_fin  = '' : data.fecha_fin   = this.utils.formatDateToString(new Date(data.fecha_fin));

    // Si se ocultan los filtros avanzados, no se tendrán en cuenta en la búsqueda
    if (!this.filterAdvanced) {
      data.criticidad        = '';
      data.fuente            = '';
      data.deteccion         = '';
      data.accion_resultante = '';
      data.servicio          = '0';
      data.empresa           = '';
    }

    if (!data.activo) {
      data.fecha_ini          = '';
      data.fecha_fin          = '';
      data.serviceac          = 0;
      data.empreac            = 0;
      data.causa              = '';
      data.accion_eje         = '';
    }
    localStorage.setItem("controlAntifraude", JSON.stringify(data))
    // Realizar petición para filtrar controles
    const response = await this.searchControlesService.getFiltroControles(data);
    if (response && response.status === this.utils.successMessage) {
      this.filterAdvanced = false;
      this.controlesData = response.data.controles;
      this.searchData = this.controlesData.length > 0 ? true : false;
    } else {
      await this.utils.openErrorAlert(response.message);
    }
  }

  /**
   * Validaciones fechas
   * @param data: SearchControl
   * @returns boolean
   */
  validateFechas(data: SearchControl): boolean {
    // Obtener fecha actual para validar con la fecha del 
    const fechaActual = new Date();
    if ( data.fecha_ini > fechaActual ) {
      this.form.controls['fecha_ini'].setErrors( { error: true } );
      this.utils.openErrorAlert('La fecha ocurrencia desde no puede ser mayor a la fecha actual.');
      return true;
    }
    /** Validar fecha ocurrencia desde no sea mayor a fecha ocurrencia hasta */    
    else if ( data.fecha_ini > data.fecha_fin ) {
      this.form.controls['fecha_ini'].setErrors( { error: true } );
      this.utils.openErrorAlert('La fecha ocurrencia desde no puede ser mayor a la fecha ocurrencia hasta.');
      return true;
    }
    /** Validar fecha ocurrencia hasta no sea mayor a fecha actual */
    else if ( data.fecha_fin > fechaActual ) {
      this.form.controls['fecha_fin'].setErrors( { error: true } );
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
    /** Limpiar controles */
    this.controlesData = [];
    /** Resetear formulario manteniendo la opción de controles activados */
    const formInit = { ...FORM_INIT, activo: this.form.controls['activo'].value };
    this.form.reset(formInit);
  }

}
