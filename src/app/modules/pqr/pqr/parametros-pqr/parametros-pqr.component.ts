import { Component, OnInit } from '@angular/core';
import { PqrServiceService } from '../../services/pqr-service.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { IReporte, IPQR, IAcciones, AccionesEstados, IEstados, IPerfilRelacion, IPerfilRelacionAccionesEstados, TipoPqr, MotivoPqr } from './models/reporte.interface';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-parametros-pqr',
  templateUrl: './parametros-pqr.component.html',
  styleUrls: ['./parametros-pqr.component.scss']
})
export class ParametrosPqrComponent implements OnInit {
  // VARIABLES MODAL
  estadosModel;
  accionesModel = 'sdsasadad';
  agregarModel;
  accion: number = 0;
  estado: number = 0;

  inputTipoPqr:TipoPqr = {
    id: 0,
    descripcion: "",
    plazo: 0,
    estado: "A",
  };

  inputMotivoPqr:MotivoPqr = {
    id: 0,
    descripcion: "",
    codTpqr: 0,
    estado: "A",
  };

  motivosPqr:MotivoPqr[] = [];
  motivosPqrReset:MotivoPqr[] = [];
  tiposPqr:TipoPqr[] = [];
  valorVacio = "ninguno";
  valorGuardarTipoPqr = "guardar";
  valorGuardarMotivoPqr = "guardar";
  opcionTipoPqr = this.valorGuardarTipoPqr;
  opcionMotivoPqr = this.valorGuardarMotivoPqr;

  usernameLogout: number = 0;
  entidadLogout: number = 0;

  estadosData: IPerfilRelacionAccionesEstados[];
  accionesData: IPerfilRelacionAccionesEstados[];
  objetoGuardado: IPerfilRelacionAccionesEstados[];

  idPerfil: number = 0;

  reportes: IReporte[];
  pqr: IPQR[];
  acciones: IAcciones[];
  accionesCopy: IAcciones[];
  accionesEstados: AccionesEstados[];
  accionesEstadosActivas: AccionesEstados[];
  inputEstado: IEstados = {};
  estados: IEstados[];
  estadosCopy: IEstados[];

  perfilRelacionado: IPerfilRelacion[];
  dataPerfilRelacionado: IPerfilRelacion | undefined;
  dataPerfilRelacionadoSinRel: IPerfilRelacion | undefined;

  itemSeleccionado!: IPQR;

  // PAGINATION
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  numberRow: number = 5;
  page: number = 1;

  accionesOEstados = 0;
  estadoPerfilRelacion: boolean = false;
  isVisible: boolean = false;

  // Mostrar data
  mostrarData: boolean = false;

  filterValueTable!: string;
  filterValueAcciones!: string;
  cards: string[] = ["", "", "", ""];


  constructor(
    private utils: UtilsService,
    private _pqrServiceService: PqrServiceService
  ) {
    this.reportes = [
      {
        id: 1,
        name: 'Perfiles',
        path: '',
        estado: true
      },
      {
        id: 2,
        name: 'Acciones',
        path: '',
        estado: false
      },
      {
        id: 3,
        name: 'Estados',
        path: '',
        estado: false
      },
      {
        id: 4,
        name: 'Acciones - Estados',
        path: '',
        estado: false
      },
      {
        id: 5,
        name: 'Tipo de pqr',
        path: '',
        estado: false
      },
      {
        id: 6,
        name: 'Motivo de pqr',
        path: '',
        estado: false
      },
      // {
      //   id: 6,
      //   name: 'Medio de recepción',
      //   path: '',
      //   estado: false
      // }
    ]
    this.pqr = [];
    this.estados = [];
    this.estadosCopy = [];
    this.acciones = [];
    this.accionesCopy = [];
    this.perfilRelacionado = [];
    this.dataPerfilRelacionado = {};
    this.dataPerfilRelacionadoSinRel = {};
    this.accionesEstados = [];
    this.accionesEstadosActivas = [];
    this.objetoGuardado = [];
    this.estadosData = [];
    this.accionesData = [];

  }

