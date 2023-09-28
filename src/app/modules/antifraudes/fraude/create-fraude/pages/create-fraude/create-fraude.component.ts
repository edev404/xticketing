import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// Services
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { FraudeService } from '../../services/fraude.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { LoginServiceService } from '../../../../../../serivces/login-service/login-service.service';

// Interfaces
import { TipoLista } from 'src/app/modules/antifraudes/antifraude/search-controls/interfaces/lists-controls.interfaces';
import { CompanyByUser, EntityAssignedToUser, ServiceByUser } from 'src/app/modules/antifraudes/antifraude/search-controls/interfaces/entities-assigned-to-user.interfaces';
import { ControlActivo, Fraude } from '../../../interfaces/fraude.interfaces';
import { IUser } from '../../../../auth-antifraude/interfaces/authAntifraude.interfaces';
import { FORM_INIT } from './formInit';
import { ControlActivos } from 'src/app/modules/antifraudes/antifraude/search-controls/interfaces/control-activos.interface';

@Component({
  selector: 'app-create-fraude',
  templateUrl: './create-fraude.component.html',
  styleUrls: ['./create-fraude.component.scss', '../../../../../../../assets/themes/white/core/_formulario.scss']
})
export class CreateFraudeComponent implements OnInit {

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
  companiesList: CompanyByUser[] = [];

  // Controles activos
  controlesActivos: ControlActivos[] = [];

  /** Fin Objetos tipos listas */

  // Variable para comprobar si se encontró el ID máximo
  isIDMax: boolean = false;

  /** Formulario reactivo */
  form!: FormGroup;

  // Controles activos listas
  listOfData: ControlActivos[] = []
  listOfDataCopy: ControlActivos[] = []

  // Variables para manejar el paginador
  page: number = 1;
  numberRow: number = 5;
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  // Variable para manejar los estados de si hay datos en la lista
  mostrarData: boolean = false;

  // Varible para mostrar el detalle
  cargarFormulario: boolean = false;

  // Variable para filtrar la tabla
  filterValueTable: string = '';

  constructor(private _api: AuthServiceService,
    private authService: LoginServiceService,
    private fraudeService: FraudeService,
    private fb: FormBuilder,
    private utils: UtilsService) {
    this.form = this.fb.group({
      /** Información básica */
      fecha_probable_ocurrencia: [null, [Validators.required]],
      id: [null],
      descripcion: [null, [Validators.required]],
      fk_tipo_fraude: [null, [Validators.required]],
      fk_componente: [null],
      fk_fuente: [null],
      /** Información Avanzada */
      riesgo: [null, [Validators.required]],
      fk_impacto: [null],
      fk_servicio: ['N/A'], // [ Validators.required ]
      fk_empresa: ['N/A'], // [ Validators.required ]
      estado: [true],
      estado_antifraude: [130],
      usuario: [null],
      fkControlActivo: [null, [Validators.required]]
    });
    this.form.controls['id'].disable();
  }

  async ngOnInit(): Promise<void> {
    /** Obtener el ID máximo */
    this.getMaxID();
    /** Cargar listas tipos */
    this.loadListasTipos();
    this.loadServicesByUser();
    this.loadCompaniesByUser();
    this.loadControlesActivos();
  }


  // Metodos para los metodos del paginador
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

  // Metodo para filtar la tabla
  search() {
    let data: any[];
    if (this.filterValueTable || (this.filterValueTable && this.filterValueTable.trim() != '')) {
      data = this.listOfDataCopy.filter(
        (current: any) => {
          return this.utils.validateObject(current.nServicio) && current.nServicio!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
          this.utils.validateObject(current.nEmpresa) && current.nEmpresa.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
          this.utils.validateObject(current.causa) && current.causa.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
          this.utils.validateObject(current.plataforma) && current.plataforma.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
          this.utils.validateObject(current.estado) && current.estado.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
        }
      );
      if (data) {
        this.listOfData = data;
      }
    } else {
      if (this.listOfDataCopy) {
        this.listOfData = this.listOfDataCopy;
        this.filterValueTable = ''
      }
    }
  }

  // Metodo para llenar el formulario
  habilitarRegistro(event: any) {
    this.cargarFormulario = true;
    // Desabilitamos los controles
    this.form.controls['descripcion']?.disable()
    // this.form.controls['fk_componente']?.disable()
    this.form.controls['fk_servicio']?.disable()
    this.form.controls['fk_empresa']?.disable()
    this.form.controls['fkControlActivo']?.disable()
    // Buscamos la plataforma
    console.log(event)
    console.log(this.tpComponentes)
    const json = this.tpComponentes.filter((element) => element.description == event.plataforma)
    // Asiganomos valores a los controles desabilitados
    this.form.get('descripcion')?.setValue(event.causa)
    this.form.get('fk_componente')?.setValue(json[0] ? json[0].id : 0)
    this.form.get('fk_servicio')?.setValue(event.fkServicio)
    this.form.get('fk_empresa')?.setValue(event.fkEmpresa)


    // Identificador del control activo
    this.form.get('fkControlActivo')?.setValue(event.id)
  }

