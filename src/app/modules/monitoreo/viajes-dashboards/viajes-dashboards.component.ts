import { Component, OnInit, ViewChild } from '@angular/core';
import { ViajesDashboardsService } from './services/viajes-dashboards.service';
import { ChartOptions, Viajes } from './models/viajes.interface';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-viajes-dashboards',
  templateUrl: './viajes-dashboards.component.html',
  styleUrls: ['./viajes-dashboards.component.scss']
})
export class ViajesDashboardsComponent implements OnInit {

  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  listOfData: Viajes[] = [];
  listOfDataFilter: Viajes[] = [];
  listOfDataCopy: Viajes[] = [];

  tipoPago: string[] = []
  valoresTiposPagos: number[] = []
  medioPago: string[] = []
  valoresMediosPagos: number[] = []

  fechas: any[] = [];
  fechasCopy: any[] = [];
  fecha: any;
  fechaCopy: any;
  fechaCopyVig: any;

  empresas: any[] = [];
  empresasCopy: any[] = [];
  empresa: any;

  rutas: any[] = [];
  rutasCopy: any[] = [];
  ruta: any;

  deuda: number = 0;

  totalRecaudado: number = 0;
  totalRecaudadoCopy: number = 0;

  cantidadPasajeros: number = 0;
  cantidadPasajerosCopy: number = 0;

  page: number = 1;
  numberRow: number = 5;

  selectedViajeId: number = 0;

  private intervalId: any; // Variable para almacenar el ID del intervalo

  // Variable para contener los colores de la plataforma
  colores = {
    "1": "#F0FAF8",
    "2": "#B1E2D6",
    "3": "#7DD0BC",
    "4": "#44BDA1",
    "5": "#009F7C",
    "6": "#00926F",
    "7": "#008160",
    "8": "007152",
    "9": "#005536"
  }

  // Declaración de los ViewChild para los componentes de gráficos y sus opciones
  // ChartComponent y ChartOptions deben estar importados adecuadamente
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  @ViewChild("chart") chart2!: ChartComponent;
  public chartOptions2!: Partial<ChartOptions>;

  constructor(private _viajesDashboardsService: ViajesDashboardsService) {
    // Constructor del componente, se inyectan 1 servicio como dependencias
  }

  ngOnInit(): void {
    // Llama a repetirPeticion() cuando se inicializa el componente
    this.repetirPeticion();
  }

  // Función para repetir la petición y configurar el intervalo
  repetirPeticion() {
    this.cargasDataSashboards();
    // Configura un intervalo para llamar a cargarDashboards() cada 10 segundos (10000 milisegundos)
    this.intervalId = setInterval(() => {
      this.cargasDataSashboards();
    }, 10000);
  };

  // Función para detener el intervalo cuando se destruye el componente
  ngOnDestroy() {
    this.detenerIntervalo();
  }

  // Función para detener el intervalo si existe
  detenerIntervalo() {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
  }

  // Este método se llama cuando se cambia la cantidad de filas por página en una tabla o lista paginada.
  // Recibe un número como parámetro que representa la nueva cantidad de filas por página.
  // Luego, actualiza la variable this.numberRow con el valor recibido y establece this.page a 1 para volver a la primera página de la lista.
  onChangeRowPerPage(event: number): void {
    this.numberRow = event; // Actualizar la cantidad de filas por página
    this.page = 1; // Volver a la primera página
  }

  // Este método se llama cuando se cambia la página actual en una lista paginada.
  // Recibe un número como parámetro que representa la nueva página que deseas ver.
  // Luego, actualiza la variable this.page con el valor recibido.
  onChangePage(event: number): void {
    this.page = event; // Actualizar la página actual
  }

