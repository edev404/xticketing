import { Component, OnInit } from '@angular/core';
import { MonitoreoService } from './services/monitoreo.service';
import { UtilsService } from '../../../myUtils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.scss', '../../../../assets/themes/white/core/_formulario.scss']
})
export class MonitoreoComponents implements OnInit {
  listOfData: any[] = [];
  listOfDataCopy: any[] = [];
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);


  mostrarData: boolean = false;
  filterValueTable: string = ''
  private intervalId: any; // Variable para almacenar el ID del intervalo

  id: number = 0;

  fechas: any = [];
  fecha: any;
  fechaVig: any;


  page: number = 1;
  numberRow: number = 5;

  checked: boolean = false;
  todosLeidos: boolean = false;

  constructor(private _monitoreoService: MonitoreoService, private _utilsService: UtilsService) {
    // Constructor del componente.
    // Recibe dos servicios como parámetros: _monitoreoService y _utilsService.
    // Estos servicios se inyectan en el componente para su uso posterior.
  }
  

  ngOnInit(): void {
    // Este método se llama cuando el componente se inicializa.
    // Inicializa la repetición de la petición.
    this.repetirPeticion();
  }

  ngOnDestroy() {
    // Este método se llama antes de que el componente sea destruido.
    // Detiene el intervalo si está en ejecución.
    this.detenerIntervalo();
  }

  detenerIntervalo() {
    // Detiene el intervalo si existe.
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
  }

  repetirPeticion() {
    // Este método se encarga de cargar listas y repetir la petición a intervalos regulares.

    // Inicialmente, carga las listas y pasa 'true' como parámetro.
    this.cargarListas(true);

    // Configura un intervalo de tiempo para repetir la carga de listas cada 10 segundos (10000 milisegundos).
    this.intervalId = setInterval(() => {
      this.cargarListas(true);
    }, 10000);
  };

  getSelectedEntity(): void {
    // Este método se utiliza para obtener la entidad seleccionada almacenada en el almacenamiento local (localStorage).

    // Parsea la entidad almacenada como JSON desde el localStorage.
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));

    if (entity) {
      // Si se encuentra una entidad seleccionada, asigna su ID a 'this.id'.
      this.id = entity.userId;
    }
  }


  search() {
    let data: any[];

    // Verifica si el valor del filtro (this.filterValueTable) existe o si existe y no está vacío.
    if (this.filterValueTable || (this.filterValueTable && this.filterValueTable.trim() != '')) {
      // Si el filtro tiene valor, realiza una filtración de datos.

      // Filtra la copia original de los datos (listOfDataCopy) utilizando la función filter().
      data = this.listOfDataCopy.filter(
        (current: any) => {
          // La función de filtrado compara cada propiedad del objeto 'current' con el filtro (this.filterValueTable) después de convertir ambas a mayúsculas.

          // Se verifica si las propiedades 'aplicacion', 'tipo', 'identificador', 'fechaGen' o 'estado' existen y si su valor incluye el filtro proporcionado.
          return (
            this._utilsService.validateObject(current.aplicacion) && current.aplicacion!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
            // this._utilsService.validateObject(current.tipo) && current.tipo.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            // this._utilsService.validateObject(current.identificador) && current.identificador.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            // this._utilsService.validateObject(current.fechaGen) && current.fechaGen.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            // this._utilsService.validateObject(current.estado) && current.estado.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
          );
        }
      );

      // Si se encontraron datos filtrados, actualiza 'listOfData' con los datos filtrados.
      if (data) {
        this.listOfData = data;
      }
    } else {
      // Si el filtro está vacío o no existe, restaura 'listOfData' a su estado original (listOfDataCopy).
      if (this.listOfDataCopy) {
        this.listOfData = this.listOfDataCopy;
        this.filterValueTable = '';
      }
    }
  }


  // Método para manejar un cambio en la cantidad de filas por página en una tabla o lista paginada.
  onChangeRowPerPage(event: number): void {
    this.numberRow = event; // Actualiza la cantidad de filas por página.
    this.page = 1; // Vuelve a la primera página.
  }

  // Método para manejar un cambio en la página actual en una lista paginada.
  onChangePage(event: number): void {
    this.page = event; // Actualiza la página actual.
  }

  // Función para deshabilitar fechas que son posteriores a la fecha actual.
  disabledDate = (current: Date): boolean => {
    const today = new Date(); // Obtiene la fecha actual.
    return current > today; // Devuelve true si la fecha actual es posterior a la fecha proporcionada (current), lo que deshabilita la fecha.
  };


  cambioEnElSelectFecha(event) {
    // Este método se llama cuando hay un cambio en la opción seleccionada en el select de fecha.

    // Restaura la lista de alertas a su estado original (listOfDataCopy).
    this.listOfData = this.listOfDataCopy;

    if (event) {
      // Si se selecciona una fecha en el evento, filtra la lista de alertas para mostrar solo las alertas con esa fecha.
      this.listOfData = this.listOfData.filter(element => this._utilsService.formatDate(element.fechaGen) == this._utilsService.formatDate(event));

      // Filtra las alertas no leídas y actualiza las variables 'checked' y 'todosLeidos'.
      const todosLeidosLis: number[] = this.listOfData.filter((element) => element.estado == 'No leído');
      this.checked = todosLeidosLis.length > 0 ? false : true;
      this.todosLeidos = todosLeidosLis.length > 0 ? false : true;
      return;
    }

    // Si no se selecciona una fecha en el evento, filtra la lista de alertas para mostrar solo las alertas con la fecha actual (this.fecha).
    this.listOfData = this.listOfData.filter(element => this._utilsService.formatDate(element.fechaGen) == this._utilsService.formatDate(this.fecha));

    // Filtra las alertas no leídas y actualiza las variables 'checked' y 'todosLeidos'.
    const todosLeidosLis: number[] = this.listOfData.filter((element) => element.estado == 'No leído');
    this.checked = todosLeidosLis.length > 0 ? false : true;
    this.todosLeidos = todosLeidosLis.length > 0 ? false : true;
  }


  actualizarEstadoAlerta(event, estado) {
    // Este método se utiliza para actualizar el estado de una alerta.

    if (estado == 'Leído') {
      // Si el estado de la alerta es 'Leído', muestra una alerta de error y no realiza ninguna acción adicional.
      this._utilsService.openErrorAlert("No es posible cambiar el estado de la alerta, ya fue leída.");
    } else {
      // Si el estado de la alerta no es 'Leído', continúa con la actualización del estado.

      // Llama al método getSelectedEntity() para obtener la entidad seleccionada.
      this.getSelectedEntity();

      // Llama al servicio _monitoreoService para actualizar el estado de la alerta utilizando el identificador 'event' y 'this.id'.
      this._monitoreoService.updateAlertas(event, this.id)
        .subscribe(
          {
            next: () => {
              // Cuando la solicitud se completa con éxito, se ejecuta esta función 'next'.

              // Abre una alerta de éxito usando el servicio _utilsService.
              this._utilsService.openSuccessAlert("Estado de alerta modificado correctamente.");

              // Llama al método cargarListas(false) para cargar las listas de alertas nuevamente sin pasar el parámetro 'pasar'.
              this.cargarListas(false);
            },
            error: () => {
              // En caso de error en la solicitud, muestra una alerta de error usando el servicio _utilsService.
              this._utilsService.openErrorAlert("No fue posible cambiar el estado de la alerta.");
            }
          }
        );
    }
  }


  leerTodasLasAlertas() {
    // Este método se encarga de marcar todas las alertas como leídas automáticamente.

    // Se crea un array 'jData' para almacenar los identificadores (IDs) de las alertas a marcar como leídas.
    const jData: number[] = [];

    // Se recorre listOfDataCopy y se verifica si la fecha de generación de cada alerta coincide con la fecha actual (this.fecha o this.fechaVig, según corresponda).
    // Si coincide, se agrega el ID de la alerta al array 'jData'.
    this.listOfDataCopy.forEach((element) => {
      if (this._utilsService.formatDate(element.fechaGen) == (this.fechaVig ? this._utilsService.formatDate(this.fechaVig) : this._utilsService.formatDate(this.fecha))) {
        jData.push(element.id);
      }
    });

    // Llama al método getSelectedEntity() para obtener la entidad seleccionada.
    this.getSelectedEntity();

    // Llama al servicio _monitoreoService para actualizar masivamente las alertas marcándolas como leídas.
    this._monitoreoService.updateAlertasMassive(JSON.stringify(jData), this.id)
      .subscribe(
        {
          next: () => {
            // Cuando la solicitud se completa con éxito, se ejecuta esta función 'next'.

            // Abre una alerta de éxito usando el servicio _utilsService.
            this._utilsService.openSuccessAlert("Estado de alerta modificado masivamente correctamente.");

            // Llama al método cargarListas(false) para cargar las listas de alertas nuevamente sin pasar el parámetro 'pasar'.
            this.cargarListas(false);
          },
          error: () => {
            // En caso de error en la solicitud, muestra una alerta de error usando el servicio _utilsService.
            this._utilsService.openErrorAlert("No fue posible cambiar el estado de la alerta.");
          }
        }
      );
  }


  async changeStateModal() {
    // Este método se encarga de mostrar un modal de confirmación utilizando la librería Swal (SweetAlert2).

    // Se utiliza el método getQuestionModalOptions del servicio _utilsService para obtener las opciones del modal de pregunta.
    Swal.fire(this._utilsService.getQuestionModalOptions(
      '¿Está seguro de que desea cambiar el estado de las alertas?',
      'Esta acción marcará todas las alertas como leídas automáticamente'
    )).then(async (result) => {
      // Después de que el usuario interactúa con el modal de confirmación, se ejecuta esta función callback.

      if (result.isConfirmed) {
        // Si el usuario confirmó la acción en el modal,
        // se llama a la función leerTodasLasAlertas de forma asíncrona.
        await this.leerTodasLasAlertas();
      }
    });
  }


  cargarListas(pasar?: boolean) {
    // Este método se encarga de cargar listas de alertas. Puede recibir un parámetro opcional 'pasar'.
    // Si la fecha de vigencia (this.fechaVig) existe y 'pasar' es verdadero, o si filterValueTable tiene un valor, no hace nada y sale del método.
    if ((this.fechaVig && pasar) || this.filterValueTable) return;

    // Llama al servicio _monitoreoService para obtener la lista de alertas.
    this._monitoreoService.listAlertas()
      .subscribe(
        {
          next: (value: any) => {
            // Cuando se completa la solicitud exitosamente, se ejecuta esta función 'next'.

            // Asigna los datos de alertas obtenidos del servicio a listOfData.
            this.listOfData = value.data.alertas;

            // Determina si se debe mostrar la data en la interfaz comprobando si listOfDataCopy tiene elementos.
            this.mostrarData = this.listOfDataCopy.length > 0 ? true : false;

            // Ordena listOfData por el campo 'estado'.
            this.listOfData.sort((a: any, b: any) => a.estado - b.estado);

            // Actualiza listOfDataCopy con la lista actual de alertas.
            this.listOfDataCopy = this.listOfData;

            // Crea una lista de fechas formateadas y la asigna a la variable 'fechas'.
            this.listOfData.forEach(element => this.fechas.push(this._utilsService.formatDate(element.fechaGen)));

            // Asigna la primera fecha en 'fechas' a la variable 'fecha'.
            this.fecha = this.fechas[0];

            // Filtra listOfData para mostrar solo las alertas con la fecha coincidente con 'fecha'.
            this.listOfData = this.listOfData.filter(element => this._utilsService.formatDate(element.fechaGen) == this.fecha);

            // Filtra las alertas no leídas y actualiza las variables 'checked' y 'todosLeidos'.
            const todosLeidosLis: number[] = this.listOfData.filter((element) => element.estado == 'No leído');
            this.checked = todosLeidosLis.length > 0 ? false : true;
            this.todosLeidos = todosLeidosLis.length > 0 ? false : true;

            // Elimina duplicados de la lista 'fechas' y la ordena en orden descendente.
            this.fechas = Array.from(new Set(this.fechas)).sort((a: any, b: any) => {
              if (a > b) return -1;
              if (a < b) return 1;
              return 0;
            });
          },
          error: (err: any) => {
            // En caso de error en la solicitud, muestra el error en la consola.
            console.log(err);
          }
        }
      );
  }

}