  /**
   * Valida la entrada basada en el evento y el número proporcionados.
   * @param event - El valor del evento a validar.
   * @param numero - El valor del número a validar.
   */
  validarInput(evento: any, numero: number): void {
    // Comprueba si la acción es 0 y el número es 1
    if (this.accion == 0 && numero == 1) {
      this.accion = evento; // Establece el valor de la acción al evento proporcionado
    }

    // Comprueba si el estado es 0 y el número es 2
    if (this.estado == 0 && numero == 2) {
      this.estado = evento; // Establece el valor del estado al evento proporcionado
    }

    // Comprueba si tanto la acción como el estado tienen valores distintos de cero
    if (this.accion > 0 && this.estado > 0) {
      this.agregarModel = false; // Desactiva la adición del modelo
      this.accionesEstadosActivas[this.accionesEstadosActivas.length - 1]['estado'] = true; // Establece la propiedad 'estado' en true para el último elemento del arreglo 'accionesEstadosActivas'
      this.accionesEstadosActivas[this.accionesEstadosActivas.length - 1]['idEstado'] = this.estado; // Establece la propiedad 'idEstado' al valor actual del estado para el último elemento del arreglo 'accionesEstadosActivas'
      this.accionesEstadosActivas[this.accionesEstadosActivas.length - 1]['idAccion'] = this.accion; // Establece la propiedad 'idAccion' al valor actual de la acción para el último elemento del arreglo 'accionesEstadosActivas'
      return; // Sale de la función
    }

    this.agregarModel = true; // Activa la adición del modelo
  }


  /**
   * Elimina una relación basada en el ID proporcionado.
   * @param id - El ID de la relación a eliminar.
   */
  eliminarRelacion(id: number): void {
    this.accionesEstadosActivas = this.accionesEstadosActivas.filter((element: AccionesEstados) => element.idEstado != id);
  }


  agregarElemento(event, item, tipo, tipoExist?): void {
    console.log(item)
    if (event.target.checked) {
      if (tipo == 'estado') {
        if (tipoExist == 1) {
          this.dataPerfilRelacionado!.estados?.forEach((element, j) => {
            if (element.nombre_estado == item.nombre_estado) {
              this.dataPerfilRelacionado!.estados![j].estado_relacionado = true;
            }
          })
        } else {
          this.dataPerfilRelacionadoSinRel!.estados!.forEach((element, j) => {
            if (element.nombre_estado == item.nombre_estado) {
              this.dataPerfilRelacionadoSinRel!.estados![j].estado_relacionado = true;
            }
          })
        }
      } else {
        if (tipoExist == 1) {
          this.dataPerfilRelacionado!.acciones?.forEach((element, j) => {
            if (element.nombre_accion == item.nombre_accion) {
              this.dataPerfilRelacionado!.acciones![j].estado_relacionado = true;
            }
          })
        } else {
          this.dataPerfilRelacionadoSinRel!.acciones!.forEach((element, j) => {
            if (element.nombre_accion == item.nombre_accion) {
              this.dataPerfilRelacionadoSinRel!.acciones![j].estado_relacionado = true;
            }
          })
        }
      }
    } else {
      if (tipo == 'estado') {
        if (tipoExist == 1) {
          this.dataPerfilRelacionado!.estados?.forEach((element, j) => {
            if (element.nombre_estado == item.nombre_estado) {
              this.dataPerfilRelacionado!.estados![j].estado_relacionado = false;
            }
          })
        } else {
          this.dataPerfilRelacionadoSinRel!.estados?.forEach((element, j) => {
            if (element.nombre_estado == item.nombre_estado) {
              this.dataPerfilRelacionadoSinRel!.estados![j].estado_relacionado = false;
            }
          })
        }
      } else {
        if (tipoExist == 1) {
          this.dataPerfilRelacionado!.acciones?.forEach((element, j) => {
            if (element.nombre_accion == item.nombre_accion) {
              this.dataPerfilRelacionado!.acciones![j].estado_relacionado = false;
            }
          })
        } else {
          this.dataPerfilRelacionadoSinRel!.acciones?.forEach((element, j) => {
            if (element.nombre_accion == item.nombre_accion) {
              this.dataPerfilRelacionadoSinRel!.acciones![j].estado_relacionado = false;
            }
          })
        }
      }
    }
  }

  /**
   * Agrega una nueva relación.
   */
  agregarNueva(): void {
    this.accion = 0; // Restablece el valor de la acción a 0
    this.estado = 0; // Restablece el valor del estado a 0
    this.actualizarAccionesEstados(); // Actualiza las acciones y estados existentes
    this.agregarModel = true; // Activa la adición del modelo
    this.accionesEstadosActivas.push(
      {
        "estado": false,
        "idAccion": 0,
        "codigo": '',
        "descripcion": '',
        "idEntidad": 0,
        "idEstado": 0,
        "fechaActualizacion": '',
        "programa": '',
        "nombre": '',
        "usuarioBd": ''
      }
    ); // Agrega un nuevo objeto de relación al arreglo 'accionesEstadosActivas'
  }


