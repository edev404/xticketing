import { Component, ViewChild, OnInit } from '@angular/core';
import { RecargaService } from './service/recarga.service';
import { ChartOptions, ChartOptions2, ChartOptions3, Recargas } from './models/Recargas';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-recarga',
  templateUrl: './recarga.component.html',
  styleUrls: ['./recarga.component.scss']
})
export class RecargaComponent implements OnInit {

  empresa: string = '';
  empresas: string[] = [];
  empresasCopy: string[] = [];

  valoreEmpresas: number[] = [];
  valoreEmpresasCopy: number[] = [];


  fechas: string[] = [];
  fechasCopy: string[] = [];
  fecha: string = '';
  fechaCopy: string = '';
  fechaCopyVig: any;

  private intervalId: any; // Variable para almacenar el ID del intervalo

  mediosPagos: string[] = [];
  mediosPagosCopy: string[] = [];

  sucursal: string[] = [];
  sucursalCopy: string[] = [];

  valoresMediosPagos: number[] = [];
  valoresMediosPagosCopy: number[] = [];

  valoreSucursal: number[] = [];
  valoreSucursalCopy: number[] = [];

  listOfData: Recargas[] = [];
  listOfDataCopy: Recargas[] = [];

  cantidad: number = 0;
  cantidadCopy: number = 0;
  recargas: number = 0;
  recargasCopy: number = 0;

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

  constructor(private _recargaService: RecargaService) { }


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

  /**
   * Este método agrupa los datos por el campo 'tipo_recarga' y calcula la suma de 'nro_recargas' para cada tipo de recarga.
   * Los resultados se almacenan en 'mediosPagos' y 'valoresMediosPagos'.
   */
  agruparMedios() {
    // Array para almacenar los tipos de recarga únicos.
    let tipo: string[] = [];

    // Array para almacenar las sumas de 'nro_recargas' para cada tipo de recarga.
    let valores: number[] = [];

    // Extraer los tipos de recarga de 'listOfData'.
    this.listOfData.forEach(element => tipo.push(element.tipo_recarga))

    // Eliminar duplicados y conservar únicamente los tipos de recarga únicos.
    tipo = Array.from(new Set(tipo))

    // Inicializar el array 'valores' con ceros.
    tipo.forEach(() => valores.push(0))

    // Calcular la suma de 'nro_recargas' para cada tipo de recarga.
    this.listOfData.forEach((elements) => {
      tipo.forEach((element, i) => {
        if (elements.tipo_recarga == tipo[i]) {
          let valor = valores[i];
          valores[i] = (elements.nro_recargas + valor)
        }
      })
    })

    // Almacenar los resultados en las propiedades correspondientes.
    this.mediosPagos = tipo;
    this.valoresMediosPagos = valores;
  }

  /**
   * Este método agrupa los datos por el campo 'sucursal' y cuenta la cantidad de registros para cada sucursal.
   * Los resultados se almacenan en 'sucursal' y 'valoreSucursal'.
   */
  agruparSucursal() {
    // Array para almacenar las sucursales únicas.
    let tipo: string[] = [];

    // Array para almacenar la cantidad de registros para cada sucursal.
    let valores: number[] = [];

    // Extraer las sucursales de 'listOfData'.
    this.listOfData.forEach(element => tipo.push(element.sucursal))

    // Eliminar duplicados y conservar únicamente las sucursales únicas.
    tipo = Array.from(new Set(tipo))

    // Inicializar el array 'valores' con ceros.
    tipo.forEach(() => valores.push(0))

    // Contar la cantidad de registros para cada sucursal.
    this.listOfData.forEach((elements) => {
      tipo.forEach((element, i) => {
        if (elements.sucursal == tipo[i]) {
          let valor = valores[i];
          valores[i] = (valor + 1)
        }
      })
    })

    // Almacenar los resultados en las propiedades correspondientes.
    this.sucursal = tipo;
    this.valoreSucursal = valores;
  }