  agruparTipoPago() {
    // Inicializa un arreglo vacío para almacenar los tipos de pago únicos.
    let tipo: string[] = [];
    // Inicializa un arreglo vacío para almacenar los valores agregados correspondientes a cada tipo de pago.
    let valores: number[] = [];

    // Itera sobre cada elemento en listOfData y agrega su propiedad tipo_pago al arreglo tipo.
    this.listOfData.forEach(element => tipo.push(element.tipo_pago))

    // Elimina duplicados en el arreglo tipo utilizando un conjunto (Set) y luego conviértelo nuevamente en un arreglo.
    tipo = Array.from(new Set(tipo))

    // Inicializa el arreglo valores con ceros para cada tipo de pago.
    tipo.forEach(() => valores.push(0))

    // Itera nuevamente sobre listOfData.
    this.listOfData.forEach((elements) => {
      // Para cada elemento, itera sobre el arreglo tipo y busca coincidencias con el tipo de pago del elemento.
      tipo.forEach((element, i) => {
        if (elements.tipo_pago == tipo[i]) {
          // Si hay coincidencia, suma el valor de numero_pasajeros al valor correspondiente en el arreglo valores.
          let valor = valores[i];
          valores[i] = (elements.numero_pasajeros + valor)
        }
      })
    })

    // Asigna los arreglos tipo y valores a las propiedades tipoPago y valoresTiposPagos.
    this.tipoPago = tipo;
    this.valoresTiposPagos = valores;
  }


  agruparMediosPago() {
    // Inicializa un arreglo vacío para almacenar los medios de pago únicos.
    let medios: string[] = [];
    // Inicializa un arreglo vacío para almacenar los valores agregados correspondientes a cada medio de pago.
    let valores: number[] = [];

    // Itera sobre cada elemento en listOfData y agrega su propiedad medio_pago al arreglo medios.
    this.listOfData.forEach(element => medios.push(element.medio_pago))

    // Elimina duplicados en el arreglo medios utilizando un conjunto (Set) y luego conviértelo nuevamente en un arreglo.
    medios = Array.from(new Set(medios))

    // Inicializa el arreglo valores con ceros para cada medio de pago.
    medios.forEach(() => valores.push(0))

    // Itera nuevamente sobre listOfData.
    this.listOfData.forEach((elements) => {
      // Para cada elemento, itera sobre el arreglo medios y busca coincidencias con el medio de pago del elemento.
      medios.forEach((element, i) => {
        if (elements.medio_pago == medios[i]) {
          // Si hay coincidencia, suma el valor de numero_pasajeros al valor correspondiente en el arreglo valores.
          let valor = valores[i];
          valores[i] = (elements.numero_pasajeros + valor)
        }
      })
    })

    // Asigna los arreglos medios y valores a las propiedades medioPago y valoresMediosPagos.
    this.medioPago = medios;
    this.valoresMediosPagos = valores;
  }


  async cargarDashbords() {
    await this.agruparTipoPago();
    await this.agruparMediosPago();
    this.chartOptions = {
      series: [],
      chart: {
        type: "donut",
        height: 350

      },
      labels: [],
      colors: [
        this.colores[9],
        this.colores[7],
        this.colores[6],
        this.colores[5],
        this.colores[4],
        this.colores[3],
        this.colores[2],
        this.colores[1]
      ],
      title: {
        text: "Distribución de medio de pago",
        align: "center",
        style: {
          color: "#444"
        }
      }
    };
    this.chartOptions.labels = this.medioPago.map((element) => element)
    this.chartOptions.series = this.valoresMediosPagos.map((element) => element)

    this.chartOptions2 = {
      series: [],
      chart: {
        type: "donut",
        height: 350

      },
      labels: [],
      colors: [
        this.colores[9],
        this.colores[7],
        this.colores[6],
        this.colores[5],
        this.colores[4],
        this.colores[3],
        this.colores[2],
        this.colores[1]
      ],
      title: {
        text: "Distribución de tipo de pago",
        align: "center",
        style: {
          color: "#444"
        }
      }
    };
    this.chartOptions2.labels = this.tipoPago.map((element) => element)
    this.chartOptions2.series = this.valoresTiposPagos.map((element) => element)
  }

  cargar() {
    this.listOfData.forEach(element => {
      this.fechas.push(element.fecha);
      this.empresas.push(element.empresa);
      this.cantidadPasajeros += element.numero_pasajeros;
      this.totalRecaudado += element.total_pagado;
      this.deuda -= element.deuda;
    });
  }


