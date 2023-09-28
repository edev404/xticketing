import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { PqrServiceService } from '../../services/pqr-service.service';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';

@Component({
  selector: 'app-pqr-registro',
  templateUrl: './pqr-registro.component.html',
  styleUrls: ['./pqr-registro.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class PqrRegistroComponent implements OnInit, AfterViewInit {

  politicaEmpresa = `Autorizo de manera voluntaria, previa, explícita, informada e inequívoca a ${this.auth["user"].entities[0].name.trim()} para tratar mis datos personales de acuerdo con su Política de Tratamiento de Datos Personales para los fines relacionados con su objeto social y en especial para fines legales, contractuales, misionales descritos en la Política de Tratamiento de Datos Personales de ${this.auth["user"].entities[0].name.trim()}. La información obtenida para el Tratamiento de mis datos personales la he suministrado de forma voluntaria y es verídica.`;
  medioNorificacion: any[] = [];

  camposPqr = [
    {
      name: "id_pasajero",
      defaultValue: "",
      errorMsg: "Campo no válido, por favor complete.",
      label: "ID usuario",
      validations: [],
      tipo: "number", 
    },
    {
      name: "cod_empr",
      defaultValue: "",
      errorMsg: "Campo no válido, por favor complete.",
      label: "",
      validations: [Validators.required, Validators.minLength(1)],
      tipo: "hidden", 
    },
    {
      name: "cod_tpqr",
      defaultValue: "",
      errorMsg: "Campo no válido, por favor complete.",
      label: "Tipo de solicitud",
      validations: [Validators.required, ],
      tipo: "select", 
    },
    {
      name: "cod_mpqr",
      defaultValue: "",
      errorMsg: "Campo no válido, por favor complete.",
      label: "Motivo de solicitud",
      validations: [Validators.required, ],
      tipo: "select", 
    },
    {
      name: "nro_docu",
      defaultValue: "",
      errorMsg: "Campo no válido, por favor complete.",
      label: "Número de documento",
      validations: [Validators.required, Validators.minLength(4)],
      tipo: "number", 
    },
    {
      name: "tipo_docu",
      defaultValue: "",
      errorMsg: "Campo no válido, por favor complete.",
      label: "Tipo de documento",
      validations: [Validators.required, ],
      tipo: "select", 
    },
    {
      name: "cod_mrec",
      defaultValue: "",
      errorMsg: "Campo no válido, por favor complete.",
      label: "Medio de recepción",
      validations: [Validators.required, ],
      tipo: "select", 
    },
    {
      name: "cod_usua_regi",
      defaultValue: this.auth["user"].id,
      label: "Usuario que registra",
      validations: [Validators.required, ],
      tipo: "number", 
    },
    {
      name: "fec_soli",
      defaultValue: this.today,
      label: "Fecha de solicitud",
      validations: [Validators.required, ],
      tipo: "date", 
    },
    {
      name: "nom_solicitante",
      defaultValue: "",
      errorMsg: "Campo no válido, por favor complete.",
      label: "Nombre del solicitante",
      validations: [Validators.required, Validators.min(1)],
      tipo: "text", 
    },
    {
      name: "dir_solicitante",
      defaultValue: "",
      errorMsg: "Campo no válido, por favor complete.",
      label: "Dirección",
      validations: [Validators.required, Validators.min(1)],
      tipo: "text", 
    },
    {
      name: "descripcion",
      defaultValue: "",
      errorMsg: "Campo no válido, por favor complete.",
      label: "Descripción de solicitud",
      validations: [Validators.required, Validators.minLength(20)],
      tipo: "text", 
    },
    {
      name: "mail",
      defaultValue: "",
      errorMsg: "Campo no válido, por favor complete.",
      label: "Correo electrónico",
      validations: [Validators.required, Validators.min(1)],
      tipo: "email", 
    },
    {
      name: "nro_celular",
      defaultValue: "",
      errorMsg: "Campo no válido, por favor complete.",
      label: "Celular",
      validations: [Validators.required, Validators.min(1)],
      tipo: "number", 
    },
    {
      name: "med_noti",
      defaultValue: "4",
      errorMsg: "Campo no válido, por favor complete.",
      label: "Medio de notificación",
      validations: [Validators.required, ],
      tipo: "select", 
    },
    {
      name: "cod_gc_pqr",
      defaultValue: "",
      errorMsg: "Campo no válido, por favor complete.",
      label: "Grupo causal",
      validations: [Validators.required, ],
      tipo: "select", 
    },
    // {
    //   name: "politicaEmpresa",
    //   defaultValue: null,
    //   errorMsg: "Para continuar, por favor acepte las condiciones.",
    //   label: this.politicaEmpresa,
    //   validations: [Validators.requiredTrue, ],
    //   tipo: "checkbox", 
    // },
  ];

  camposPasajero = [
    {
      name: "doc_pasajero",
      defaultValue: "",
      errorMsg: "Campo no válido, por favor complete.",
      label: "Número de documento",
      validations: [Validators.required, Validators.minLength(2), Validators.pattern("^[0-9]*$")],
      tipo: "number", 
    },
  ];

  codPqr = "";

  files!:File;
  
  asuntoCorreo = "¡Gracias por contactarnos! Tu solicitud ha sido registrada.";
  mensajeCorreo = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Gracias por contactarnos</title>
  </head>
  <body>
    <p>Hola [variable_nombre],</p>
    <br>
    <p>Hemos registrado correctamente tu solicitud No. [variable_cod_pqr].</p>
    
    <p>Agradecemos tu comunicación. Queremos que sepas que estamos comprometidos en atender tu solicitud de manera diligente y dentro de los plazos establecidos por la empresa y las normativas vigentes. ¡Estamos aquí para ayudarte!</p>
    
    <p>Atentamente,<br>
    [variable_empresa]</p>
  </body>
  </html>
  `;


  // formulario general
  formPqr =       new FormGroup({});
  formPasajero =  new FormGroup({});

  setCheckboxValue(evento) {
    this.checkboxValue = evento.target.checked;
  }

  // construccion del reactive form
  buildFormPqr() {
    const formControls = {};
    this.camposPqr.forEach( (campo) => {
      formControls[campo.name] = this.formBuilder.control(campo.defaultValue, campo.validations);
    });
    this.formPqr = this.formBuilder.group(formControls);
  }

  buildFormPasajero() {
    const formControls = {};
    this.camposPasajero.forEach( (campo) => {
      formControls[campo.name] = this.formBuilder.control(campo.defaultValue, campo.validations);
    });
    this.formPasajero = this.formBuilder.group(formControls);
  }


  // variables inicializadas
  companies = [];

  // variables para las opciones de los select
  checkboxValue:boolean = true;
  optionsTipoDoc:any;
  optionsTipoPqr:any;
  optionsMotivoPqr:any;
  optionsGrupoCausal:any;
  optionsMedioRecepcion:any;
  pasajeroInfo:any;
  pasajeros:any;
  modalVisibleBuscarPasajero = false;
  modalVisiblePasajero = false;
  errorTip = "Ingrese un número de documento válido.";
  modalTablaPasajeroStyle = {width: "100%", height: "100%"};

  get id_pasajero():string {
    return this.formPqr.value["id_pasajero"];
  }
  
  get today():string {
    return new Date().toISOString().slice(0,10);
  }


  // funciones para obtener los valores de atributos del array de formControls
  textoPqr(name:string): string {
    return this.camposPqr.find( campo => campo.name === name)!.label.trim();
  }
  tipoPqr(name:string): string {
    return this.camposPqr.find( campo => campo.name === name)!.tipo.trim();
  }

  errorMessage(name:string) {
    return this.camposPqr.find( campo => campo.name === name)!.errorMsg?.trim();
  }

  // funcion del modal para buscar el pasajero
  setModalVisible(evento:Event) {
    evento.preventDefault();
    this.modalVisibleBuscarPasajero = !this.modalVisibleBuscarPasajero;
  }


  // Elementos HTML a mostrar u ocultar
  @ViewChild("messageNoCompany") messageNoCompany:ElementRef =  this.elementRef.nativeElement.querySelector("#messageNoCompany");
  @ViewChild("formVisible") formVisible:ElementRef =            this.elementRef.nativeElement.querySelector("#formVisible");
  @ViewChild("selectEmpresas") selectEmpresas:ElementRef =      this.elementRef.nativeElement.querySelector("#selectEmpresas");
  @ViewChild("select_cod_mpqr") select_cod_mpqr:ElementRef =    this.elementRef.nativeElement.querySelector("#select_cod_mpqr");


  constructor(
    private formBuilder:FormBuilder,
    private router: Router,
    private elementRef:ElementRef,
    private pqrService:PqrServiceService,
    private _api: AuthServiceService,
    private utilsService:UtilsService,
    ) { }

  // al crear el componente
  ngOnInit():void {
    this.buildFormPqr();
    this.buildFormPasajero();
    this.getOptionsTipoDocumento();
    this.getOptionsTipoPqr();
    this.getOptionsMotivoPqr();
    this.getOptionsMedioRecepcionPqr();
    this.getOptionsGrupoCausalPqr();
    this.getMedioNotificacion();
    this.getAllCompanies();
  }
  
  // al terminar de renderizar el componente
  ngAfterViewInit(): void {
    this.hideElements(); // apariencia por defecto del componente
  }

  hideElements() {
    this.formVisible.nativeElement.hidden = true;
    this.messageNoCompany.nativeElement.hidden = false;
  }

  mapFormRequest() {
    const idPasajero = isNaN(parseInt(this.formPqr.value["id_pasajero"])) || parseInt(this.formPqr.value["id_pasajero"]) === 0 ? null : parseInt(this.formPqr.value["id_pasajero"]);
    const requestBody = {
      "idPasajero":     idPasajero,
      "codTpqr":        parseInt(this.formPqr.value["cod_tpqr"]),
      "codEmpr":        this.formPqr.value["cod_empr"],
      "codMpqr":        parseInt(this.formPqr.value["cod_mpqr"]),
      "nroDocu":        this.formPqr.value["nro_docu"],
      "tipoDocu":       this.formPqr.value["tipo_docu"],
      "codMrec":        this.formPqr.value["cod_mrec"],
      "codUsuaRegi":    this.formPqr.value["cod_usua_regi"],
      "fecSoli":        this.formPqr.value["fec_soli"],
      "nomSolicitante": this.formPqr.value["nom_solicitante"],
      "dirSolicitante": this.formPqr.value["dir_solicitante"],
      "telSolicitante": this.formPqr.value["nro_celular"],
      "descripcion":    this.formPqr.value["descripcion"],
      "mail":           this.formPqr.value["mail"],
      "nroCelular":     this.formPqr.value["nro_celular"],
      "codGcPqr":       this.formPqr.value["cod_gc_pqr"],
      "codBarrio":      "null",
      "idEntidad":      `${this.auth["user"].entities[0].id}`
    };
    return requestBody;
  }

  controlValidPqr(controlName:string) {
    return this.formPqr.controls[controlName].status == 'INVALID' && this.formPqr.controls[controlName].touched;
  }
  controlValidPasajero(controlName:string) {
    return this.formPasajero.controls[controlName].status == 'INVALID' && this.formPasajero.controls[controlName].touched;
  }

  // funciones de los botones del fomrulario
  async enviar(evento:Event) {
    evento.preventDefault();
    let isValidForm = this.formPqr.valid;

    if (!isValidForm || !this.checkboxValue) {
      this.utilsService.openErrorAlert("Debe completar todos los campos del formulario.")
      .then(() => this.formPqr.markAllAsTouched());
    }
    else {
      let requestBody = this.mapFormRequest();
      let response = await this.pqrService.createPQR(requestBody);
      
      if (response.status == "success") {
        await this.utilsService.openSuccessAlert(`PQR No. ${response.data.Pqr.id} registrada exitosamente.`);
        this.codPqr = response.data.Pqr.id;
        this.sendArchivoAdjunto();
        this.enviarEmail();
        this.reset(null);
      }
      else {
        this.utilsService.openErrorAlert("PQR no registrada.");
      }
    }
  }

  async enviarEmail() {
    const asunto =  this.asuntoCorreo;
    const correo =  this.formPqr.controls["mail"].value;
    const mensaje = this.replaceVariables(this.mensajeCorreo);

    const response = await this.pqrService.enviarEmail(correo, asunto, mensaje);

    (response.status === "success" && response.data?.pqr) ? 
      null : 
      this.utilsService.openErrorAlert("No se ha podido enviar el mensaje de registro al usuario.");
  }

  replaceVariables(mensaje:string) {
    // se construye el array con las variables que existen en las plantllas y su respecivo reemplazo
    const variables_reemplazos = [
      { name: "\\[variable_cod_pqr\\]",           reemplazo: this.codPqr, },
      { name: "\\[variable_nombre\\]",            reemplazo: this.formPqr.controls["nom_solicitante"].value.trim(), },
      { name: "\\[variable_respuesta_pqr\\]",     reemplazo: "", },
      { name: "\\[variable_empresa\\]",           reemplazo: this.auth["user"].entities[0].name, },
      { name: "\\[variable_nombre_responsable\\]",reemplazo: "", },
      { name: "\\[variable_usuario_actual\\]",    reemplazo: "", },
    ]
    let mensajeReemplazado = mensaje;
    for (let variable of variables_reemplazos) {
      mensajeReemplazado = mensajeReemplazado.replace(new RegExp(variable.name, "g"), variable.reemplazo);
    }
    return mensajeReemplazado;
  }

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

      const nowId = new Date().getTime();
      const fileName = nowId.toString() + '-' + this.files.name;

      const urlParams = new URLSearchParams({
        codePqr:    this.codPqr,
        codEmpr:    `${this.selectedCompany}`,
        usuarioBd:  `${this.auth["user"].username}`,
        idEntidad:  `${this.auth["user"].entities[0].id}`,
        filename:   fileName,
      });

      const formData:FormData = new FormData();
      formData.append("filename", this.files, fileName);
  
      // llamado al servicio
      this.pqrService.subirArchivoPqr(urlParams.toString(), formData).then( response => {
        (response.status === "success" && response.data?.pqr.fileKey) ? 
          null : 
          this.utilsService.openErrorAlert("No se ha podido cargar el archivo adjunto.");
      });
    }
  }

  // reset del formulario de registro de pqr
  reset(evento:Event | null): void {
    if (evento) evento.preventDefault();
    this.formPqr.reset();
    // se asigna el valor de la empresa escogida para el hidden codEmpr
    this.formPqr.get("cod_empr")!.setValue(this.selectedCompany);
    this.formPqr.get("cod_usua_regi")!.setValue(this.auth["user"].id);
  }

  // funcion para validar que el motivo de la pqr esté relacionado con el tipo de pqr
  validateCodTpqr() {
    let cod_tpqr = this.formPqr.get("cod_tpqr")?.value;
    let select_cod_mpqr = this.select_cod_mpqr.nativeElement;
    let cod_tpqr_mpqr = select_cod_mpqr[select_cod_mpqr.selectedIndex].dataset["codTpqr"];

    if (cod_tpqr_mpqr != cod_tpqr) {
      this.utilsService.openInfoAlert("El motivo escogido no corresponde al tipo de solicitud seleccionado.")
      .then( response => {
        this.formPqr.get("cod_mpqr")!.setValue("")
      });
    }
  }

  // cuando se escoge un pasajero para registrar la pqr a su nombre
  choosePassenger(pasajero:any) {
    this.modalVisiblePasajero = !this.modalVisiblePasajero;
    this.formPqr.get("id_pasajero")?.setValue(pasajero.id);
    this.formPqr.get("nom_solicitante")?.setValue((pasajero.firstName || '') + " " + (pasajero.secondName || '') + " " + (pasajero.lastName || '') + " " + (pasajero.secondLastName || ''));
    this.formPqr.get("nro_docu")?.setValue(pasajero.identification);
    this.formPqr.get("tipo_docu")?.setValue(pasajero.identificationTypeId);
    this.formPqr.get("nro_celular")?.setValue(pasajero.cellPhone);
    this.formPqr.get("mail")?.setValue(pasajero.email);
    this.formPqr.get("dir_solicitante")?.setValue(pasajero.address);
  }

  // funciones para obtener las opciones de los select
  async getMedioNotificacion() {
    this.medioNorificacion = await this._api.getLista("MEDIO_NOTIFICACION");
  }
  async getOptionsTipoDocumento() {
    this.optionsTipoDoc = await this.pqrService.getTipoDocumento();
  }
  async getOptionsTipoPqr() {
    this.optionsTipoPqr = await this.pqrService.getTipoPqr();
  }
  async getOptionsMotivoPqr() {
    this.optionsMotivoPqr = await this.pqrService.getMotivoPqr();
  }
  async getOptionsMedioRecepcionPqr() {
    this.optionsMedioRecepcion = await this.pqrService.getMedioRecepcionPqr();
  }
  async getOptionsGrupoCausalPqr() {
    this.optionsGrupoCausal = await this.pqrService.getGrupoCausalPqr();
  }

  // buscar id de pasajero por documento
  async getPassengerByDoc() {
    let isValidForm = this.formPasajero.valid;
    if (!isValidForm) {
      this.utilsService.openErrorAlert("Debe completar todos los campos del formulario.")
      .then(() => this.formPasajero.markAllAsTouched());
    }
    else {
      this.pasajeroInfo =  await this.pqrService.getPassengerByDoc(this.formPasajero.value["doc_pasajero"]);
      if (this.pasajeroInfo.status == "success") {
        this.modalVisiblePasajero = !this.modalVisiblePasajero;
      }
      else {
        this.utilsService.openErrorAlert(this.pasajeroInfo.message);
        this.redirectTo("login");
      }
      this.modalVisibleBuscarPasajero = !this.modalVisibleBuscarPasajero;
    }
  }

  // lo que hay en localStorage
  get auth():JSON {
    return JSON.parse(localStorage.getItem('auth')!);
  } 

  get selectedCompany():JSON {
    return JSON.parse(localStorage.getItem('selectedCompany')!);
  } 


  // obtener las compañías del usuario para cargar el select de compañias
  loadCompanies() {
    const companies = JSON.parse(localStorage.getItem('selectedEntity')!).companies;
    this.companies = companies;
  }

  getAllCompanies() {
    const urlParams = new URLSearchParams({
      "active": "true",
      "type-id": "",
    });

    this.pqrService.getAllCompanies(urlParams.toString()).then( response => {
      if ( response.status === "success") {
        if ( response.data.companies.length > 0 ) {
          this.companies = response.data.companies;
        }
        else {
          this.utilsService.openErrorAlert("No se encontraron empresas activas.");
        }
      }
      else {
        this.utilsService.openErrorAlert("No se pudo consultar la lista de empresas.");
      }
    });
  }

  setSelectedCompany(companyId:Event):void {
    // companyId es el valor elegido del select
    localStorage.setItem('selectedCompany', JSON.stringify(companyId));

    // para mostrar o no mostrar el formulario
    let validacion = typeof companyId == "number"
    if (validacion) {
      this.formVisible.nativeElement.hidden = !validacion;
      this.messageNoCompany.nativeElement.hidden = validacion;
    }
    else {
      this.formVisible.nativeElement.hidden = !validacion;
      this.messageNoCompany.nativeElement.hidden = validacion;
    }

    // se asigna el valor de la empresa escogida para el hidden codEmpr
    this.formPqr.get("cod_empr")!.setValue(companyId);
    this.formPqr.get("cod_usua_regi")!.setValue(this.auth["user"].id);
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl(`/`, { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

}