  /**
   * Este método agrupa los datos por el campo 'empresa' y cuenta la cantidad de registros para cada empresa.
   * Los resultados se almacenan en 'valoreEmpresas'.
   */
  agruparEmpresas() {
    // Array para almacenar la cantidad de registros para cada empresa.
    let valores: number[] = [];

    // Inicializar el array 'valores' con ceros.
    this.empresasCopy.forEach(() => valores.push(0))

    // Contar la cantidad de registros para cada empresa.
    this.listOfData.forEach((elements) => {
      this.empresasCopy.forEach((element, i) => {
        if (elements.empresa == this.empresasCopy[i]) {
          let valor = valores[i];
          valores[i] = (valor + 1)
        }
      })
    })

    // Almacenar los resultados en la propiedad correspondiente.
    this.valoreEmpresas = valores;
  }


  async cargarDashboards() {
    await this.agruparMedios();
    await this.agruparSucursal();
    await this.agruparEmpresas();
    this.chartOptions = {
      series: [
        {
          name: "Cantidad de recargas por empresa",
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
        text: "Cantidad de recargas por empresa",
        align: "center"
      }
    };
    this.chartOptions.xaxis!.categories = this.empresasCopy.map((element) => [element])
    this.chartOptions.series![0].data = this.valoreEmpresas.map((element) => element)

    // GRAFICA 2
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
        text: "Distribución de tipos de recarga",
        align: "center",
        style: {
          color: "#444"
        }
      }
    };

    this.chartOptions2.labels = this.mediosPagos.map((element) => element)
    this.chartOptions2.series = this.valoresMediosPagos.map((element) => element)

    // GRAFICA 3
    this.chartOptions3 = {
      series: [
        {
          name: "Cantidad de recargas por sucursal",
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
        text: "Cantidad de recargas por sucursal",
        align: "center",
      }
    };

    this.chartOptions3.xaxis!.categories = this.sucursal.map((element) => element)
    this.chartOptions3.series![0].data = this.valoreSucursal.map((element) => element)
  }

  /**
   * Este método se ejecuta cuando se produce un cambio en el select.
   * Filtra los datos en base a las opciones seleccionadas en el select y actualiza los resultados y dashboards.
   * @param event El evento que desencadena el cambio en el select.
   */
  cambioEnElSelect(event: any) {
    // Restaurar la lista de datos original desde la copia.
    this.listOfData = this.listOfDataCopy;

    // Limpiar las listas de fechas y empresas.
    this.fechas.length = 0;
    this.empresas.length = 0;

    // Reiniciar las variables de cantidad y recargas.
    this.cantidad = 0;
    this.recargas = 0;

    if (event) {
      // Si se ha seleccionado una empresa y hay una fecha de vigencia copiada.
      if (this.empresa && this.fechaCopyVig) {
        // Filtrar los datos por empresa y fecha de vigencia.
        this.listOfData = this.listOfData.filter((element) => element.empresa == event && element.fecha == this.fechaCopyVig);

        // Cargar los resultados y actualizar los dashboards.
        this.cargar();
        this.cargarDashboards();
        return;
      }

      // Filtrar los datos solo por empresa.
      this.listOfData = this.listOfData.filter((element) => element.empresa == event);

      // Cargar los resultados y actualizar los dashboards.
      this.cargar();
      this.cargarDashboards();
      return;
    } else {
      // Si no se ha seleccionado una empresa pero hay una fecha de vigencia copiada.
      if (this.fechaCopyVig) {
        // Filtrar los datos solo por fecha de vigencia.
        this.listOfData = this.listOfData.filter((element) => element.fecha == this.fechaCopyVig);

        // Cargar los resultados y actualizar los dashboards.
        this.cargar();
        this.cargarDashboards();
        return;
      }

      // Filtrar los datos solo por la fecha actual.
      this.listOfData = this.listOfData.filter((element) => element.fecha == this.fecha);

      // Cargar los resultados y actualizar los dashboards.
      this.cargar();
      this.cargarDashboards();
    }
  }