  calcular(event) {
    // Restablece la lista de datos a su valor original almacenado en listOfDataCopy.
    this.listOfData = this.listOfDataCopy;

    // Limpia los arreglos fechas y empresas.
    this.fechas.length = 0;
    this.empresas.length = 0;

    // Reinicia las propiedades cantidadPasajeros, totalRecaudado y deuda a cero.
    this.cantidadPasajeros = 0;
    this.totalRecaudado = 0;
    this.deuda = 0;

    // Aplica filtros en la lista de datos basados en los criterios especificados.
    if (this.empresa && this.fechaCopyVig)
      this.listOfData = this.listOfData.filter((element) => (this.selectedViajeId == 0 ? true : element.id_viaje == event) && element.empresa && element.fecha == this.fechaCopyVig);
    else if (this.fechaCopyVig)
      this.listOfData = this.listOfData.filter((element) => (this.selectedViajeId == 0 ? true : element.id_viaje == event) && element.fecha == this.fechaCopyVig);
    else if (this.empresa)
      this.listOfData = this.listOfData.filter((element) => (this.selectedViajeId == 0 ? true : element.id_viaje == event) && element.empresa == this.empresa);
    else
      this.listOfData = this.listOfData.filter((element) => (this.selectedViajeId == 0 ? true : element.id_viaje == event) && element.fecha == this.fecha);
  }

  // Metodo para limpiar las variables, para cada vez que se cargue el dashboards
  resetearVariables() {
    this.listOfData = this.listOfDataCopy;
    this.fechas.length = 0;
    this.empresas.length = 0;
    this.cantidadPasajeros = 0;
    this.totalRecaudado = 0;
    this.deuda = 0;
    this.selectedViajeId = 0;
  }

  async cambioEnElSelectFecha(event: any) {
    // Paso 1: Reiniciar variables y configuración inicial de forma asíncrona.
    await this.resetearVariables();

    // Paso 2: Verificar si se ha seleccionado una fecha.
    if (event) {
      // Paso 3: Verificar la disponibilidad de filtros de empresa y fechas.
      if (this.empresa && this.fechas) {
        // Aplicar un filtro en la lista de datos para fecha y empresa seleccionadas.
        this.listOfData = this.listOfData.filter((element) => element.fecha == event && element.empresa == this.empresa);

        // Copiar la lista de datos filtrada a listOfDataFilter.
        this.listOfDataFilter = this.listOfData;

        // Realizar la carga de datos.
        this.cargar();

        // Cargar y actualizar los paneles de información (dashboards).
        this.cargarDashbords();

        // Terminar la ejecución del método.
        return;
      }

      // Paso 4: Si solo se selecciona una fecha, aplicar filtro solo por fecha.
      this.listOfData = this.listOfData.filter((element) => element.fecha == event);

      // Copiar la lista de datos filtrada a listOfDataFilter.
      this.listOfDataFilter = this.listOfData;

      // Realizar la carga de datos.
      this.cargar();

      // Cargar y actualizar los paneles de información (dashboards).
      this.cargarDashbords();

      // Terminar la ejecución del método.
      return;
    } else {
      // Paso 5: En caso de que no se seleccione una fecha.
      if (this.empresa) {
        // Aplicar un filtro en la lista de datos para empresa y fecha actual.
        this.listOfData = this.listOfData.filter((element) => element.empresa == this.empresa && element.fecha == this.fecha);

        // Copiar la lista de datos filtrada a listOfDataFilter.
        this.listOfDataFilter = this.listOfData;

        // Realizar la carga de datos.
        this.cargar();

        // Cargar y actualizar los paneles de información (dashboards).
        this.cargarDashbords();

        // Terminar la ejecución del método.
        return;
      }

      // Paso 6: Si no se selecciona una fecha y no hay filtro de empresa, aplicar filtro solo por fecha actual.
      this.listOfData = this.listOfData.filter((element) => element.fecha == this.fecha);

      // Copiar la lista de datos filtrada a listOfDataFilter.
      this.listOfDataFilter = this.listOfData;

      // Realizar la carga de datos.
      this.cargar();

      // Cargar y actualizar los paneles de información (dashboards).
      this.cargarDashbords();
    }
  }


