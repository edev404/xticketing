import { Component, OnInit } from '@angular/core';
import { Router, UrlSegment } from '@angular/router';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { PqrServiceService } from '../../services/pqr-service.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';

@Component({
  selector: 'app-ver-pqrs',
  templateUrl: './ver-pqrs.component.html',
  styleUrls: ['./ver-pqrs.component.scss']
})
export class VerPqrsComponent implements OnInit {

  constructor(
    private router: Router,
    private pqrService: PqrServiceService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private authService: AuthServiceService,
  ) { }

  // properties del componente
  modal: any;
  listaPqr: any;
  optionsTipoDoc: any;
  optionsTipoPqr: any;
  optionsMotivoPqr: any;
  optionsMedioRecepcion: any;
  optionsGrupoCausal: any;
  optionsEstadosPqr: any;
  modalVisibleResponder = false;
  accionesPqr: any;
  accionesPermitidasPqr: any;
  allAccionesPqr: any;

  filtro_listar_pqr = {
    pqr: 0,
    idinti: "",
    motivo: 0,
    tipo: 0,
    medio: 0,
    estado: 0,
    tfecha: 0,
    fecha_inicio: "",
    fecha_final: "",
    entidad: `${this.auth.user.entities[0].id}`,
  };
  titleModalId = "";

  // Paginado
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  page: number = 1;
  numberRow: number = 5;

  // Getters y setters
  get today(): string {
    return new Date().toISOString().substring(0, 10);
  }

  get auth() {
    return JSON.parse(localStorage.getItem('auth')!);
  }

  camposResponderPqr = [
    {
      name: "cod_pqr",
      defaultValue: "",
      errorMsg: "",
      label: "",
      validations: [Validators.required, Validators.minLength(4)],
      tipo: "hidden",
    },
    {
      name: "fecha_respuesta",
      defaultValue: this.today,
      errorMsg: "Fecha no válida, por favor verifique.",
      label: "Fecha de respuesta",
      validations: [Validators.required, Validators.pattern(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/)],
      tipo: "date",
    },
    {
      name: "descripcion_respuesta",
      defaultValue: "",
      errorMsg: "Respuesta no válida, por favor verifique.",
      label: "Descripción de la respuesta",
      validations: [Validators.required, Validators.minLength(10)],
      tipo: "text",
    },
  ];

  camposFiltro = [
    {
      name: "cod_pqr",
      defaultValue: "",
      errorMsg: "",
      label: "PQR No.",
      validations: [],
      tipo: "text",
    },
    {
      name: "documento",
      defaultValue: "",
      errorMsg: "",
      label: "No. de documento",
      validations: [],
      tipo: "text",
    },
    {
      name: "tipo",
      defaultValue: "",
      errorMsg: "",
      label: "Tipo",
      validations: [],
      tipo: "text",
    },
    {
      name: "motivo",
      defaultValue: "",
      errorMsg: "",
      label: "Motivo",
      validations: [],
      tipo: "text",
    },
    {
      name: "tipo_fecha",
      defaultValue: "0",
      errorMsg: "",
      label: "Tipo de fecha",
      validations: [],
      tipo: "text",
    },
    {
      name: "fecha_inicial",
      defaultValue: "",
      errorMsg: "",
      label: "Fecha inicial",
      validations: [Validators.pattern(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/)],
      tipo: "date",
    },
    {
      name: "fecha_final",
      defaultValue: "",
      errorMsg: "",
      label: "Fecha final",
      validations: [Validators.pattern(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/)],
      tipo: "date",
    },
    {
      name: "medio",
      defaultValue: "",
      errorMsg: "",
      label: "Medio de recepción",
      validations: [],
      tipo: "text",
    },
    {
      name: "estado",
      defaultValue: "",
      errorMsg: "",
      label: "Estado",
      validations: [],
      tipo: "text",
    },
  ];

  formResponder = new FormGroup({});
  formFiltro = new FormGroup({});

  // construccion del reactive form
  buildFormResponder() {
    const formControls = {};
    this.camposResponderPqr.forEach((campo) => {
      formControls[campo.name] = this.formBuilder.control(campo.defaultValue, campo.validations);
    });
    this.formResponder = this.formBuilder.group(formControls);
  }
  buildFormFiltro() {
    const formControls = {};
    this.camposFiltro.forEach((campo) => {
      formControls[campo.name] = this.formBuilder.control(campo.defaultValue, campo.validations);
    });
    this.formFiltro = this.formBuilder.group(formControls);
  }

