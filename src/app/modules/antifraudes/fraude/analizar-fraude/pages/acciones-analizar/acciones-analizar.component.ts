import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// Services
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import { AnalizarFraudeService } from '../../services/analizar-fraude.service';
import { LoginServiceService } from 'src/app/serivces/login-service/login-service.service';
import { FraudesService } from '../../../search-fraude/services/fraudes.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

// Interfaces
import { TipoLista } from 'src/app/modules/antifraudes/antifraude/search-controls/interfaces/lists-controls.interfaces';
import { RegistrarAnalisis, RegistrarSancion, FraudeAnalizado, EnviarNotificacion, SancionRegistrada, PlantillaNotificacion, NotificacionRegistrada, UsuarioNotificacion, UpdateNotificacion } from '../../interfaces/analizar-acciones.interfaces';
import { IUser } from '../../../../auth-antifraude/interfaces/authAntifraude.interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { ServiceRateService } from 'src/app/modules/tarifas/service/service-rate.service';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';

@Component({
  selector: 'app-acciones-analizar',
  templateUrl: './acciones-analizar.component.html',
  styleUrls: ['./acciones-analizar.component.scss', '../../../../../../../assets/themes/white/core/_formulario.scss']
})
export class AccionesAnalizarComponent implements OnInit {

  /** Objeto para enviar a registrar analisis */
  @Input() fraudesData: any[] = [];

  // Variable para la accion a ejecutar (registrar analisis, registrar sancion o enviar notificacion)
  @Input() accionAnalizar: number = 0;

  /** Lista de fraudes analizados */
  fraudesAnalizados: FraudeAnalizado[] = [];

  /** Lista de fraudes con sanción */
  fraudesSancionados: SancionRegistrada[] = [];

  /** Lista de notificaciones de fraudes */
  notificacionesFraudes: NotificacionRegistrada[] = [];

  /** Objeto de notificacion para editar */
  editarNotificacionSelect!: NotificacionRegistrada;

  /** Variable para obtener todos los IDS de fraudes seleccionados en la tabla */
  setOfCheckedId = new Set<number>();

  // Variable para cambiar de pestaña en acciones
  tabIndex: number = 0;

  /** Objetos tipos listas */

  // Registrar analisis (Posible causas)
  tpCausas: TipoLista[] = [];

  // Registrar analisis (Resolución)
  tpResolucion: TipoLista[] = [];

  // Registrar analisis (Acciones para ejecutar)
  tpAccionesEjecutar: TipoLista[] = [];

  // Registrar Sanción (Sanción)
  tpSancion: TipoLista[] = [];

  // Registrar Sanción (Aplicar sanción)
  tpAplicarSancion: TipoLista[] = [];

  // Enviar notificación (Plantilla)
  tpPlantilla: PlantillaNotificacion[] = [];

  // Enviar notificación (Medio)
  tpMedio: TipoLista[] = [];

  // Lista de usuarios
  users: UsuarioNotificacion[] = [];

  /** Fin Objetos tipos listas */

  // Variable para manejar la suscripción
  subscriptions: Subscription[] = [];

  /** Formulario reactivo para registrar análisis */
  formAnalisis!: FormGroup;

  /** Formulario reactivo para Registrar sanción */
  formSancion!: FormGroup;

  /** Formulario reactivo para Enviar notificación */
  formNotificacion!: FormGroup;

  /** Formulario reactivo para cerrar caso */
  formCerrarCaso!: FormGroup;

  // PDF
  isVisiblePDF: boolean = false;
  urlFile;
  // Emision de evento para cambiar la accion a ejecutar
  @Output() onEmitChangeAccion = new EventEmitter();