  async cambioEnElSelect(event: any) {
    // Paso 1: Reiniciar variables y configuración inicial de forma asíncrona.
    await this.resetearVariables();

    // Paso 2: Verificar si se ha seleccionado un evento o empresa.
    if (event) {
      // Paso 3: Filtrar la lista de datos en función del evento o empresa seleccionados y la fecha actual o copiada.
      this.listOfData = this.listOfData.filter((element) => element.empresa == event && element.fecha == (this.fechaCopyVig ? this.fechaCopyVig : this.fecha));

      // Paso 4: Copiar la lista de datos filtrada a listOfDataFilter.
      this.listOfDataFilter = this.listOfData;

      // Paso 5: Realizar la carga de datos.
      this.cargar();

      // Paso 6: Cargar y actualizar los paneles de información (dashboards).
      this.cargarDashbords();

      // Terminar la ejecución del método.
      return;
    } else {
      // Paso 7: En caso de no haber seleccionado un evento o empresa.
      if (this.fechaCopyVig) {
        // Paso 8: Si hay una fecha copiada, filtrar la lista de datos por esa fecha.
        this.listOfData = this.listOfData.filter((element) => element.fecha == this.fechaCopyVig);

        // Paso 9: Copiar la lista de datos filtrada a listOfDataFilter.
        this.listOfDataFilter = this.listOfData;

        // Paso 10: Realizar la carga de datos.
        this.cargar();

        // Paso 11: Cargar y actualizar los paneles de información (dashboards).
        this.cargarDashbords();

        // Terminar la ejecución del método.
        return;
      }

      // Paso 12: Si no hay una fecha copiada, filtrar la lista de datos por la fecha actual.
      this.listOfData = this.listOfData.filter((element) => element.fecha == this.fecha);

      // Paso 13: Copiar la lista de datos filtrada a listOfDataFilter.
      this.listOfDataFilter = this.listOfData;

      // Paso 14: Realizar la carga de datos.
      this.cargar();

      // Paso 15: Cargar y actualizar los paneles de información (dashboards).
      this.cargarDashbords();
    }
  }

  async cambioEnElSelectRutas(event: any) {
    // 
  }


  async filtrarPorViaje(event) {
    // Paso 1: Verificar si el evento es igual al viaje seleccionado previamente.
    if (this.selectedViajeId == event) {
      // Paso 2: Si es igual, establecer el valor de selectedViajeId a 0.
      this.selectedViajeId = 0;

      // Paso 3: Calcular y realizar otras operaciones después de restablecer selectedViajeId.
      await this.calcular(event);
      this.cargar();
      this.cargarDashbords();

      // Terminar la ejecución del método.
      return;
    }

    // Paso 4: Si el evento es diferente al viaje seleccionado previamente.
    this.selectedViajeId = event;

    // Paso 5: Calcular y realizar otras operaciones después de establecer selectedViajeId.
    await this.calcular(event);
    this.cargar();
    this.cargarDashbords();
  }


  async cargasDataSashboards() {
    // Paso 1: Verificar si hay filtros activos (empresa, fecha copiada o viaje seleccionado).
    if (this.empresa || this.fechaCopyVig || this.selectedViajeId != 0) {
      // Si hay filtros activos, se sale del método sin realizar ninguna acción.
      return;
    }

    // Paso 2: Reiniciar variables y configuración inicial.
    await this.resetearVariables();

    // Paso 3: Obtener datos de dashboards de viajes desde un servicio.
    this._viajesDashboardsService.getDashboardsViajes()
      .subscribe(
        {
          next: (value: any) => {
            // Paso 4: Asignar los datos obtenidos a listOfData y listOfDataCopy.
            this.listOfData = value.data.dashboard;
            this.listOfDataCopy = this.listOfData;

            // Paso 5: Recopilar fechas únicas y asignar la última fecha a fecha.
            this.listOfData.forEach(element => {
              this.fechas.push(element.fecha);
            });
            this.fecha = this.fechas[this.fechas.length - 1];

            // Paso 6: Filtrar la lista de datos para mostrar solo datos de la fecha actual.
            this.listOfData = this.listOfData.filter((element) => element.fecha == this.fecha);
            this.listOfDataFilter = this.listOfData;

            // Paso 7: Recopilar información adicional (fechas, empresas, rutas,cantidad de pasajeros, total recaudado y deuda).
            this.listOfData.forEach(element => {
              this.fechas.push(element.fecha);
              this.empresas.push(element.empresa);
              this.rutas.push(element.nombre_ruta);
              this.cantidadPasajeros += element.numero_pasajeros;
              this.totalRecaudado += element.total_pagado;
              this.deuda -= element.deuda;
            });

            // Paso 8: Obtener copias únicas de fechas y empresas y rutas.
            this.fechasCopy = Array.from(new Set(this.fechas))
            this.empresasCopy = Array.from(new Set(this.empresas))
            this.rutasCopy = Array.from(new Set(this.rutas))

            // Paso 9: Cargar y actualizar los paneles de información (dashboards).
            this.cargarDashbords();
          },
          error: (err: any) => {
            // Manejar errores en caso de que la solicitud falle.
          }
        }
      )
  }
}