  getSelectedEntity() {
    this.usernameLogout = JSON.parse(localStorage.getItem('selectedEntity')!).username;
    this.entidadLogout = JSON.parse(localStorage.getItem('selectedEntity')!).entities[0].id;
    return JSON.parse(localStorage.getItem('selectedEntity')!).entities[0].id;
  }

  // paginado
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }
  onChangePage(event: number): void {
    this.page = event;
  }

  openEdit(event) {
    this.idPerfil = event.id;
    this.estadoPerfilRelacion = false;
    this.itemSeleccionado = event;
    this.isVisible = true;
    this.dataPerfilRelacionado = this.perfilRelacionado.find((element: IPerfilRelacion) => element.nombre == this.itemSeleccionado.nombre)
    if (this.dataPerfilRelacionado) {
      this.estadoPerfilRelacion = true;
    } else {
      this.dataPerfilRelacionadoSinRel = {
        "id": event.id,
        "codigo": event.codigo,
        "nombre": event.nombre,
        "acciones": this.accionesData,
        "estados": this.estadosData,
        "activa": true
      }
    }
    this.obtenerRelacionesPerfil();
  }

  async changeStateProfile(event) {
    // Tienes el objeto para activar o desactivar
    console.log(event)
  }

  recibirEmiter(event: number) {
    for (let index = 0; index < this.reportes.length; index++) {
      if (event != index) {
        this.reportes[index].estado = false;
      } else {
        this.reportes[event].estado = true
      }
    }
  }

  searchEstados() {
    let data: IEstados[];
    if (this.filterValueTable || (this.filterValueTable && this.filterValueTable.trim() != '')) {
      data = this.estadosCopy.filter(
        (current: IEstados) => {
          return this.utils.validateObject(current.id) && current.id!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            this.utils.validateObject(current.codEstado) && current.codEstado!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            this.utils.validateObject(current.nombre) && current.nombre!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            this.utils.validateObject(current.active) && current.active!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
        }
      );
      if (data) {
        this.estados = data;
      }
    } else {
      if (this.estadosCopy) {
        this.estados = this.estadosCopy;
        this.filterValueTable = ''
      }
    }
  }
  searchAcciones() {
    let data: IAcciones[];
    if (this.filterValueAcciones || (this.filterValueAcciones && this.filterValueAcciones.trim() != '')) {
      data = this.accionesCopy.filter(
        (current: IAcciones) => {
          return this.utils.validateObject(current.idEntidad) && current.idEntidad!.toString().toUpperCase().includes(this.filterValueAcciones!.toUpperCase()) ||
            this.utils.validateObject(current.codigo) && current.codigo!.toString().toUpperCase().includes(this.filterValueAcciones!.toUpperCase()) ||
            this.utils.validateObject(current.descripcion) && current.descripcion!.toString().toUpperCase().includes(this.filterValueAcciones!.toUpperCase()) ||
            this.utils.validateObject(current.estado) && current.estado!.toString().toUpperCase().includes(this.filterValueAcciones!.toUpperCase())
        }
      );
      if (data) {
        this.acciones = data;
      }
    } else {
      if (this.accionesCopy) {
        this.acciones = this.accionesCopy;
        this.filterValueAcciones = ''
      }
    }
  }

  async obtenerPerfiles() {
    const response = await this._pqrServiceService.listarPerfiles();
    if (response.status == "success") {
      this.pqr = response.data.pqr;
      // console.log(this.pqr)
      return;
    }
    this.pqr = [];
  }
  async obtenerEstados() {
    this.mostrarData = false;
    const response = await this._pqrServiceService.listarEstados();
    if (response.status == "success") {
      this.estados = response.data.pqr;
      for (let index = 0; index < this.estados.length; index++) {
        this.estadosData.push(
          {
            id_estado: this.estados[index].id,
            codigo_estado: this.estados[index].codEstado,
            nombre_estado: this.estados[index].nombre,
            estado_relacionado: false
          }
        )
      }
      // console.log(this.estados)
      this.estadosCopy = this.estados;
      this.mostrarData = this.estados.length > 0;
      return;
    }
    this.pqr = [];
  }
  async obtenerAcciones() {
    this.mostrarData = false;
    const response = await this._pqrServiceService.listarAcciones();
    if (response.status == "success") {
      this.acciones = response.data.pqr;
      for (let index = 0; index < this.acciones.length; index++) {
        this.accionesData.push(
          {
            id_accion: this.acciones[index].id,
            codigo_estado: this.acciones[index].codigo,
            nombre_accion: this.acciones[index].descripcion,
            estado_relacionado: false
          }
        )
      }
      // console.log(this.acciones)
      this.accionesCopy = this.acciones;
      this.mostrarData = this.acciones.length > 0;
      return;
    }
    this.acciones = [];
  }

  /**
   * Obtiene las relaciones de perfil.
   */
  async obtenerRelacionesPerfil(): Promise<void> {
    const response = await this._pqrServiceService.listarRelacionesPerfil(); // Llama al servicio para obtener las relaciones de perfil
    if (response.status == "success") {
      for (let index = 0; index < response.data.pqr.length; index++) {
        // Crea un objeto de tipo IPerfilRelacion con los datos obtenidos de la respuesta
        let json: IPerfilRelacion = {
          id: response.data.pqr[index].id,
          codigo: response.data.pqr[index].codigo,
          nombre: response.data.pqr[index].nombre,
          acciones: JSON.parse(response.data.pqr[index].acciones),
          estados: JSON.parse(response.data.pqr[index].estados),
          activa: response.data.pqr[index].activa
        };
        this.perfilRelacionado.push(json); // Agrega el objeto de relación al arreglo 'perfilRelacionado'
      }
      return; // Sale de la función
    }
  }


  actualizarAccionesEstados() {
    let idAcciones: Number[] = [];
    let idEstados: Number[] = [];
    this.accionesEstadosActivas.forEach((value: AccionesEstados) => {
      idAcciones.push(value.idAccion)
      idEstados.push(value.idEstado)
    })
    this.acciones = this.accionesCopy.filter((element: IAcciones) => idAcciones.includes(element.id!) != true)
    this.estados = this.estadosCopy.filter((element: IEstados) => idEstados.includes(element.id!) != true)
  }

  /**
   * Obtiene las acciones y estados disponibles.
   */
  async accionesEstado(): Promise<void> {
    const response = await this._pqrServiceService.listEstadosAcciones(this.getSelectedEntity()); // Llama al servicio para obtener las acciones y estados
    if (response.status == "success") {
      this.accionesEstados = response.data.pqr; // Almacena las acciones y estados obtenidos en 'accionesEstados'
      let listAcciones: number[] = []; // Arreglo para almacenar las IDs de las acciones seleccionadas
      let listEstados: number[] = []; // Arreglo para almacenar las IDs de los estados seleccionados

      this.accionesEstadosActivas = this.accionesEstados.filter((element: AccionesEstados) => element.estado); // Filtra las acciones y estados activos y los almacena en 'accionesEstadosActivas'
      this.accionesEstadosActivas.filter((element: AccionesEstados) => {
        if (element.idAccion != null && element.idEstado != null) {
          listAcciones.push(element.idAccion); // Agrega la ID de la acción a 'listAcciones'
          listEstados.push(element.idEstado); // Agrega la ID del estado a 'listEstados'
        }
      });

      this.estados.forEach((value: IEstados) => {
        if (listEstados.includes(value.id!)) {
          // El estado ya está en la lista
        } else {
          listEstados.push(value.id!); // Agrega la ID del estado a 'listEstados' si no está presente
        }
      });

      this.acciones.forEach((value: IAcciones) => {
        if (listAcciones.includes(value.id!)) {
          // La acción ya está en la lista
        } else {
          listAcciones.push(value.id!); // Agrega la ID de la acción a 'listAcciones' si no está presente
        }
      });
    }
  }


  async guardarRelacion() {
    const json = {
      "relaciones": this.accionesEstadosActivas,
      "programa": "normalizacion",
      "usuarioBd": "balvarez",
      "idEntidad": this.getSelectedEntity()
    }
    const response = await this._pqrServiceService.actualizarAccion(json);
    if (response.status == "success") {
      this.utils.openSuccessAlert("Acciones actualizadas")
      return;
    } else {
      console.log(this.accionesEstadosActivas)
      this.utils.openErrorAlert("Error al actualizar acciones")
    }
  }

  async actualizarAccionesPerfil() {
    const estados: number[] = [];
    const acciones: number[] = [];
    if (this.dataPerfilRelacionado) {
      this.dataPerfilRelacionado!.acciones!.forEach((element) => {
        if (element.estado_relacionado) acciones.push(element.id_accion!);
      })
      this.dataPerfilRelacionado!.estados!.forEach((element) => {
        if (element.estado_relacionado) estados.push(element.id_estado!);
      })
    } else {
      this.dataPerfilRelacionadoSinRel!.acciones!.forEach((element) => {
        if (element.estado_relacionado) acciones.push(element.id_accion!);
      })
      this.dataPerfilRelacionadoSinRel!.estados!.forEach((element) => {
        if (element.estado_relacionado) estados.push(element.id_estado!);
      })
    }
    const json = {
      "idPerfil": this.idPerfil,
      "idEntidad": this.entidadLogout,
      "idsAcciones": acciones,
      "idsEstados": estados,
      "usuarioBd": this.usernameLogout,
      "programa": "normalizacion"
    }
    const response = await this._pqrServiceService.actualizarPerfilesEstAcc(json);
    if (response.status == "success") {
      this.utils.openSuccessAlert("Perfiles actualizados correctamentes")
      this.dataPerfilRelacionado = {};
      this.dataPerfilRelacionadoSinRel = {};
      this.isVisible = false;
    } else {
      this.dataPerfilRelacionado = {};
      this.dataPerfilRelacionadoSinRel = {};
      this.isVisible = false;
      this.utils.openErrorAlert("Error al actualizar perfiles")
    }
  }

  getMotivosPqr() {
    this._pqrServiceService.getMotivoPqr().then( response => {
      if ( response.data?.motivos?.length > 0 ) {
        this.motivosPqr = response.data.motivos.sort( (a, b) => a.id - b.id );
        this.motivosPqrReset = this.motivosPqr;
      }
    });
  }

  
  getTiposPqr() {
    this._pqrServiceService.getTipoPqr().then( response => {
      if ( response.data?.tipos?.length > 0 ) {
        this.tiposPqr = response.data.tipos.sort( (a, b) => a.id - b.id );
      }
    });
  }

  getTipoPqrByCodTpqr(codTpqr) {
    if (this.tiposPqr.length > 0 ) {
      return this.tiposPqr.find( tipoPqr => tipoPqr.id === codTpqr )?.descripcion ?? "-N/A-";
    }
    return "-N/A-";
  }


  filtrarMotivosPorTipo(codTpqr) {
    this.motivosPqr = this.motivosPqrReset.filter( motivoPqr => motivoPqr.codTpqr === codTpqr);
    if (codTpqr === this.valorVacio) {
      this.motivosPqr = this.motivosPqrReset;
    }
  }


  guardarTipoPqr(data:TipoPqr) {
    if ( this.validateData(data) ) {
      this.inputTipoPqr = data;
      console.log(this.inputTipoPqr);

      if ( !data.id ) {
        this._pqrServiceService.crearTipoPqr(this.inputTipoPqr)
        .then( response => {
          if (response.status === "success") {
            this.utils.openSuccessAlert("Tipo creado exitosamente.");
            this.resetTipoPqr();
            this.getTiposPqr();
          }
          else {
            this.utils.openErrorAlert(response.message);
          }
        });
      }


      else {
        this._pqrServiceService.actualizarTipoPqr(this.inputTipoPqr)
        .then( response => {
          if (response.status === "success") {
            this.utils.openSuccessAlert("Tipo actualizado exitosamente.");
            this.resetTipoPqr();
            this.getTiposPqr();
          }
          else {
            this.utils.openErrorAlert(response.message);
          }
        });
      }
    }
  }

  guardarMotivoPqr(data:MotivoPqr) {
    if ( this.validateData(data) ) {
      this.inputMotivoPqr = data;

      if ( !data.id ) {
        this._pqrServiceService.crearMotivoPqr(this.inputMotivoPqr)
        .then( response => {
          if (response.status === "success") {
            this.utils.openSuccessAlert("Motivo creado exitosamente.");
            this.resetMotivoPqr();
            this.getMotivosPqr();
          }
          else {
            this.utils.openErrorAlert(response.message);
          }
        });
      }


      else {
        this._pqrServiceService.actualizarMotivoPqr(this.inputMotivoPqr)
        .then( response => {
          if (response.status === "success") {
            this.utils.openSuccessAlert("Motivo actualizado exitosamente.");
            this.resetMotivoPqr();
            this.getMotivosPqr();
          }
          else {
            this.utils.openErrorAlert(response.message);
          }
        });
      }
    }
  }


  guardarEstadoPqr(data:IEstados) {
    this.inputEstado = data;

    const urlParams = new URLSearchParams({
      idEstado: `${this.inputEstado.id}`,
      descripcion: `${this.inputEstado.descripcion}`,
    });

    if ( data.id ) {
      this._pqrServiceService.actualizarEstadoPqr(urlParams.toString())
      .then( response => {
        if (response.status === "success") {
          this.utils.openSuccessAlert("Estado actualizado exitosamente.");
          this.resetEstadoPqr();
        }
        else {
          this.utils.openErrorAlert(response.message);
        }
      });
    }
  }

  
  validateData(data:TipoPqr|MotivoPqr) {
    let dataValidaMessage = "";

    // validaciones dependiendo del tipo de pqr
    if ( "plazo" in data ) {
      if ( data.plazo <= 0 ) {
        dataValidaMessage = "El plazo no puede ser menor o igual a 0 días";
      }
      if ( !data.descripcion ) {
        dataValidaMessage = "La descripcion no puede estar vacía.";
      }
    }

    // validaciones dependiendo del motivo de pqr
    else if ( "codTpqr" in data ) {
      if ( !data.codTpqr ) {
        dataValidaMessage = "Debe relacionar el motivo con un tipo de pqr.";
      }
      if ( !data.descripcion ) {
        dataValidaMessage = "La descripcion no puede estar vacía.";
      }
    }

    else {
      dataValidaMessage = "El tipo de dato no corresponde a Tipo ni Motivo.";
    }

    if (dataValidaMessage !== "" ) {
      this.utils.openErrorAlert(dataValidaMessage);
      return false;
    }
    return true;
  }

  

  actualizarTipoPqr(tipoPqr:TipoPqr) {
    this.inputTipoPqr = tipoPqr;
  }
  
  
  actualizarMotivoPqr(motivoPqr:MotivoPqr) {
    this.inputMotivoPqr = motivoPqr;
  }

  actualizarEstadoPqr(estadoPqr:IEstados) {
    this.inputEstado = estadoPqr;
  } 



  eliminarTipoPqr(tipoPqr:TipoPqr) {
    this.utils.openInfoAlert("Confirma eliminar el tipo de pqr " + tipoPqr.descripcion)
    .then( response => {
      if (response.isConfirmed) {
        this._pqrServiceService.eliminarTipoPqr(tipoPqr.id)
        .then( response => {
          if (response.status === "success") {
            this.utils.openSuccessAlert("Tipo eliminado correctamente.");
            this.resetTipoPqr();
            this.getTiposPqr();
          }
          else {
            this.utils.openErrorAlert(response.message);
          }
        });
      }
    });
  }

  
  eliminarMotivoPqr(motivoPqr:MotivoPqr) {
    this.utils.openInfoAlert("Confirma eliminar el motivo de pqr " + motivoPqr.descripcion)
    .then( response => {
      if (response.isConfirmed) {
        this._pqrServiceService.eliminarMotivoPqr(motivoPqr.id)
        .then( response => {
          if (response.status === "success") {
            this.utils.openSuccessAlert("Motivo eliminado correctamente.");
            this.resetMotivoPqr();
            this.getMotivosPqr();
          }
          else {
            this.utils.openErrorAlert(response.message);
          }
        });
      }
    });
  }

  

  resetTipoPqr() {
    this.inputTipoPqr = {
      id: 0,
      descripcion: "",
      plazo: 0,
      estado: ''
    };
  }

  resetMotivoPqr() {
    this.inputMotivoPqr = {
      id: 0,
      descripcion: "",
      codTpqr: 0,
      estado: ''
    };
  }

  resetEstadoPqr() {
    this.inputEstado = {
      active: true,
      codEstado: "",
      fechaActual: new Date(),
      id: 0,
      idMaestro: 0,
      nombre: "",
      programa: "",
      descripcion: "",
      reqObservacion: "",
      falsereqValor: false,
    };
  }



  
  async ngOnInit() {
    this.getSelectedEntity();
    await this.obtenerPerfiles();
    await this.obtenerEstados();
    await this.obtenerAcciones();
    await this.obtenerRelacionesPerfil();
    await this.accionesEstado();
    this.getMotivosPqr();
    this.getTiposPqr();
  }


  get pestanaName() {
    return this.reportes.find( reporte => reporte.estado )?.name ?? "Parametros";
  }

}