  /**
   * Obtener ID máximo para colocarlo en el input ID del formulario
   */
  async getMaxID(): Promise<void> {
    const response = await this.fraudeService.getAllFraudes();
    if (response && response.status === this.utils.successMessage) {
      let fraudes: Fraude[] = response.data.fraude;
      // Obtener el valor máximo de la lista de fraudes
      const maxID: number = Math.max(...fraudes.map(fraude => fraude.id));
      /** Si el maxID es -Infinity ocultar el campo ID */
      if (maxID == -Infinity) {
        this.isIDMax = false;
        return;
      }
      /** Asignar ID máximo al formulario */
      this.form.controls['id'].reset(maxID + 1);
      this.isIDMax = true;
    }
  }

  /**
   * Obtener listas tipos
   */
  async loadListasTipos(): Promise<void> {
    this.tpFraudes = await this._api.getLista('TIPO_FRAUDE');
    this.tpComponentes = await this._api.getLista('COMPONENETES');
    this.tpFuentes = await this._api.getLista('FUENTE_ANTIFRAUDE');
    this.tpImpactos = await this._api.getLista('IMPACTO');
  }

  /**
   * Cargar los servicios asignados al usuario
   */
  loadServicesByUser(): void {
    let hash = {};
    const entitySelect: EntityAssignedToUser = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (!entitySelect) return;
    if (entitySelect && !entitySelect.services) return;
    this.servicesList = entitySelect.services.filter((service: ServiceByUser) => (service.active && hash[service.name]) ? false : hash[service.name] = true)
      .sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0);
  }

  /**
   * Cargar las empresas asignadas al usuario
   */
  loadCompaniesByUser(): void {
    let hash = {};
    const entitySelect: EntityAssignedToUser = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (!entitySelect) return;
    if (entitySelect && !entitySelect.companies) return;
    this.companiesList = entitySelect.companies.filter((company: CompanyByUser) => (company.active && hash[company.name]) ? false : hash[company.name] = true)
      .sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0);

  }

  /**
   * Listar controles activos
   */
  async loadControlesActivos(): Promise<void> {
    const response = await this.fraudeService.getAllControlesActivos();
    if (response && response.status === this.utils.successMessage) {
      this.controlesActivos = response.data.controles;

      this.mostrarData = this.controlesActivos.length > 0 ? true : false;
    } else {
      await this.utils.openErrorAlert(response.message);
    }
  }

  /**
   * Buscar controles
   */
  async save(): Promise<void> {
    if (this.form.invalid) {
      this.utils.validateForm(this.form);
      return;
    }
    // Obtener fecha actual para validar con la fecha del formulario
    const fechaActual = new Date();
    /** Obtener formulario */
    const data: Fraude = this.form.getRawValue();
    /** Obtener usuario */
    const auth: IUser = this.authService.getAuth();
    data.usuario = auth.user.id;
    /** Estado antifraude 'Activo' con el ID = 1 */
    data.estado_antifraude = 1;

    /** Validar fecha que no sea mayor a la actual */
    if (data.fecha_probable_ocurrencia > fechaActual) {
      this.form.controls['fecha_probable_ocurrencia'].setErrors({ fechaMayor: true });
      await this.utils.openErrorAlert('La fecha probable ocurrencia no puede ser mayor a la fecha actual.');
      return;
    }

    /** Validar si es N/A enviar el parametro null */
    data.fk_servicio === 'N/A' ? data.fk_servicio = null : data.fk_servicio;
    data.fk_empresa === 'N/A' ? data.fk_empresa = null : data.fk_empresa;

    /** Destructuración para quitar el id al crear */
    const { id, ...dataCreate } = data;

    // Realizar petición para crear fraude
    const response = await this.fraudeService.create(dataCreate)
    if (response && response.status === this.utils.successMessage) {
      await Swal.fire(this.utils.getSuccessModalOptions(`ID: (${response.data.Fraude.id}) Posible fraude: ${response.data.Fraude.descripcion}.`, this.utils.titleSuccessMessage));
      await this.fraudeService.putChangeControlesActivos(this.form.value.fkControlActivo);
      this.loadControlesActivos();
      this.clearForm();
    } else {
      await Swal.fire(this.utils.getErrorModalOptions(response.message));
    }
    this.cargarFormulario = false;
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
    this.form.reset(FORM_INIT);
    this.getMaxID();
  }

}
