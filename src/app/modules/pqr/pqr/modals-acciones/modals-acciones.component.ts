import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


import { PqrServiceService } from '../../services/pqr-service.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

import { today, camposAccionesModals } from './camposFormularios';
import { plantillas } from './plantillas';

import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';

@Component({
  selector: 'app-modals-acciones',
  templateUrl: './modals-acciones.component.html',
  styleUrls: ['./modals-acciones.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class ModalsAccionesComponent implements OnInit {
  
  // PAGINATION
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  numberRow: number = 5;
  page: number = 1;

  // disparador de los modales y las funciones que se deben ejecutar
  @Input()
  set abrirModal(modal: {accion: any, pqr: any}) {
    if (modal != undefined && modal.accion.codigo != undefined) {

      // se crea el formulario para el modal
      this.buildForm(modal.accion.codigo);
  
      // se hace visible el modal y se setea el código de la pqr
      this.findModal(modal.accion.codigo)!.visible = !this.findModal(modal.accion.codigo)!.visible;
      this.codPqr = modal.pqr.id;
      this.pqr = modal.pqr;
      this.accion = modal.accion;
      this.getEstadoFromAccion();


      // acciones asíncronas para los modales para cuando se abran

      // Para responder la pqr
      if (modal.accion.codigo == "PLANT") {
        // this.getRespuestaPQR(parseInt(modal.pqr.id));
        this.form.controls["descripcion_respuesta"].setValue(this.pqr?.descripSolu);
        this.validarUsuarioAsignado();
      }
      
      // Para obtener el historial de la pqr
      if (modal.accion.codigo == "HISTO") {
        this.getHistorialPqr();
      }

      // Para obtener los archivos cargados a la pqr
      if (modal.accion.codigo == "SUBIR") {
        this.getArchivosPqr();
      }

    }
  }

  @Output() accionEjecutada = new EventEmitter();


  pqr:any = {};
  modalVisibleResponder = false;
  acciones: any;
  codPqr = "";
  activeModal = "";
  responsables:any;
  estadosPqr:any;
  accion:any;
  estadoFromAccion:any;
  activo = "1";
  plantillas = plantillas;
  respuestaPqr = "";
  responsableInfo!:any;
  files!:File;
  archivosPqr!:any[];
  respuestaReadOnly = false;
  readOnlyInputClass = "readonly-input";
  textAreaClass = "";
  actualResponse:any;

  // de las acciones
  // se debe cambiar a creación dinámica desde la base de datos
  modals = [
    { name: "ASIAB", visible: false, campos: camposAccionesModals["ASIAB"], },
    { name: "SUBIR", visible: false, campos: camposAccionesModals["SUBIR"], },
    { name: "RECHA", visible: false, campos: camposAccionesModals["RECHA"], },
    { name: "ENVNO", visible: false, campos: camposAccionesModals["ENVNO"], },
    { name: "PLANT", visible: false, campos: camposAccionesModals["PLANT"], },
    { name: "CITAR", visible: false, campos: camposAccionesModals["CITAR"], },
    { name: "NOTIF", visible: false, campos: camposAccionesModals["NOTIF"], },
    { name: "NOTCO", visible: false, campos: camposAccionesModals["NOTCO"], },
    { name: "NOTAV", visible: false, campos: camposAccionesModals["NOTAV"], },
    { name: "HISTO", visible: false, campos: camposAccionesModals["HISTO"], },
    { name: "CERRA", visible: false, campos: camposAccionesModals["CERRA"], },
    { name: "PRORR", visible: false, campos: camposAccionesModals["PRORR"], },
  ];

  historial:any[] = [
    {
      estadoAnterior: "Cargando...",
      estadoActual: "Cargando...",
      fechaModificacion: "Cargando...",
      usuarioBd: "Cargando...",
      descripcionAccionRealizada: "Cargando...",
    }
  ];

  archivos:any[] = [];

  noHayHistorial = true;
  noHayArchivos = true;

  form = new FormGroup({});
  formResponder = new FormGroup({});


  // Paginador
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }
  onChangePage(event: number): void {
    this.page = event;
  }

  // Getters y setters
  get today():string {
    return new Date().toISOString().substring(0,10);
  }

  get auth() {
    return JSON.parse(localStorage.getItem('auth')!);
  } 

  // construccion del reactive form
  buildForm(modalName:string) {
    const formControls = {};
    this.findModal(modalName)!.campos.forEach( (campo) => {
      formControls[campo.name] = this.formBuilder.control(campo.defaultValue, campo.validations);
    });
    this.form = this.formBuilder.group(formControls);
  }


  
  // funciones para los datos de los input
  label(modalName:string, inputName: string){
    return this.findModal(modalName)!.campos.find( campo => campo.name == inputName )!.label.trim() ?? "Label unknown"
  }
  tipo(modalName:string, inputName: string) {
    return this.findModal(modalName)!.campos.find( campo => campo.name == inputName )!.tipo.trim() ?? "Tipo unknown"
  }
  controlValid(modalName:string, inputName: string) {
    // return this.form.status === "INVALID" && this.form.touched;
    return this.form.controls[inputName].touched && this.form.controls[inputName].status === "INVALID";
  }
  errorMessage(modalName:string, inputName: string) {
    return this.findModal(modalName)!.campos.find( campo => campo.name == inputName )!.errorMsg.trim() ?? "Message unknown"
  }

  // Llamado a la función del modal
  funcionModal(modalName:string) {
    // luego se retorna la función asignada al modal
    switch (modalName) {
      case "PLANT":
        this.responderPqr(this.pqr.id);
        break;
      case "RECHA":
        this.rechazarPqr(modalName);
        break;
      case "ASIAB":
        this.asignarAbogado(modalName);
        break;
      case "SUBIR":
        this.subirArchivos(modalName);
        break;
      case "ENVNO":
        this.enviarANotificacion(modalName);
        break;
      case "CITAR":
        this.citarUsuario(modalName);
        break;
      case "NOTIF":
        this.notificarUsuario(modalName);
        break;
      case "NOTCO":
        this.notificarUsuarioPorCorreo(modalName);
        break;
      case "NOTAV":
        this.notificarUsuarioPorAviso(modalName);
        break;
      case "PRORR":
        this.notificarUsuarioProrroga(modalName);
        break;
      case "CERRA":
        this.cerrarPqr(modalName);
        break;
    }
  }

  // creación del body del request para responder la pqr
  createRequestBody(cod_pqr:string) {
    let body = {   
      id:             parseInt(cod_pqr),
      codEmpr:        this.pqr.codEmpr,
      idEntidad:      this.pqr.idEntidad,
      codPqrRes:      "",
      idUsuarioResp:  parseInt(this.auth.user.id),
      fecRes:         this.form.get("fecha_respuesta")?.value,
      descripSolu:    this.form.get("descripcion_respuesta")?.value,
    };
    return body;
  }

  async getEstadosPqr() {
    let urlParams = new URLSearchParams({
      idEntidad: `${this.auth.user.entities[0].id}`,
      idPerfil: `${this.auth.user.profileId}`
    });
    this.estadosPqr = await this.pqrService.getEstadosPqrVisiblesFromPerfil(urlParams.toString());
  }

  async getEstadoFromAccion() {
    if ( this.accion?.idAccion || this.accion?.id ) {
      let urlParams = new URLSearchParams({
        idEntidad: this.auth.user.entities[0].id,
        idAccion:  this.accion.idAccion ?? this.accion.id,
        activo:    this.activo,
      });
      this.pqrService.getEstadoFromAccion(urlParams.toString())
      .then( response => {
        if (response.data.pqr?.length > 0) {
          this.estadoFromAccion = response.data.pqr[0];
        }
      })
      .catch( error => console.log(error) );
    }
  }


  async enviarEmail(plantillaName:string) {
    // se asume que todas las pqr tienen email

    let alertMessage = "";

    // se obtiene el objeto plantilla para el mensaje
    const plantilla = this.getPlantillaCorreo(plantillaName);

    let correo = "";

    // si el mensaje lleva la respuesta a la this.pqr, se recupera
    if ( ["notificarUsuarioPorCorreo", "notificarUsuario"].includes(plantillaName) ) {
      this.respuestaPqr = await this.getRespuestaPQR(this.pqr.id);
      correo = this.pqr.mail;
    }

    if (plantillaName === "notificarResponsable") {
      const request = await this.getResponsableEmailAddress(this.form.controls["responsables"].value);
      if (request.data?.usuario?.email) {
        this.responsableInfo = request.data.usuario;
        correo = this.responsableInfo.email;
      }
      else {
        alertMessage = " No se ha encontrado información de email del usuario asignado.";
      }
    }
    
    // se reemplazan todas las variables existentes en las plantillas.ts
    const asunto = this.replaceVariables(plantilla!.asunto);
    const mensaje = this.replaceVariables(plantilla!.mensaje);

    // se hace el llamado al servicio de enviar el correo
    const response = await this.pqrService.enviarEmail(correo, asunto, mensaje);

    // se muestra un sweetAlert dependiendo de la respuesta del servicio
    (response.status === "success" && response.data?.pqr) ? 
      this.utilsService.openSuccessAlert("Se ha enviado mensaje al usuario.") : 
      this.utilsService.openErrorAlert("No se ha podido enviar el mensaje al usuario." + alertMessage);
  }

  getResponsableEmailAddress(idUsuarioRes:number) {
    return this.pqrService.getInfoUsuarioById(idUsuarioRes);
  }

  getPlantillaCorreo(plantillaName:string) {
    return this.plantillas.find( plantilla => plantilla.name === plantillaName) || this.plantillas.find( plantilla => plantilla.name === "default");
  }

  replaceVariables(mensaje:string) {
    // se construye el array con las variables que existen en las plantllas y su respecivo reemplazo
    const variables_reemplazos = [
      { name: "\\[variable_cod_pqr\\]",           reemplazo: this.pqr.id, },
      { name: "\\[variable_nombre\\]",            reemplazo: this.pqr.nomSolicitante, },
      { name: "\\[variable_respuesta_pqr\\]",     reemplazo: this.respuestaPqr, },
      { name: "\\[variable_empresa\\]",           reemplazo: this.auth["user"].entities[0].name, },
      { name: "\\[variable_nombre_responsable\\]",reemplazo: this.responsableInfo?.username, },
      { name: "\\[variable_usuario_actual\\]",    reemplazo: this.auth["user"].firstName + " " + this.auth["user"].lastName, },
      { name: "\\[variable_fecha_max\\]",         reemplazo: this.actualResponse?.fechaMaxSol ?? "" },
    ]
    let mensajeReemplazado = mensaje;
    for (let variable of variables_reemplazos) {
      mensajeReemplazado = mensajeReemplazado.replace(new RegExp(variable.name, "g"), variable.reemplazo);
    }
    return mensajeReemplazado;
  }

  // --------------- funciones para los archivos adjuntos
  async handlePqrRegistroFiles(evento) {
    const acceptedTypes = ["application/pdf", "image/png", "image/gif", "image/jpeg", "image/jpg"];

    if (evento.target.files.length > 1) {
      await this.utilsService.openErrorAlert("Debe adjuntar solo un archivo.");
    }
    else {
      if (!acceptedTypes.includes(evento.target.files[0].type)) {
        await this.utilsService.openErrorAlert("Solo se permiten los archivos de tipo:\n " + acceptedTypes.join(", "));
      }
      else {
        this.files = evento.target.files[0];
      }
    }
  }

  sendArchivoAdjunto() {
    if (this.files?.name) {

      const fileName = new Date().getTime().toString() + '-' + this.files.name;

      const urlParams = new URLSearchParams({
        codePqr:    this.pqr.id,
        codEmpr:    this.pqr.codEmpr,
        usuarioBd:  `${this.auth["user"].username}`,
        idEntidad:  this.pqr.idEntidad,
        filename:   fileName,
      });

      const formData:FormData = new FormData();
      formData.append("filename", this.files, fileName);
  
      // llamado al servicio
      this.pqrService.subirArchivoPqr(urlParams.toString(), formData).then( response => {
        (response.status === "success" && response.data?.pqr.fileKey) ? 
          this.utilsService.openSuccessAlert(`Se ha cargado el archivo ${response.data.pqr.filename} exitosamente`) : 
          this.utilsService.openErrorAlert("No se ha podido cargar el archivo adjunto.");
      });
    }
  }

  getArchivosPqr() {
    const urlParams = new URLSearchParams({
      codePqr:    this.pqr.id,
      codEmpr:    this.pqr.codEmpr,
      idEntidad:  this.pqr.idEntidad,
    });
    this.pqrService.getArchivosPqr(urlParams.toString()).then( response => {
      if (response.data?.pqr[0]?.id) {
        this.archivos = response.data.pqr;
        this.noHayArchivos = false;
      }
      else {
        this.archivos = [];
        this.noHayArchivos = true;
      }
    });
  }
// ---------------------------- archivos -------------------------
  

  // funciones para manejo de los modales
  
  findModal(modalName:string) {
    return this.modals.find(modal => modal.name === modalName);
  }

  switchModal(modalName:string) {
    this.findModal(modalName)!.visible = !this.findModal(modalName)!.visible;
  }

  // funcion para refrescar la lista de las pqr cuando se ejecuta una acción
  refrescarListaPqr() {
    this.accionEjecutada.emit("refrescarLista");
  }

  // --------------------------------- funciones de los modales --------------------------------
  // funcion para responder la pqr
  async getRespuestaPQR(cod_pqr:number) {

    let respuesta = "";

    // mientras se hace la llamada a la respuesta se muestra el mensaje
    this.form.get("descripcion_respuesta")?.setValue("Cargando respuesta...");

    // llamada al servicio para guardar los datos en la pqr
    let request = await this.pqrService.getRespuestaPQR(`${cod_pqr.toString()}?idEntidad=${this.pqr.idEntidad}&codEmpr=${this.pqr.codEmpr}`);

    if (request.data.pqr.fecRes) {
      respuesta = request.data.pqr.descripSolu;
      this.form.get("fecha_respuesta")?.setValue(request.data.pqr.fecRes);
      this.form.get("descripcion_respuesta")?.setValue(respuesta);
    }
    else {
      this.form.get("fecha_respuesta")?.setValue(today);
      this.form.get("descripcion_respuesta")?.setValue("");
    }
    return respuesta;
    
  }

  async responderPqr(cod_pqr:string) {
    this.switchModal('PLANT');
    if (!this.respuestaReadOnly) {
      let body = this.createRequestBody(cod_pqr);
  
      // llamada al servicio para guardar los datos en la pqr
      let request = await this.pqrService.responderPQR(body);
      if (request.status == "success") {
        this.utilsService.openSuccessAlert(request.message);
      }
      else {
        this.utilsService.openErrorAlert(request.message);
      }
      this.refrescarListaPqr();
    }
  }

  async getResponsablesPqr() {
    let responsables = await this.pqrService.getResponsablesPqr();
    if ( Array.from(responsables.data.pqr).length > 0 ) {
      this.responsables = responsables.data.pqr;
    }
  }

  getResponsableById(idResponsable) {
    return this.responsables.find( responsable => responsable.id === idResponsable );
  }

  async rechazarPqr(modalName:string) {
    this.switchModal(modalName);
    
    // se valida que la pqr no esté en el estado al que va a pasar si se ejecuta la accion
    if (this.validarAccionEstadoActuales()) {
      if (this.form.valid) {
        let body = this.createBodyRechazarPqr();
        let urlParams = new URLSearchParams(body);
        let response = await this.pqrService.ejecutarAccion("rechazarPqr", urlParams.toString());
        if (response.data?.pqr) { 
          this.utilsService.openSuccessAlert("Se ha rechazado la asignación de la pqr " + this.pqr.id + ".");
        }
        else {
          this.utilsService.openErrorAlert("No se ha podido ejecutar la acción de rechazar.");
        }
        this.refrescarListaPqr();
      }
    }
  }


  async asignarAbogado(modalName:string) {
    this.switchModal(modalName);
    
    // se valida que la pqr no esté en el estado al que va a pasar si se ejecuta la accion
    if (this.validarAccionEstadoActuales()) {
      if (this.form.valid) {
        let body = this.createBodyAsignarAbogado();
        let urlParams = new URLSearchParams(body);
        let response = await this.pqrService.ejecutarAccion("asignarAbogado", urlParams.toString());
        if (response.status === "success" && response.data?.pqr) {
          await this.utilsService.openSuccessAlert(`Se ha asignado el responsable ${this.getResponsableById(this.form.controls["responsables"].value).username.toUpperCase()}.`);
          this.enviarEmail("notificarResponsable");
        }
        else {
          this.utilsService.openErrorAlert("No se ha podido enviar el mensaje de registro al usuario.");
        }
        this.refrescarListaPqr();
      }
    }
  }


  async subirArchivos(modalName:string) {
    if (this.form.valid) {
      this.sendArchivoAdjunto();
      this.switchModal(modalName);
      // this.refrescarListaPqr();
    }
  }


  async enviarANotificacion(modalName:string) {
    this.switchModal(modalName);
    
    // se valida que la pqr no esté en el estado al que va a pasar si se ejecuta la accion
    if (this.validarAccionEstadoActuales()) {
      if (this.form.valid) {
        let body = this.createBodyEnviarANotificacion();
        let urlParams = new URLSearchParams(body);
        let response = await this.pqrService.ejecutarAccion("enviarANotificacion", urlParams.toString());
        if (response.status === "success" && response.data?.pqr) {
          await this.utilsService.openSuccessAlert(`Se ha enviado al encargado de notificación.`);
        }
        else {
          this.utilsService.openErrorAlert("No se ha podido enviar el mensaje de registro al usuario encargado de notificación.");
        }
        this.refrescarListaPqr();
      }
    }
  }


  async citarUsuario(modalName:string) {
    this.switchModal(modalName);
    
    // se valida que la pqr no esté en el estado al que va a pasar si se ejecuta la accion
    if (this.validarAccionEstadoActuales()) {
      if (this.form.valid) {
        let body = this.createBodyCitarUsuario();
        let urlParams = new URLSearchParams(body);
        let response = await this.pqrService.ejecutarAccion("citarUsuario", urlParams.toString());
        if (response.status === "success" && response.data?.pqr) {
          await this.utilsService.openSuccessAlert(`Se ha enviado la citación al usuario.`);
          this.enviarEmail("citarUsuario");
        }
        else {
          this.utilsService.openErrorAlert("No se ha podido enviar el mensaje de registro al usuario encargado de notificación.");
        }
        this.refrescarListaPqr();
      }
    }
  }


  async notificarUsuario(modalName:string) {
    this.switchModal(modalName);
    
    // se valida que la pqr no esté en el estado al que va a pasar si se ejecuta la accion
    if (this.validarAccionEstadoActuales()) {
      if (this.form.valid) {
        let body = this.createBodyNotificarUsuario();
        let urlParams = new URLSearchParams(body);
        let response = await this.pqrService.ejecutarAccion("notificarUsuario", urlParams.toString());
        if (response.data?.pqr) { 
          await this.utilsService.openSuccessAlert("El usuario ha sido notificado.");
          this.enviarEmail("notificarUsuario");
        }
        else {
          await this.utilsService.openErrorAlert("No se ha podido notificar al usuario.");
        }
        this.refrescarListaPqr();
      }
    }
  }



  async notificarUsuarioPorCorreo(modalName:string) {
    this.switchModal(modalName);
    
    // se valida que la pqr no esté en el estado al que va a pasar si se ejecuta la accion
    if (this.validarAccionEstadoActuales()) {
      if (this.form.valid) {
        let body = this.createBodyNotificarUsuarioPorCorreo();
        let urlParams = new URLSearchParams(body);
        let response = await this.pqrService.ejecutarAccion("notificarUsuarioPorCorreo", urlParams.toString());
        // se valida para presentar el alert
        if (response.data?.pqr) { 
          await this.utilsService.openSuccessAlert("El usuario ha sido notificado.");
          this.enviarEmail("notificarUsuarioPorCorreo");
        }
        else {
          await this.utilsService.openErrorAlert("No se ha podido notificar al usuario.");
        }
        this.refrescarListaPqr();
      }
    }
  }



  async notificarUsuarioPorAviso(modalName:string) {
    this.switchModal(modalName);

    // se valida que la pqr no esté en el estado al que va a pasar si se ejecuta la accion
    if (this.validarAccionEstadoActuales()) {
      if (this.form.valid) {
        let body = this.createBodyNotificarUsuarioPorAviso();
        let urlParams = new URLSearchParams(body);
        let response = await this.pqrService.ejecutarAccion("notificarUsuarioPorAviso", urlParams.toString());
        
        if (response.status === "success" && response.data?.pqr) {
          await this.utilsService.openSuccessAlert("El usuario ha sido notificado por aviso.");
        }
        else {
          await this.utilsService.openErrorAlert("El usuario no ha sido notificado por aviso.");
        }
        this.refrescarListaPqr();
      }
    }
  }


  async notificarUsuarioProrroga(modalName:string) {
    this.switchModal(modalName);

    // se valida que la pqr no esté en el estado al que va a pasar si se ejecuta la accion
    if (this.validarAccionEstadoActuales()) {
      if (this.form.valid) {
        let body = this.createBodyNotificarUsuarioProrroga();
        let response = await this.pqrService.ejecutarAccion("notificarUsuarioProrroga", "", body);

        // se valida para presentar el alert
        if (response.data?.prorroga) { 
          this.actualResponse = response.data.prorroga;
          await this.utilsService.openSuccessAlert("La prorroga ha sido registrada.");
          this.enviarEmail("notificarUsuarioProrroga");
        }
        else {
          await this.utilsService.openErrorAlert("No se ha podido registrar la prórroga.");
        }
        this.refrescarListaPqr();
      }
    }
  }


  async cerrarPqr(modalName:string) {
    this.switchModal(modalName);

    // se valida que la pqr no esté en el estado al que va a pasar si se ejecuta la accion
    if (this.validarAccionEstadoActuales()) {
      if (this.form.valid) {
        let body = this.createBodyCerrarPqr();
        let urlParams = new URLSearchParams(body);
        let response = await this.pqrService.ejecutarAccion("cerrarPqr", urlParams.toString());
        
        if (response.status === "success" && response.data?.pqr) {
          await this.utilsService.openSuccessAlert("Se ha cerrado la pqr exitosamente.");
          this.enviarEmail("cerrarPqr");
        }
        else {
          await this.utilsService.openErrorAlert("No se ha podido cerrar a pqr.");
        }
        this.refrescarListaPqr();
      }
    }
  }


  validarAccionEstadoActuales() {
    console.log(this.estadoFromAccion)
    const validacion = this.estadoFromAccion.idEstado.toString() === this.pqr.idEstado;
    if (validacion) {
      this.utilsService.openErrorAlert(`La pqr No. ${this.pqr.id} ya se encuentra en estado ${this.estadoFromAccion.nombre} por lo que no se puede ejecutar la acción ${this.estadoFromAccion.descripcion}.`);
    }
    return !validacion;
  }


  validarUsuarioAsignado() {
    this.respuestaReadOnly = this.auth.user.id !== this.pqr.idUsuarioResp;
    this.textAreaClass = this.respuestaReadOnly ? this.readOnlyInputClass : "";
  }


  async getHistorialPqr() {
    this.historial = [{}];
    let body = this.createBodyGetHistorialPqr();
    let urlParams = new URLSearchParams(body);
    let response = await this.pqrService.getHistorialAcciones(urlParams.toString());
    if (response.data?.pqr.length > 0) {
      this.historial = response.data.pqr;
      this.noHayHistorial = false;
    }
    else {
      this.noHayHistorial = true;
    }
  }

  // ---------------- Construcción de los body para los request ------------------------------
  createBodyRechazarPqr() {
    return {
      codePqr:                    this.pqr.id,
      codEmpr:                    this.pqr.codEmpr,
      idEstadoAnterior:           this.pqr.idEstado,
      idEstadoActual:             this.estadoFromAccion.idEstado,
      idUsuarioRes:               this.auth.user.id,
      motivoRechazo:              this.form.controls["motivo_rechazo"].value,
      descripcion:                "Rechazada por el responsable asignado",
      descripcionAccionRealizada: "Rechazada por el responsable asignado",
    };
  }


  createBodyAsignarAbogado() {
    const responsable = this.getResponsableById(this.form.controls["responsables"].value);
    return {
      codPqr:                     this.pqr.id,
      codEmpr:                    this.pqr.codEmpr,
      idEstadoAnterior:           this.pqr.idEstado,
      idEstadoActual:             this.estadoFromAccion.idEstado,
      idUsuarioRes:               this.auth.user.id,
      responsable:                this.form.controls["responsables"].value,
      descripcion:                "Responsable asignado",
      descripcionAccionRealizada: "Responsable asignado: " + responsable.username.toUpperCase(),
    };
  }


  createBodySubirArchivos() {

  }


  createBodyEnviarANotificacion() {
    return {
      codePqr:                    this.pqr.id,
      codEmpr:                    this.pqr.codEmpr,
      idEstadoAnterior:           this.pqr.idEstado,
      idEstadoActual:             this.estadoFromAccion.idEstado,
      idUsuarioRes:               this.auth.user.id,
      descripcion:                "Se envia a notificador",
      descripcionAccionRealizada: "Se envia a notificador",
    };
  }


  createBodyCitarUsuario() {
    return {
      codePqr:                    this.pqr.id,
      codEmpr:                    this.pqr.codEmpr,
      idEstadoAnterior:           this.pqr.idEstado,
      idEstadoActual:             this.estadoFromAccion.idEstado,
      idResponsable:              this.auth.user.id,
      fechaEnvioCita:             this.form.controls["fecha_cita"].value == "" ? "now()" : this.form.controls["fecha_cita"].value,
      descripcion:                "Se envia a citacion.",
      descripcionAccionRealizada: "Se envia a citacion.",
    };
  }


  createBodyNotificarUsuario() {
    return {
      codePqr:                    this.pqr.id,
      codEmpr:                    this.pqr.codEmpr,
      idEstadoAnterior:           this.pqr.idEstado,
      idEstadoActual:             this.estadoFromAccion.idEstado,
      idUsuarioRes:               this.auth.user.id,
      tipoNotificacion:           "63",
      fechaNotificacion:          this.form.controls["fecha_noti"].value == "" ? "now()" : this.form.controls["fecha_noti"].value,
      fechaNotificacione:         this.form.controls["fecha_noti"].value == "" ? "now()" : this.form.controls["fecha_noti"].value,
      descripcion:                "Se notifica personalmente.",
      descripcionAccionRealizada: "Se notifica personalmente.",
    };
  }


  createBodyNotificarUsuarioPorCorreo() {
    return {
      codePqr:                    this.pqr.id,
      codEmpr:                    this.pqr.codEmpr,
      idEstadoAnterior:           this.pqr.idEstado,
      idEstadoActual:             this.estadoFromAccion.idEstado,
      idUsuarioRes:               this.auth.user.id,
      tipoNotificacion:           "63",
      fechaNotificacion:          this.form.controls["fecha_notif_correo"].value == "" ? "now()" : this.form.controls["fecha_notif_correo"].value,
      fechaNotificacione:         this.form.controls["fecha_notif_correo"].value == "" ? "now()" : this.form.controls["fecha_notif_correo"].value,
      descripcion:                "Se notifica por e-mail.",
      descripcionAccionRealizada: "Se notifica por e-mail.",
    };
  }


  createBodyNotificarUsuarioPorAviso() {
    return {
      codePqr:                    this.pqr.id,
      codEmpr:                    this.pqr.codEmpr,
      idEstadoAnterior:           this.pqr.idEstado,
      idEstadoActual:             this.estadoFromAccion.idEstado,
      idUsuarioRes:               this.auth.user.id,
      tipoNotificacion:           "63",
      fechaNotificacion:          this.form.controls["fecha_notif_aviso"].value == "" ? "now()" : this.form.controls["fecha_notif_aviso"].value,
      descripcion:                "Se notifica por aviso.",
      descripcionAccionRealizada: "Se notifica por aviso.",
    };
  }

  
  createBodyNotificarUsuarioProrroga() {
    return {
      codPqr:                     this.pqr.id,
      codTpqr:                    this.pqr.codTpqr,
      codEmpr:                    this.pqr.codEmpr,
      idEstadoAnterior:           parseInt(this.pqr.idEstado),
      idEstadoActual:             this.estadoFromAccion.idEstado,
      idUsuario:                  this.auth.user.id,
      idEntidad:                  this.auth.user.entities[0].id,
      descripcion:                "Se notifica prórroga.",
      descripcionAccionRealizada: this.form.controls["justificacion"].value,
    };
  }


  createBodyGetHistorialPqr() {
    return {
      codePqr: this.pqr.id,
      codEmpr: this.pqr.codEmpr,
    };
  }


  createBodyCerrarPqr() {
    return {
      codePqr:                    this.pqr.id,
      codEmpr:                    this.pqr.codEmpr,
      idEstadoAnterior:           this.pqr.idEstado,
      idEstadoActual:             this.estadoFromAccion.idEstado,
      idUsuarioRes:               this.auth.user.id,
      feCierre:                   "now()",
      observacionCierre:          "Cierre manual por usuario.",
      descripcion:                "Se notifica por aviso.",
      descripcionAccionRealizada: "Se notifica por aviso.",
    };
  }

  // ----------------------------------------------
  constructor(
    private formBuilder:FormBuilder,
    private pqrService:PqrServiceService,
    private utilsService:UtilsService,
    private authService:AuthServiceService,
  ) { }

  ngOnInit(): void {
    this.getResponsablesPqr();
    this.getEstadosPqr();
  }
  
}