  constructor(private _api: AuthServiceService,
    private analizarFraudeService: AnalizarFraudeService,
    private authService: LoginServiceService,
    private fraudesService: FraudesService,
    private sanitazer: DomSanitizer,
    private api: DescuentosService,
    private fb: FormBuilder,
    private utils: UtilsService) {
    /** Registrar Análisis */
    this.formAnalisis = this.fb.group({
      fkCausa: [null, [Validators.required]],
      detCausa: [null, [Validators.required]],
      fkResolucion: [null, [Validators.required]],
      fkAccion: [null, [Validators.required]],
      conclusion: [null]
    });
    /** Registrar Sanción */
    this.formSancion = this.fb.group({
      fkSancion: [null, [Validators.required]],
      detSancion: [null, [Validators.required]],
      fkApliSancion: [null, [Validators.required]],
      observacion: [null]
    });
    /** Enviar notificacion */
    this.formNotificacion = this.fb.group({
      fkPlantilla: [null, [Validators.required]],
      fkMedio: [null, [Validators.required]],
      usuarios: [null, [Validators.required]],
      asunto: [null, [Validators.required]],
      cuerpoMensaje: [null, [Validators.required]]
    });
    /** Cerrar caso */
    this.formCerrarCaso = this.fb.group({
      fraude: [null, [Validators.required]],
      conclusion: [null, [Validators.required]],
      requiere_control: [null, [Validators.required]],
      especificacion: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    /** Cargar listas tipos */
    this.loadListasTipos();
    this.initFormAnalisis();
    /** Cambiar de pestaña al emitir un nuevo evento en las pestañas de tablas */
    this.subscriptions.push(this.analizarFraudeService.tabTablasSubjectBehavior.subscribe((tabTablas: number) => {
      tabTablas === 0 || tabTablas === 1 ? this.tabIndex = 0 :
        tabTablas === 2 ? this.tabIndex = 1 :
          tabTablas === 3 ? this.tabIndex = 2 : this.tabIndex = 0;
      /** Metodo para cambiar la accion a ejecutar desde la tabla a las acciones por analizar */
      this.onEmitChangeAccion.emit(this.tabIndex === 3 ? 2 : this.tabIndex);
    }));
    /** Obtener ID's de fraudes emitidos desde tabla por analizar */
    this.subscriptions.push(this.analizarFraudeService.idFraudesPorAnalizarBehavior.subscribe(idFraudesSet => {
      this.setOfCheckedId = idFraudesSet;
    }));
    /** Obtener lista de fraudes analizados emitidos desde tabla analisis registrados */
    this.subscriptions.push(this.analizarFraudeService.fraudesAnalizadosBehavior.subscribe(fraudesAnalizados => {
      this.fraudesAnalizados = fraudesAnalizados;
    }));
    /** Obtener lista de fraudes sancionados emitidos desde tabla sanciones */
    this.subscriptions.push(this.analizarFraudeService.fraudesSancionadosBehavior.subscribe(fraudesSancionados => {
      this.fraudesSancionados = fraudesSancionados;
    }));
    /** Obtener lista de notificaciones de fraudes emitidos desde tabla notificaciones */
    this.subscriptions.push(this.analizarFraudeService.notificacionesFraudesBehavior.subscribe(notificacionesFraudes => {
      this.notificacionesFraudes = notificacionesFraudes;
    }));
    /** Obtener notificacion para editar emitidos desde tabla notificaciones */
    this.subscriptions.push(this.analizarFraudeService.editarNotificacionBehavior.subscribe(notificacion => {
      this.editarNotificacionSelect = notificacion;
      if (this.editarNotificacionSelect) {
        /** Transformar atributo string a array de objetos para mostrarlo en el campo de usuarios destinados para editar  */
        if (typeof this.editarNotificacionSelect.usuarios == 'string') {
          this.editarNotificacionSelect.usuarios = JSON.parse(this.editarNotificacionSelect.usuarios);
          // Transformar array de numeros a array de string para poder visualizarlos en el editar notificacion
          this.editarNotificacionSelect.usuarios = this.editarNotificacionSelect.usuarios.map(String);
        }
        this.formNotificacion.reset(this.editarNotificacionSelect);
        this.formNotificacion.enable();
        /** Inhabilitar los campos del formulario si la notificacion tiene estado "Enviado" */
        if (this.editarNotificacionSelect.estado2.includes('ENVIADO')) {
          this.formNotificacion.disable();
        }
      }
    }));

    console.log(this.fraudesData)
    localStorage.setItem("fraude", JSON.stringify(this.fraudesData))
  }

  /** Inicializar el formulario de registrar analisis*/
  initFormAnalisis(): void {
    this.formAnalisis.controls['conclusion'].disable();
  }

  /**
   * Obtener listas tipos
   */
  async loadListasTipos(): Promise<void> {
    /** Registrar analisis */
    this.tpCausas = await this._api.getLista('CAUSAS');
    this.tpResolucion = await this._api.getLista('RESOLUCION_FRAUDE');
    this.tpAccionesEjecutar = await this._api.getLista('ACCION_EJECUTAR_FRAUDE');
    await this.mapAccionesEjecutar();
    /** Registrar sanción */
    this.tpSancion = await this._api.getLista('SANCIONES');
    this.tpAplicarSancion = await this._api.getLista('APLICAR_SANCION');
    /** Enviar notificación */
    this.loadPlantillas();
    this.tpMedio = await this._api.getLista('MEDIO_NOTIFICACION');
    this.loadUsers();
  }

  /** Cargar plantillas para enviar notificacion */
  async loadPlantillas(): Promise<void> {
    this.tpPlantilla = [];
    const responseData = await this.analizarFraudeService.getPlantillas();
    if (responseData.status === this.utils.successMessage) {
      this.tpPlantilla = responseData.data.plantillas;
    } else if (responseData.show) {
      await this.utils.openErrorAlert(responseData.message);
    }
  }

  /** Cargar usuarios para enviar notificacion */
  async loadUsers(): Promise<void> {
    this.users = [];
    // Convertir setNumber a Array de numeros para buscar los usuarios con los ids de fraudes
    const arrayObj: number[] = [];
    this.setOfCheckedId.forEach(id => arrayObj.push(id));
    /** Validar que existan id de fraudes para consumir endpoint */
    if (arrayObj.length == 0) return;
    const responseData = await this.analizarFraudeService.getUsuariosNotificacion(arrayObj);
    if (responseData.status === this.utils.successMessage) {
      this.users = responseData.data.user;
    } else if (responseData.show) {
      await this.utils.openErrorAlert(responseData.message);
    }
  }

  /** Mapear acciones para deshabilitar las acciones hasta que el usuario seleccioné una resolución */
  mapAccionesEjecutar(): void {
    this.tpAccionesEjecutar = this.tpAccionesEjecutar.map(accion => {
      accion.disabled = true;
      return accion;
    });
  }

  /** Habilitar accion a ejecutar segun selección del usuario en el campo resolución */
  enableAccionEjecutar(event: number): void {
    this.formAnalisis.controls['fkAccion'].reset();
    console.log(event)
    this.mapAccionesEjecutar();
    this.tpAccionesEjecutar = this.tpAccionesEjecutar.map(accion => {
      // Habilitar acción (cerrar caso) cuando la resolución sea (No procedente) de lo contrario habilitar opción (Desbloquear cuenta)
      console.log(accion)
      if (accion.id == 422 && event == 420)
        accion.disabled = false;
      else if (accion.id == 423 && event != 420)
        accion.disabled = false;
      else if (accion.id == 520 && event == 518)
        accion.disabled = false;
      else if (accion.id == 521 && event == 517)
        accion.disabled = false;
      return accion;
    });
  }
  
  /** Habilitar campo conclusion si se desea cerrar el caso */
  enableConclusion(event: number): void {
    this.formAnalisis.controls['conclusion'].reset();
    this.formAnalisis.controls['conclusion'].disable();
    if (event == null) return;
    if (event == 422 || event == 520) {
      this.formAnalisis.controls['conclusion'].enable();
    }
  }

  /** Validacion para el campo conclusión */
  validarConclusion(): boolean {
    this.formAnalisis.controls['conclusion'].markAsDirty();
    /** Validamos que si la opción es cerrar caso se valida que el campo sea obligatorio*/
    if (this.formAnalisis.controls['fkAccion'].value == 422 && (this.formAnalisis.controls['conclusion'].value == null || this.formAnalisis.controls['conclusion'].value == '')) {
      this.formAnalisis.controls['conclusion'].setErrors({ required: true });
      return true;
    }
    return false;
  }

  /** Cambiar pestaña */
  changeTab(tabIndex: number): void {
    this.analizarFraudeService.tabAccionesSubject$.next(tabIndex);
  }

  /**
   * Registrar analisis
   */
  async registerAnalisis(): Promise<void> {
    if (this.validarConclusion()) return;
    /** Validar que hayan casos por analizar */
    if (this.setOfCheckedId.size <= 0) {
      /** Mostrar mensaje de error */
      await this.utils.openErrorAlert('No hay casos por analizar.');
      return;
    }
    if (this.formAnalisis.invalid) {
      this.utils.validateForm(this.formAnalisis);
      return;
    }
    /** Obtener formulario */
    const data: RegistrarAnalisis = this.formAnalisis.getRawValue();
    /** Obtener usuario */
    const auth: IUser = this.authService.getAuth();
    const idUsuario = auth.user.id;
    /** Objeto de casos por analizar a guardar */
    let listaCasosPorAnalizar: any[] = [];

    let fraudeAgrupado: boolean = false;

    const grupos: any[] = []
    const fraudes: any[] = []

    this.fraudesData.forEach(element => {
      if (element.isGroup) {
        fraudeAgrupado = true;
        element.fraudes.forEach(elements => {
          const elementCasosPorAnalizar: RegistrarAnalisis = {
            fkfraude: elements.id,
            fkCausa: data.fkCausa,
            detCausa: data.detCausa,
            fkResolucion: data.fkResolucion,
            fkAccion: data.fkAccion,
            tipo: 'REGISTRAR',
            usuarioRegi: idUsuario,
            estado: data.fkAccion == 210 ? 2 : 1,
            conclusion: data.conclusion
          }
          grupos.push(elementCasosPorAnalizar)
          // listaCasosPorAnalizar.push({"grupos" : { "registrosFraude" :elementCasosPorAnalizar }});
        }
        )
        return
      }
      const elementCasosPorAnalizar: RegistrarAnalisis = {
        fkfraude: element.id,
        fkCausa: data.fkCausa,
        detCausa: data.detCausa,
        fkResolucion: data.fkResolucion,
        fkAccion: data.fkAccion,
        tipo: 'REGISTRAR',
        usuarioRegi: idUsuario,
        estado: data.fkAccion == 210 ? 2 : 1,
        conclusion: data.conclusion
      }
      fraudes.push(elementCasosPorAnalizar)
      // listaCasosPorAnalizar.push({ "fraude": elementCasosPorAnalizar });
    });
    let listaCasosPorAnalizarGrupos = {};
    if (fraudeAgrupado) {
      listaCasosPorAnalizarGrupos = {
        "grupos": grupos,
        "fraudes": fraudes
      }
    } else {
      listaCasosPorAnalizar.length = 0;
      this.setOfCheckedId.forEach(id => {
        const elementCasosPorAnalizars: RegistrarAnalisis = {
          fkfraude: id,
          fkCausa: data.fkCausa,
          detCausa: data.detCausa,
          fkResolucion: data.fkResolucion,
          fkAccion: data.fkAccion,
          tipo: 'REGISTRAR',
          usuarioRegi: idUsuario,
          estado: data.fkAccion == 422 ? 2 : 1,
          conclusion: data.conclusion
        }
        listaCasosPorAnalizar.push(elementCasosPorAnalizars);
      });
    }

    let response;

    if (fraudeAgrupado) {
      response = await this.analizarFraudeService.registrarAnalisisAgrupados(listaCasosPorAnalizarGrupos);
    } else {
      // Realizar petición para registrar analisis de 1 o mas fraudes
      response = await this.analizarFraudeService.registerAnalisis(listaCasosPorAnalizar);
    }
    if (response && response.status === this.utils.successMessage) {
      await Swal.fire(this.utils.getSuccessModalOptions(`¡Se ha registrado correctamente el análisis del posible fraude!`, this.utils.titleSuccessMessage));
      /** Limpiar lista de casos por analizar */
      // this.analizarFraudeService.fraudesPorAnalizar$.next([]); // Se comentó porque no se sabe si al registrar se debe limpiar la tabla
      /** Limpiar registro checked seleccionados */
      // this.setOfCheckedId.clear(); // Se comentó porque no se sabe si al registrar se debe limpiar la tabla
      /** Invocar de nuevo la peticion para refrescar analisis registrados */
      this.analizarFraudeService.idFraudesPorAnalizar$.next(this.setOfCheckedId);
      /** Limpiar formulario */
      this.formAnalisis.reset();
    } else {
      await Swal.fire(this.utils.getErrorModalOptions(response.message));
    }
  }

  /**
   * Registrar sancion
   */
  async registerSancion(): Promise<void> {
    /** Validar que hayan casos por analizar */
    if (this.fraudesAnalizados.length <= 0) {
      /** Mostrar mensaje de error */
      await this.utils.openErrorAlert('No hay fraudes por sancionar.');
      return;
    }
    if (this.formSancion.invalid) {
      this.utils.validateForm(this.formSancion);
      return;
    }
    /** Obtener formulario */
    const data: RegistrarSancion = this.formSancion.getRawValue();
    /** Obtener usuario */
    const auth: IUser = this.authService.getAuth();
    const idUsuario = auth.user.id;
    /** Objeto para registrar sancion a guardar */
    let listaRegistrarSancion: RegistrarSancion[] = [];

    this.fraudesAnalizados.forEach(fraude => {
      const elementSancion: RegistrarSancion = {
        fkfraude: fraude.fkfraude,
        fkSancion: data.fkSancion,
        detSancion: data.detSancion,
        fkApliSancion: JSON.stringify(data.fkApliSancion),
        observacion: data.observacion,
        tipo: 'SANCION',
        usuarioRegi: idUsuario,
        estado: 1
      };
      listaRegistrarSancion.push(elementSancion);
    });

    // Realizar petición para registrar sancion
    const response = await this.analizarFraudeService.registerSanction(listaRegistrarSancion);
    if (response && response.status === this.utils.successMessage) {
      await Swal.fire(this.utils.getSuccessModalOptions(`¡Se ha registrado correctamente los fraudes sancionados!`, this.utils.titleSuccessMessage));
      /** Invocar de nuevo la peticion para refrescar sanciones registradas */
      this.analizarFraudeService.idFraudesPorAnalizar$.next(this.setOfCheckedId);
      /** Limpiar formulario */
      this.formSancion.reset();
    } else {
      await Swal.fire(this.utils.getErrorModalOptions(response.message));
    }
  }

  /**
   * Enviar notificacion
   * @param guardarBorrador: boolean => por defecto false, si se envia como borrador cambie el estado
   * @returns 
   */
  async sendNotificacion(guardarBorrador = false): Promise<void> {
    /** Validar que hayan casos por sancionar */
    if (this.fraudesSancionados.length <= 0) {
      /** Mostrar mensaje de error */
      await this.utils.openErrorAlert('No hay fraudes para enviar notificación.');
      return;
    }
    if (this.formNotificacion.invalid) {
      this.utils.validateForm(this.formNotificacion);
      return;
    }
    /** Validar que sea una notificacion en borrador para editar */
    if (this.editarNotificacionSelect) {
      this.editNotification(guardarBorrador);
      return;
    }
    /** Si el usuario seleccionó guardar en borrador no enviar mensaje de alerta */
    if (guardarBorrador) {
      this.saveNotification(true);
      return;
    }
    await Swal.fire(this.utils.getQuestionModalOptions(`¿Está seguro(a) que desea enviar esta notificación?`, ''))
      .then(async (result) => {
        if (result.isConfirmed) {
          this.saveNotification(false);
        }
      });
  }

  /**
   * Guardar notificacion
   * @param guardarBorrador: boolean => por defecto false, si se envia como borrador cambie el estado
   */
  async saveNotification(guardarBorrador = false): Promise<void> {
    /** Obtener formulario */
    const data: EnviarNotificacion = this.formNotificacion.getRawValue();
    /** Obtener usuario */
    const auth: IUser = this.authService.getAuth();
    const idUsuario = auth.user.id;
    /** Objeto para enviar notificacion */
    let listaNotificacion: EnviarNotificacion[] = [];
    /** Transformar array de string a numericos */
    const usuariosNumber = data.usuarios.map(Number);

    this.fraudesSancionados.forEach(fraude => {
      const elementNotificacion: EnviarNotificacion = {
        fkfraude: fraude.fkfraude,
        tipo: 'NOTIFICACION',
        usuarioRegi: idUsuario,
        estado: guardarBorrador ? 2 : 1,
        fkPlantilla: data.fkPlantilla,
        fkMedio: data.fkMedio,
        usuarios: JSON.stringify(usuariosNumber),
        asunto: data.asunto,
        cuerpoMensaje: data.cuerpoMensaje
      };
      listaNotificacion.push(elementNotificacion);
    });

    // console.log(listaNotificacion);

    // Realizar petición para enviar notificacion
    const response = await this.analizarFraudeService.enviarNotificacion(listaNotificacion);
    if (response && response.status === this.utils.successMessage) {
      /** Si no es guardar como borrador mostrar alerta de mensaje que se guardo correctamente */
      await Swal.fire(this.utils.getSuccessModalOptions(!guardarBorrador ? 'Notificación enviada correctamente.' : 'Guardado como borrador.', this.utils.titleSuccessMessage));
      /** Invocar de nuevo la peticion para refrescar notificaciones */
      this.analizarFraudeService.idFraudesPorAnalizar$.next(this.setOfCheckedId);
      /** Limpiar formulario */
      this.formNotificacion.reset();
      this.formNotificacion.enable();
    } else {
      await Swal.fire(this.utils.getErrorModalOptions(response.message));
    }
  }

  /**
   * Editar notificacion
   * @param guardarBorrador: boolean => por defecto false, si se envia como borrador cambie el estado
   */
  async editNotification(guardarBorrador = false): Promise<void> {
    /** Obtener formulario */
    const data: EnviarNotificacion = this.formNotificacion.getRawValue();
    /** Transformar array de string a numericos */
    const usuariosNumber = data.usuarios.map(Number);

    const dataEditar: EnviarNotificacion = {
      fkfraude: this.editarNotificacionSelect.fkfraude,
      tipo: 'NOTIFICACION',
      usuarioRegi: this.editarNotificacionSelect.usuarioRegi,
      estado: guardarBorrador ? 2 : 1,
      fkPlantilla: data.fkPlantilla,
      fkMedio: data.fkMedio,
      usuarios: JSON.stringify(usuariosNumber),
      asunto: data.asunto,
      cuerpoMensaje: data.cuerpoMensaje
    };
    // console.log(dataEditar);
    /** Si el usuario seleccionó guardar en borrador no enviar mensaje de alerta */
    if (guardarBorrador) {
      this.sendEditarNotificacion(dataEditar);
      return;
    }
    // Realizar petición para editar y enviar notificacion
    await Swal.fire(this.utils.getQuestionModalOptions(`¿Está seguro(a) que desea enviar esta notificación?`, ''))
      .then(async (result) => {
        if (result.isConfirmed) {
          this.sendEditarNotificacion(dataEditar);
        }
      });
  }

  /**
   * Realizar peticion PUT para editar o enviar notificacion
   * @param dataEditar: EnviarNotificacion
   */
  async sendEditarNotificacion(dataEditar: EnviarNotificacion): Promise<any> {
    // Objeto para actualizar
    const dataUpdate: UpdateNotificacion = {
      id: this.editarNotificacionSelect.id,
      usuarios: dataEditar.usuarios,
      cuerpoMensaje: dataEditar.cuerpoMensaje,
      asunto: dataEditar.asunto,
      fkPlantilla: dataEditar.fkPlantilla,
      fkMedio: dataEditar.fkMedio,
      estado: dataEditar.estado
    };

    // Realizar petición para editar y enviar notificacion
    const response = await this.analizarFraudeService.editNotificacion(dataUpdate);
    if (response && response.status === this.utils.successMessage) {
      /** Si no es guardar como borrador mostrar alerta de mensaje que se guardo correctamente */
      await Swal.fire(this.utils.getSuccessModalOptions(dataEditar.estado == 1 ? 'Notificación actualizada y enviada correctamente.' : 'Actualizada como borrador.', this.utils.titleSuccessMessage));
      /** Invocar de nuevo la peticion para refrescar notificaciones */
      this.analizarFraudeService.idFraudesPorAnalizar$.next(this.setOfCheckedId);
      /** Limpiar formulario */
      this.formNotificacion.reset();
      this.formNotificacion.enable();
      /** Limpiar variable editar cuando se edita */
      this.analizarFraudeService.editarNotificacion$.next(undefined);
    } else {
      await Swal.fire(this.utils.getErrorModalOptions(response.message));
    }
  }

  /**
   * Se debe cargar el asunto del mensaje. Si en plantilla se seleccionó la opción “Ninguna” o no hay aún alguna seleccionada, 
   * entonces debe mostrarse este campo vacío,
   */
  async changeAsuntoCuerpo(value: number): Promise<void> {
    if (value == null) return;
    const plantillaSelect = this.tpPlantilla.find(plantilla => plantilla.id == value);
    if (value == 0) {
      this.formNotificacion.controls['asunto'].reset();
      this.formNotificacion.controls['cuerpoMensaje'].reset();
      this.formNotificacion.controls['asunto'].enable();
      this.formNotificacion.controls['cuerpoMensaje'].enable();
      return;
    }
    if (!plantillaSelect) {
      await this.utils.openErrorAlert('No se encontro la plantilla seleccionada');
      return;
    }
    this.formNotificacion.controls['asunto'].reset(plantillaSelect.asunto);
    this.formNotificacion.controls['cuerpoMensaje'].reset(plantillaSelect.mensaje);
    this.formNotificacion.controls['asunto'].disable();
    this.formNotificacion.controls['cuerpoMensaje'].disable();
  }

  /**
   * Cerrar caso
   */
  async cerrarCaso(): Promise<void> {
    if (this.formCerrarCaso.invalid) {
      this.utils.validateForm(this.formCerrarCaso);
      return;
    }
    /** Obtener formulario */
    const data: any = this.formCerrarCaso.getRawValue();
  }


  /** Resetear tab y desuscribirse */
  ngOnDestroy(): void {
    this.analizarFraudeService.tabTablasSubject$.next(0);
    /** Limpiar lista de ID's de casos por analizar */
    this.analizarFraudeService.idFraudesPorAnalizar$.next(new Set());
    /** Limpiar lista de fraudes analizados de tabla analisis registrados */
    this.analizarFraudeService.fraudesAnalizados$.next([]);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
* Cerrar modal detalle de control
*/
  closeModalShow(): void {
    this.isVisiblePDF = false;
  }

  renderFileInTemplateDownloads() {
    this.isVisiblePDF = true;
    const body = {
      "fileName": "XT_RC01_HorariosAperturaCierre_202302",
      "type": "PDF",
      "typeDataSource": "CONN",
      "connect": "TICKETING",
      "params": {
        "ID_USUARIO": 0,
        "USUARIO": "Alison Prieto",
        "ID_ENTIDAD": 0,
        "ID_SERVICIO": 0
      }
    }
    this.api.downloadImageDiscountReports(body)
      .subscribe(
        {
          next: (value: Blob) => {
            const urlCreator = window.URL || window.webkitURL;
            this.urlFile = this.sanitazer.bypassSecurityTrustUrl(urlCreator.createObjectURL(value));
            this.urlFile = this.urlFile.changingThisBreaksApplicationSecurity;
          },
          error: (err: any) => {
            console.log(err)
          },
          complete: () => {
            console.log("La suscripción al observable ha finalizado");
          },
        }
      )
  }

}