  /**
   * Este método se ejecuta cuando se produce un cambio en el select de fechas.
   * Filtra los datos en base a las opciones seleccionadas en el select de fechas y actualiza los resultados y dashboards.
   * @param event El evento que desencadena el cambio en el select de fechas.
   */
  cambioEnElSelectFecha(event: any) {
    // Restaurar la lista de datos original desde la copia.
    this.listOfData = this.listOfDataCopy;

    // Limpiar las listas de fechas y empresas.
    this.fechas.length = 0;
    this.empresas.length = 0;

    // Reiniciar las variables de cantidad y recargas.
    this.cantidad = 0;
    this.recargas = 0;

    if (event) {
      // Si se ha seleccionado una fecha y existe una empresa seleccionada.
      if (this.empresa && this.fechas) {
        // Filtrar los datos por fecha y empresa.
        this.listOfData = this.listOfData.filter((element) => element.fecha == event && element.empresa == this.empresa);

        // Cargar los resultados y actualizar los dashboards.
        this.cargar();
        this.cargarDashboards();
        return;
      }

      // Filtrar los datos solo por fecha.
      this.listOfData = this.listOfData.filter((element) => element.fecha == event);

      // Cargar los resultados y actualizar los dashboards.
      this.cargar();
      this.cargarDashboards();
      return;
    } else {
      // Si no se ha seleccionado una fecha pero existe una empresa seleccionada.
      if (this.empresa) {
        // Filtrar los datos por empresa y la fecha actual.
        this.listOfData = this.listOfData.filter((element) => element.empresa == this.empresa && element.fecha == this.fecha);

        // Cargar los resultados y actualizar los dashboards.
        this.cargar();
        this.cargarDashboards();
        return;
      }

      // Filtrar los datos solo por la fecha actual.
      this.listOfData = this.listOfData.filter((element) => element.fecha == this.fecha);

      // Cargar los resultados y actualizar los dashboards.
      this.cargar();
      this.cargarDashboards();
    }
  }


  /**
   * Este método se utiliza para cargar datos de la lista de datos actual en las listas de fechas y empresas, y calcular la cantidad y recargas totales.
   */
  cargar() {
    // Iterar a través de cada elemento en la lista de datos.
    this.listOfData.forEach(element => {
      // Agregar la fecha y empresa del elemento a las respectivas listas.
      this.fechas.push(element.fecha);
      this.empresas.push(element.empresa);

      // Actualizar la cantidad y recargas totales sumando los valores del elemento actual.
      this.cantidad += element.nro_recargas;
      this.recargas += element.total_recargas;
    });
  }


  /**
   * Este método se encarga de cargar los datos para los dashboards.
   * Si hay una empresa o una fecha de vigencia seleccionada, no realiza la carga.
   * Si no hay empresa ni fecha de vigencia seleccionada, recarga los datos y actualiza las listas de fechas y empresas.
   */
  cargasDataSashboards() {
    // Si hay una empresa o fecha de vigencia seleccionada, no realiza la carga.
    if (this.empresa || this.fechaCopyVig) {
      return;
    }

    // Restaurar la lista de datos original desde la copia.
    this.listOfData = this.listOfDataCopy;

    // Limpiar las listas de fechas y empresas.
    this.fechas.length = 0;
    this.empresas.length = 0;

    // Reiniciar las variables de cantidad y recargas.
    this.cantidad = 0;
    this.recargas = 0;

    // Llamar al servicio para obtener los datos de los dashboards de recargas.
    this._recargaService.getListDashboardsRecargas()
      .subscribe(
        {
          next: (value: any) => {
            // Actualizar la lista de datos con los datos obtenidos del servicio.
            this.listOfData = value.data.dashboard;
            this.listOfDataCopy = this.listOfData;

            // Llenar las listas de fechas y empresas con los datos obtenidos.
            this.listOfData.forEach((element) => {
              this.fechas.push(element.fecha)
              this.empresas.push(element.empresa)
            })

            // Establecer la fecha actual como la primera fecha en la lista.
            this.fecha = this.fechas[0]

            // Filtrar los datos por la fecha actual y calcular la cantidad y recargas.
            this.listOfData = this.listOfData.filter((element) => element.fecha == this.fecha);
            this.listOfData.forEach((element) => {
              this.cantidad += element.nro_recargas;
              this.recargas += element.total_recargas;
              this.fechas.push(element.fecha)
            })

            // Eliminar duplicados y conservar únicamente fechas y empresas únicas.
            this.fechasCopy = Array.from(new Set(this.fechas));
            this.empresasCopy = Array.from(new Set(this.empresas));

            // Cargar los dashboards con los datos actualizados.
            this.cargarDashboards();
          },
          error: (err: any) => {
            // Manejar errores en caso de que la solicitud al servicio falle.
          }
        }
      )
  }
}


