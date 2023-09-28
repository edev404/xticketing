import { Component, OnInit, ViewChild } from '@angular/core';

import { ChartComponent } from 'ng-apexcharts';
import { ApiServiceUserAdmin } from 'src/app/modules/admin/admin/user/service/user.admin.api';
import { Logo } from 'src/app/shared/models/navbar.interface';
import { ChartOptions, ChartOptions2, ChartOptions3, ChartOptions4, Dashboards, DataEntry, IntervalData, Subidas } from './models/dashboards-models';
import { DashboardsService } from './service/dashboards.service';



@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit {

  index = 0;
  tabs = ['Dashboards recaudo', 'Dashboards recargas', 'Dashboards viajes'];

  private intervalId: any;

  subidas: Subidas[] = []
  subidasCopy: Subidas[] = []
  subidasNumber: number = 0
  bajadasNumber: number = 0
  bloqueoNumber: number = 0
  tarjeta: number = 1;
  vista = 0;

  dashboards: Dashboards[] = [];
  dashboardsCopy: Dashboards[] = [];

  resultArray: IntervalData[] = [];

  label = ["Cantidad de pasajeros", "Total recaudo", "Fecha"]
  imgLogo: Logo = {};

  empresa: any = '';
  nroPasajeros: number = 0;
  total: number = 0
  fecha: string = '';


  labels: any[] = [];
  labelsCopy: any[] = [];
  labelsCopys: any[] = [];
  values: any[] = [];
  valuesCopy: any[] = [];
  rutas: any[] = [];
  medios: any[] = [];
  mediosCopy: any[] = [];
  calCopy: any[] = [];

  empresasPas: string[] = [];
  nroPasajeroEmp: any[] = [];

  rutasPas: string[] = [];
  nroPasajeroRut: any[] = [];

  nroPasajeroFech: any[] = [];

  fechas: string = '';
  fechasFija: string = '';
  fechaPasj: any[] = [];
  fechaPasjCopy: any[] = [];

  data: DataEntry[] = [];

  mostrarDetalleRecarga: boolean = false;
  mostrarViajes: boolean = false;

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
  public chartOptions2!: Partial<ChartOptions2>;
  @ViewChild("chart") chart3!: ChartComponent;
  public chartOptions3!: Partial<ChartOptions3>;
  @ViewChild("chart") chart4!: ChartComponent;
  public chartOptions4!: Partial<ChartOptions4>;

  constructor(private _dashboardsService: DashboardsService, private apiAdmin: ApiServiceUserAdmin) {
    // Constructor del componente, se inyectan dos servicios como dependencias
  }


  ngOnInit(): void {
    // Llama a repetirPeticion() cuando se inicializa el componente
    this.repetirPeticion();
  }

  // Función para repetir la petición y configurar el intervalo
  repetirPeticion() {
    this.cargarDashboards();
    // Configura un intervalo para llamar a cargarDashboards() cada 10 segundos (10000 milisegundos)
    this.intervalId = setInterval(() => {
      this.cargarDashboards();
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

  /**
 * Carga el logo de la entidad seleccionada utilizando la API de administración.
 */
  entidadCargada() {
    this.apiAdmin.getLogoEntities(this.getSelectedEntity()).subscribe({
      next: (value: any) => {
        // Verifica si se obtuvo un resultado válido y asigna el logo correspondiente.
        if (value.data.result) {
          this.imgLogo = value.data.result;
        }
      },
      error: (err: any) => {
        // Maneja los errores de la solicitud, si los hay.
        // console.log(err);
      }
    });
  }

  getSelectedEntity() {
    // Intenta obtener la entidad seleccionada del almacenamiento local.
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));

    if (entity) {
      // Obtiene el ID de la primera entidad en la lista de entidades.
      const idEntity = entity.entities[0].id;
      return idEntity;
    }

    // Retorna null si no se encontró una entidad seleccionada.
    return null;
  }

  // Variable para cambiar lnteractuar con la card (subidos, bajados y bloqueados)
  pasarCard(event) {
    this.tarjeta = event;
  }

  // Metdodo para navegar por las pestañas y cambiar las pestañas
  cambiarPestana(tabs: string) {
    if (tabs == 'Dashboards recaudo') {
      this.vista = 0;
      return;
    }
    else if (tabs == 'Dashboards recargas') {
      this.vista = 2;
      return;
    }
    this.vista = 3;
  }

  // Metodo para limpiar las variables, para cada vez que se cargue el dashboards
  reseterVariable() {
    this.labels.length = 0;
    this.values.length = 0;
    this.rutas.length = 0;
    this.medios.length = 0;
    this.nroPasajeros = 0;
    this.total = 0;
    this.labels = [];
    this.labelsCopy = [];
    this.labelsCopys = [];
    this.values = [];
    this.valuesCopy = [];
    this.rutas = [];
    this.medios = [];
    this.mediosCopy = [];
    this.calCopy = [];
    this.empresasPas = [];
    this.nroPasajeroEmp = [];
    this.rutasPas = [];
    this.nroPasajeroRut = [];
    this.nroPasajeroFech = [];
    this.fechas = '';
    this.fechaPasj = [];
    this.fechaPasjCopy = [];
    this.resultArray = [];
    this.data.length = 0;
    this.subidasNumber = 0
    this.bajadasNumber = 0
    this.bloqueoNumber = 0
  }

  agruparEmpresas() {
    // Se crea un conjunto a partir de la lista de empresas.
    const json = Array.from(new Set(this.labelsCopys));

    // Se crea una lista de números vacía, con la misma longitud que la lista de empresas.
    let jsonData: number[] = [];
    json.forEach(() => jsonData.push(0));

    // Se recorre la lista de dashboards y se agrega el número de pasajeros de cada dashboard a la lista de totales por empresa.
    this.dashboards.forEach((elements) => {
      json.forEach((element, i) => {
        if (elements.nombre_empresa == json[i]) {
          let valor = jsonData[i];
          jsonData[i] = (elements.nro_pasajeros + valor);
        }
      });
    });

    // Se asignan las listas de empresas y totales a las variables `empresasPas` y `nroPasajeroEmp`, respectivamente.
    this.empresasPas = json;
    this.nroPasajeroEmp = jsonData;
  }

  agruparRutas() {
    // Se crea un conjunto a partir de la lista de rutas.
    const json = Array.from(new Set(this.rutas));

    // Se crea una lista de números vacía, con la misma longitud que la lista de rutas.
    let jsonData: number[] = [];
    json.forEach(() => jsonData.push(0));

    // Se recorre la lista de dashboards y se agrega el número de pasajeros de cada dashboard a la lista de totales por ruta.
    this.dashboards.forEach((elements) => {
      json.forEach((element, i) => {
        if (elements.nombre_ruta == json[i]) {
          let valor = jsonData[i];
          jsonData[i] = (elements.nro_pasajeros + valor);
        }
      });
    });

    // Se asignan las listas de rutas y totales a las variables `rutasPas` y `nroPasajeroRut`, respectivamente.
    this.rutasPas = json;
    this.nroPasajeroRut = jsonData;
  }

  agruparMedios() {
    // Se crea un conjunto a partir de la lista de medios de pago.
    const json = Array.from(new Set(this.medios));

    // Se crea una lista de números vacía, con la misma longitud que la lista de medios de pago.
    let jsonData: number[] = [];
    json.forEach(() => jsonData.push(0));

    // Se recorre la lista de dashboards y se agrega el número de pasajeros de cada dashboard a la lista de totales por medio de pago.
    this.dashboards.forEach((elements) => {
      json.forEach((element, i) => {
        if (elements.tipo_pago == json[i]) {
          let valor = jsonData[i];
          jsonData[i] = (elements.nro_pasajeros + valor);
        }
      });
    });

    // Se asignan las listas de medios de pago y totales a las variables `mediosCopy` y `calCopy`, respectivamente.
    this.mediosCopy = json;
    this.calCopy = jsonData;
  }

  intervalosDeTiempo(fechaActual: any) {
    // Se crea un objeto `intervalo` vacío, que se utilizará para almacenar los intervalos de tiempo y el número de pasajeros en cada intervalo.
    const intervalo = {};

    // Se crea una lista `fechas` vacía, que se utilizará para almacenar todas las fechas únicas en el conjunto de datos.
    let fechas: any[] = [];
    this.data.forEach((element) => {
      fechas.push(element.fecha);
    });

    // Se elimina los duplicados de la lista `fechas`.
    fechas = Array.from(new Set(fechas));

    // Se recorre la lista `fechas` y se inicializa un arreglo vacío para cada fecha en el objeto `intervalo`.
    fechas.forEach((element) => {
      intervalo[element] = [];
    });

    // Se crea una lista `intervalos` vacía, que se utilizará para almacenar los intervalos de tiempo.
    let intervalos: any[] = [];

    // Se crea una lista `pasajeros` vacía, que se utilizará para almacenar el número de pasajeros en cada intervalo.
    let pasajeros: any[] = [];

    // Se recorre el conjunto de datos y se agregan los intervalos de tiempo y el número de pasajeros a las listas `intervalos` y `pasajeros`, respectivamente.
    this.data.forEach((element) => {
      fechas.forEach((elements) => {
        if (element.fecha == elements) {
          intervalo[elements].push(element.hora.slice(0, 2));
          pasajeros.push(element.nro_pasajeros);
        }
      });
    });

    // Si la fecha actual existe en el objeto `intervalo`, se procede a calcular los intervalos de tiempo.
    if (intervalo.hasOwnProperty(fechaActual)) {
      // Se filtran los valores seleccionados para incluir solo los valores que son mayores o iguales que 1.
      let selectedValues = intervalo[fechaActual];
      selectedValues = selectedValues.filter((element) => (element == '00') ? '01' : element);
      selectedValues.push('9999');

      // Se agrega un valor de 0 a la lista `pasajeros` para representar el número de pasajeros en el intervalo de tiempo final.
      pasajeros.push(0);

      // Se inicializan dos variables: `valorMayor` y `cantidad`.
      let valorMayor = Number(String(selectedValues[0]).slice(0, 2));
      let cantidad = 0;

      // Se recorre la lista `intervalos` y se calcula el número total de pasajeros en cada intervalo.
      selectedValues.forEach((element, i) => {
        if (element == '01') {
          valorMayor = Number('01');
        }
        if ((Number(element)) >= (Number(valorMayor + 3))) {
          intervalos.push({ "intervalo": `[${Number(valorMayor)}:00 - ${(valorMayor == Number('21') || valorMayor == Number('22') || valorMayor == Number('23') || valorMayor == Number('24') ? '00' : valorMayor + 2)} :59]`, valor: cantidad });
          cantidad = 0;
          valorMayor = Number(element);
        }
        cantidad += pasajeros[i];
      });

      // Se recorre la lista `intervalos` y se agrega cada intervalo a la lista `resultArray`.
      intervalos.forEach((element) => {
        this.resultArray.push({ intervalo: element.intervalo, total_pasajeros: element.valor });
      });
    } else {
      // Si la fecha actual no existe en el objeto `intervalo`, se imprime un mensaje en la consola.
      console.log(`La clave ${"2023/08/24"} no existe en el objeto intervalo.`);
    }
  }

  async cargarData() {
    await this.agruparEmpresas();
    await this.agruparRutas();
    await this.agruparMedios();
    await this.intervalosDeTiempo(this.fecha);
    this.chartOptions = {
      series: [
        {
          name: "Cantidad de pasajeros por empresas",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          }
        }
      },
      colors: [
        this.colores[9],
        this.colores[8],
        this.colores[7],
        this.colores[6],
        this.colores[5],
        this.colores[4],
        this.colores[3],
        this.colores[2],
        this.colores[1]
      ],
      plotOptions: {
        bar: {
          columnWidth: "20%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: true
      },
      legend: {
        show: true
      },
      grid: {
        show: true
      },
      xaxis: {
        categories: [
        ],
        labels: {
          style: {
            colors: [
              "#000",
            ],
            fontSize: "12px"
          }
        }
      },
      title: {
        text: "Cantidad de pasajeros por empresas",
        align: "center"
      }
    };
    this.chartOptions.xaxis!.categories = this.empresasPas.map((element) => [element])
    this.chartOptions.series![0].data = this.nroPasajeroEmp.map((element) => element)

    // ----------------------------------------
    this.chartOptions2 = {
      series: [
        {
          name: "Cantidad de pasajeros por ruta",
          data: []
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          columnWidth: "20%",
          horizontal: true
        }
      },
      dataLabels: {
        enabled: true
      },
      legend: {
        show: true
      },
      xaxis: {
        categories: [
        ]
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      colors: [
        this.colores[9]
      ],
      yaxis: {
        reversed: false,
        axisTicks: {
          show: true
        }
      },
      title: {
        text: "Cantidad de pasajeros por ruta",
        align: "center",
      }
    };

    this.chartOptions2.xaxis!.categories = this.rutasPas.map((element) => element)
    this.chartOptions2.series![0].data = this.nroPasajeroRut.map((element) => element)
    // ---------------------------
    this.chartOptions3 = {
      series: [
        {
          name: "Cantidad de pasajeros por intervalos de tiempo",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Cantidad de pasajeros por intervalos de tiempo",
        align: "center",
        style: {
          color: "#444"
        }
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      colors: [
        this.colores[9]
      ],
      xaxis: {
        categories: []
      }
    };


    this.chartOptions3.series![0].data = this.resultArray.map((element) => element.total_pasajeros);
    this.chartOptions3.xaxis!.categories = this.resultArray.map((element) => element.intervalo);
    // -------------------------


    this.chartOptions4 = {
      series: [],
      chart: {
        type: "donut",
        height: 350
      },
      dataLabels: {
        enabled: true
      },
      legend: {
        show: true
      },
      grid: {
        show: true
      },
      labels: [],
      colors: [
        this.colores[9],
        // this.colores[8],
        this.colores[7],
        this.colores[6],
        this.colores[5],
        this.colores[4],
        this.colores[3],
        this.colores[2],
        this.colores[1]
      ],
      title: {
        text: "Distribución de medios de pagos",
        align: "center",
        style: {
          color: "#444"
        }
      }
    };
    this.chartOptions4.labels = this.mediosCopy.map((element) => element)
    this.chartOptions4.series = this.calCopy.map((element) => element)
    //
    this.labels = this.labelsCopy;
    this.entidadCargada()
  }

  // Esta función carga los datos en el gráfico.
  cargar() {
    // Se vacía la lista de datos.
    this.data.length = 0;

    // Se recorre la lista de dashboards y se agregan los datos a la lista de datos.
    this.dashboards.forEach((element, i) => {
      // Se suman los valores de pasajeros y recaudación por cada dashboard.
      this.nroPasajeros += element.nro_pasajeros;
      this.total += element.recaudado;

      // Se obtiene la fecha del último dashboard.
      this.fecha = this.dashboards[this.dashboards.length - 1].fecha;

      // Se agregan las fechas a la lista de fechas de pasajeros.
      this.fechaPasj.push(element.fecha);
      this.fechaPasjCopy.push(element.fecha);

      // Se agregan las etiquetas a la lista de etiquetas.
      this.labels.push({ "id": (element.id_empresa), "labels": element.nombre_empresa });
      this.labelsCopys.push(element.nombre_empresa);

      // Se agregan los valores de pasajeros a la lista de valores.
      this.values.push(element.nro_pasajeros);

      // Se agregan los nombres de ruta a la lista de rutas.
      this.rutas.push(element.nombre_ruta);

      // Se agregan los tipos de pago a la lista de medios.
      this.medios.push(element.tipo_pago);

      // Se agregan los datos al gráfico.
      this.data.push({ fecha: element.fecha, hora: element.hora, nro_pasajeros: element.nro_pasajeros });
    });

    // Se eliminan los duplicados de la lista de fechas de pasajeros.
    this.fechaPasjCopy = Array.from(new Set(this.fechaPasjCopy));

    // Se eliminan los duplicados de la lista de etiquetas.
    this.labelsCopys = Array.from(new Set(this.labelsCopys));

    // Se filtran las subidas para calcular los totales de subidas, bajadas y bloqueos.
    this.subidas = this.subidas.filter((element) => {
      this.subidasNumber += (element.subida_1 ? element.subida_1 : 0);
      this.bajadasNumber += (element.bajada_1 ? element.bajada_1 : 0);
      this.bloqueoNumber += (element.bloqueo_1 ? element.bloqueo_1 : 0);
    });
  }

  // Metodo para limpiar las variables, para cada vez que se filtre la data del dashboards
  resetearVariablesFiltro() {
    this.dashboards = this.dashboardsCopy;
    this.subidas = this.subidasCopy;
    this.labels.length = 0;
    this.values.length = 0;
    this.rutas.length = 0;
    this.medios.length = 0;
    this.nroPasajeros = 0;
    this.total = 0;
    this.subidasNumber = 0;
    this.bajadasNumber = 0;
    this.bloqueoNumber = 0;
  }


  // Esta función se ejecuta cuando se selecciona un valor en el elemento `select`.
  async cambioEnElSelect(event) {
    // Se restablecen las variables de filtro.
    await this.resetearVariablesFiltro();

    // Si se selecciona un valor en el elemento `select`, se filtran las listas por las variables `event` y `this.fechas`.
    if (event) {
      // Si las variables `this.empresa` y `this.fechas` no son nulas, se filtran las listas por ambas variables.
      if (this.empresa && this.fechas) {
        // Se filtran las listas `this.dashboards` y `this.subidas` para incluir solo los elementos que coincidan con los valores de las variables `event` y `this.fechas`.
        this.dashboards = this.dashboards.filter((element) => element.nombre_empresa == event && element.fecha == this.fechas);
        this.subidas = this.subidas.filter((element) => element.empresa == event && element.fecha == this.fechas);

        // Se llaman a las funciones `this.cargar()` y `this.cargarData()` para cargar los datos nuevos.
        this.cargar();
        this.cargarData();

        // Se devuelve el control de la función.
        return;
      }

      // Si la variable `this.empresa` es nula pero `this.fechas` no lo es, se filtran las listas solo por la variable `this.fechas`.
      this.dashboards = this.dashboards.filter((element) => element.fecha == this.fechas);
      this.subidas = this.subidas.filter((element) => element.fecha == this.fechas);

      // Se llaman a las funciones `this.cargar()` y `this.cargarData()` para cargar los datos nuevos.
      this.cargar();
      this.cargarData();

      // Se devuelve el control de la función.
      return;
    }

    // Si no se selecciona ningún valor en el elemento `select`, se filtran las listas solo por la variable `this.fechas`.
    this.dashboards = this.dashboards.filter((element) => element.fecha == this.fecha);
    this.subidas = this.subidas.filter((element) => element.fecha == this.fecha);

    // Se llaman a las funciones `this.cargar()` y `this.cargarData()` para cargar los datos nuevos.
    this.cargar();
    this.cargarData();
  }

  async cambioEnElSelectFecha(event) {
    if (!event) {
      // this.fechas = this.fechasFija;
      this.fecha = this.fechasFija;
    }
    await this.resetearVariablesFiltro();
    // Comprueba si el evento existe (no es nulo o indefinido).
    if (event) {
      // Comprueba si hay una empresa seleccionada y fechas disponibles.
      if (this.empresa && this.fechas) {
        // Filtra los elementos de 'this.dashboards' y 'this.subidas' por fecha y empresa.
        this.dashboards = this.dashboards.filter((element) => element.fecha == event && element.nombre_empresa == this.empresa);
        this.subidas = this.subidas.filter((element) => element.fecha == event && element.empresa == this.empresa);
        // Llama a las funciones 'cargar' y 'cargarData'.
        this.cargar();
        this.cargarData();
        return;
      }
      // Si no hay una empresa seleccionada o fechas disponibles, filtra solo por fecha.
      this.dashboards = this.dashboards.filter((element) => element.fecha == event);
      this.subidas = this.subidas.filter((element) => element.fecha == event);
      // Llama a las funciones 'cargar' y 'cargarData'.
      this.cargar();
      this.cargarData();
      return;
    } else {
      // Si el evento es nulo, verifica si hay una empresa seleccionada.
      if (this.empresa) {
        // Filtra los elementos de 'this.dashboards' y 'this.subidas' por empresa y fecha fija.
        this.dashboards = this.dashboards.filter((element) => element.nombre_empresa == this.empresa && element.fecha == this.fecha);
        this.subidas = this.subidas.filter((element) => element.fecha == this.fecha && element.empresa == this.empresa);
        // Llama a las funciones 'cargar' y 'cargarData'.
        this.cargar();
        this.cargarData();
        return;
      }
    }
    // Si no hay empresa seleccionada ni evento, filtra solo por la fecha fija.
    this.dashboards = this.dashboards.filter((element) => element.fecha == this.fecha);
    this.subidas = this.subidas.filter((element) => element.fecha == this.fecha);
    // Llama a las funciones 'cargar' y 'cargarData'.
    this.cargar();
    this.cargarData();
  }

  listarSubidas() {
    // Llamada al servicio '_dashboardsService' para obtener la lista de dashboards subidos.
    this._dashboardsService.listDashsboardsSubidos()
      .subscribe(
        {
          // Callback que se ejecutará cuando se reciba una respuesta exitosa.
          next: (value: any) => {
            // Asigna los datos de los dashboards recibidos a la variable 'this.subidas'.
            this.subidas = value.data.dashboard;

            // Realiza una copia de la lista de subidas en 'this.subidasCopy'.
            this.subidasCopy = this.subidas;

            // Filtra los elementos de 'this.subidas' para obtener solo aquellos con fecha igual a 'this.fecha'.
            this.subidas = this.subidas.filter((element) => element.fecha == this.fecha);

            // Imprime la lista filtrada en la consola.
            console.log(this.subidas);

            // Itera sobre los elementos de 'this.subidas' y suma los valores de subida_1, bajada_1 y bloqueo_1.
            this.subidas.forEach((element) => {
              this.subidasNumber += (element.subida_1 ? element.subida_1 : 0);
              this.bajadasNumber += (element.bajada_1 ? element.bajada_1 : 0);
              this.bloqueoNumber += (element.bloqueo_1 ? element.bloqueo_1 : 0);
            });
          }
        }
      );
  }


  async cargarDashboards() {
    if (this.empresa || this.fechas || this.tarjeta != 1) {
      //
    } else {
      // Metodo para resetear variables
      await this.reseterVariable();
      this._dashboardsService.listDashsboards()
        .subscribe(
          {
            next: (value: any) => {
              // Almacenar los dashboards obtenidos en la variable 'dashboards'.
              this.dashboards = value.data.dashboard;
              this.dashboardsCopy = this.dashboards;

              // Realizar cálculos y asignaciones adicionales a las variables.
              this.dashboards.forEach((element, i) => {
                this.fechaPasjCopy.push(element.fecha)
                this.fecha = this.dashboards[this.dashboards.length - 1].fecha;
                this.fechasFija = this.fecha;
              });

              // Hacer una copia de seguridad de los datos originales.
              this.dashboardsCopy = this.dashboards;
              this.labelsCopy = this.labels;
              this.valuesCopy = this.values;
              // Cargar los datos iniciales.
              this.dashboards = this.dashboards.filter((element) => element.fecha == this.fecha);
              this.dashboards.forEach((element, i) => {
                this.nroPasajeros += element.nro_pasajeros;
                this.total += element.recaudado;
                this.fechaPasj.push(element.fecha)
                this.labels.push({ "id": (element.id_empresa), "labels": element.nombre_empresa });
                this.labelsCopys.push(element.nombre_empresa)
                this.values.push(element.nro_pasajeros);
                this.rutas.push(element.nombre_ruta);
                this.medios.push(element.tipo_pago);
                this.data.push({ fecha: element.fecha, hora: element.hora, nro_pasajeros: element.nro_pasajeros })
              });
              this.fechaPasjCopy = Array.from(new Set(this.fechaPasjCopy));
              const json = new Set(this.labelsCopys);
              this.labelsCopys = Array.from(json);
              this.listarSubidas();
              this.cargarData();
            },
            error: (err: any) => {
              // Manejar errores en la solicitud, si los hay.
              // Puedes agregar aquí el manejo de errores específico.
            }
          });
    }
  }
}