  labelFormResponder(name: string): string {
    return this.camposResponderPqr.find(campo => campo.name === name)!.label.trim();
  }
  labelFormFiltro(name: string): string {
    return this.camposFiltro.find(campo => campo.name === name)!.label.trim();
  }
  tipoFormResponder(name: string): string {
    return this.camposResponderPqr.find(campo => campo.name === name)!.tipo.trim();
  }
  tipoFormFiltro(name: string): string {
    return this.camposFiltro.find(campo => campo.name === name)!.tipo.trim();
  }
  controlValidRespuesta(controlName: string) {
    return this.formResponder.controls[controlName].status == 'INVALID' && this.formResponder.controls[controlName].touched;
  }
  controlValidFiltro(controlName: string) {
    return this.formFiltro.controls[controlName].status == 'INVALID' && this.formResponder.controls[controlName].touched;
  }
  errorMessageResponder(name: string) {
    return this.camposResponderPqr.find(campo => campo.name === name)!.errorMsg?.trim();
  }
  errorMessageFiltro(name: string) {
    return this.camposResponderPqr.find(campo => campo.name === name)!.errorMsg?.trim();
  }

  createRequestBody(cod_pqr: string) {
    let body = {
      id: parseInt(cod_pqr),
      codPqrRes: "",
      idUsuarioResp: parseInt(this.auth.user.id),
      fecRes: this.formResponder.get("fecha_respuesta")?.value,
      descripSolu: this.formResponder.get("descripcion_respuesta")?.value,
    };
    return body;
  }

  // funcion principal, obtiene las pqr registradas en BD
  async listPQR(flag: string) {
    if (this.optionsEstadosPqr?.length > 0) {
      this.listaPqr = await this.pqrService.listPQR(this.objectToParams(flag));
    }
  }

  // Paginado met
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

  filtrarPqrs() {
    this.filtro_listar_pqr.pqr = (this.formFiltro.get("cod_pqr")?.value ?? "") == "" ? 0 : parseInt(this.formFiltro.get("cod_pqr")?.value);
    this.filtro_listar_pqr.idinti = (this.formFiltro.get("documento")?.value ?? "");
    this.filtro_listar_pqr.motivo = (this.formFiltro.get("motivo")?.value ?? "") == "" ? 0 : parseInt(this.formFiltro.get("motivo")?.value);
    this.filtro_listar_pqr.tipo = (this.formFiltro.get("tipo")?.value ?? "") == "" ? 0 : parseInt(this.formFiltro.get("tipo")?.value);
    this.filtro_listar_pqr.medio = (this.formFiltro.get("medio")?.value ?? "") == "" ? 0 : parseInt(this.formFiltro.get("medio")?.value);
    this.filtro_listar_pqr.estado = (this.formFiltro.get("estado")?.value ?? "") == "" ? 0 : parseInt(this.formFiltro.get("estado")?.value);
    this.filtro_listar_pqr.tfecha = (this.formFiltro.get("tipo_fecha")?.value ?? "") == "" ? 0 : parseInt(this.formFiltro.get("tipo_fecha")?.value);

    // validación para necesitar el rango de fechas cuando se escoge un tipo de fecha
    if (this.filtro_listar_pqr.tfecha != 0) {
      if (this.formFiltro.get("fecha_inicial")?.value == "" || this.formFiltro.get("fecha_final")?.value == "") {
        this.utilsService.openInfoAlert("Debe ingresar el rango de fechas.");
        return;
      }
      else {
        this.filtro_listar_pqr.fecha_inicio = this.formFiltro.get("fecha_inicial")?.value;
        this.filtro_listar_pqr.fecha_final = this.formFiltro.get("fecha_final")?.value;
      }
    }

    this.listPQR("filtro");
  }

  restablecerFiltro() {
    this.formFiltro.reset({
      cod_pqr: "",
      documento: "",
      tipo: "",
      motivo: "",
      tipo_fecha: 0,
      fecha_inicial: "",
      fecha_final: "",
      medio: "",
      estado: "",
    });
    this.filtrarPqrs();
  }

  objectToParams(flag: string): string {
    let urlSearchParams = new URLSearchParams();

    // si no es listar desde el filtro entonces se toman los estados que puede ver el perfil
    if (flag !== "filtro") {
      if (this.optionsEstadosPqr?.length > 0) {
        this.filtro_listar_pqr.estado = this.optionsEstadosPqr.map(estado => estado.idEstado).join("-");
      }
    }
    // se arma el urlSearchParams para mandarlo por GET
    for (let key in this.filtro_listar_pqr) {
      urlSearchParams.set(key, this.filtro_listar_pqr[key])
    }
    return urlSearchParams.toString();
  }


  // funcion para responder la pqr
  async modalResponder(cod_pqr: number) {
    this.modalVisibleResponder = !this.modalVisibleResponder;
    this.titleModalId = cod_pqr.toString();

    // llamada al servicio para guardar los datos en la pqr
    let request = await this.pqrService.getRespuestaPQR(cod_pqr.toString());
    if (request.data.pqr.fecRes) {
      this.formResponder.get("fecha_respuesta")?.setValue(request.data.pqr.fecRes);
      this.formResponder.get("descripcion_respuesta")?.setValue(request.data.pqr.descripSolu);
    }
  }

  async responderPqr(cod_pqr: string) {
    let body = this.createRequestBody(cod_pqr);
    // llamada al servicio para guardar los datos en la pqr
    let request = await this.pqrService.responderPQR(body);
    this.modalVisibleResponder = !this.modalVisibleResponder;
    if (request.status == "success") {
      this.utilsService.openSuccessAlert(request.message);
    }
    else {
      this.utilsService.openErrorAlert(request.message);
    }
  }

  // funciones para obtener las opciones de los select
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
  async getOptionsEstadosPqr() {
    let urlParams = new URLSearchParams({
      idEntidad: `${this.auth.user.entities[0].id}`,
      idPerfil: `${this.auth.user.profileId}`
    });
    let response = await this.pqrService.getEstadosPqrVisiblesFromPerfil(urlParams.toString());
    this.optionsEstadosPqr = response.data.pqr;
    this.listPQR("");
  }

  findEstadoName(idEstado: string) {
    return this.optionsEstadosPqr?.find(estado => estado.id === idEstado)?.nombreEstado ?? "Cargando...";
  }

  // configurar para obtener las acciones dependiendo del rol o perfil de usuario con los permisos
  async getAccionesFromPerfil() {
    let urlParams = new URLSearchParams({
      idEntidad: `${this.auth.user.entities[0].id}`,
      idPerfil: `${this.auth.user.profileId}`
    });
    this.pqrService.getAccionesFromPerfil(urlParams.toString()).then(response => {
      this.accionesPermitidasPqr = response.data.pqr;
    });
  }


  // se obtienen todas las acciones para pqr en sistema
  getAllAcciones() {
    this.pqrService.listarAcciones()
    .then( response => {
      if ( response.data?.pqr ) {
        this.allAccionesPqr = response.data.pqr.filter( accion => accion.idEntidad === this.auth.user.entities[0].id);
      }
    });
  }


  // la funcion trabaja asumiendo que las acciones sobre las pqr están ordenadas con el campo listasparametros.orden_posicion
  setAccionesFromEstadoPqr(pqr:any) {
    // se buscan todas las relaciones de acciones-estados disponibles para la entidad
    this.pqrService.listEstadosAcciones(this.auth.user.entities[0].id)
    .then( response => {
      if ( response.data?.pqr ) {
        // todas las acciones-estados
        const allAccionesEstados = response.data.pqr;

        // accion para partir el array ordenado de acciones existentes
        const accionRecienEjecutada = allAccionesEstados.find( accionEstado => accionEstado.idEstado.toString() === pqr.idEstado );

        // si no hay accionRecienEjecutada es porque es registrada, entocnes se permiten todas las acciones from perfil
        if ( !accionRecienEjecutada ) {
          this.accionesPqr = this.accionesPermitidasPqr;
        }
        else {
          const allAccionesOrdenadas = this.allAccionesPqr
                .sort( (accionAnterior, accionSiguiente) => accionAnterior.ordenPosicion - accionSiguiente.ordenPosicion );

          const ordenPosicionAccionRecienEjecutada = allAccionesOrdenadas
                .find( accionOrdenada => accionOrdenada.id === accionRecienEjecutada.idAccion )
                .ordenPosicion;

          const accionesOrdenadasSiguientes = allAccionesOrdenadas
                .filter( accionOrdenada => accionOrdenada.ordenPosicion > ordenPosicionAccionRecienEjecutada );
          
          this.accionesPqr = accionesOrdenadasSiguientes;
        }
      }
    });
  }


  dateDifference(initDateString: string, endDateString: string):number {
    const initDateTimestamp = new Date().getTime();
    const endDateTimestamp = new Date(endDateString).getTime();
    return Math.floor((endDateTimestamp - initDateTimestamp) / (1000 * 60 * 60 * 24));
  }



  // funcion para abrir un modal dependiendo de la accion escogida en el componente de acciones-pqr
  openModal(accion: any, pqr: any) {
    this.modal = { accion, pqr };
  }


  ngOnInit(): void {
    this.buildFormResponder();
    this.buildFormFiltro();
    this.getOptionsTipoPqr();
    this.getOptionsMotivoPqr();
    this.getOptionsMedioRecepcionPqr();
    this.getOptionsEstadosPqr();
    this.getAccionesFromPerfil();
    this.getAllAcciones();
  }


}
