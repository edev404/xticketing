import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigFileService } from 'src/app/modules/admin/admin/parameters/config-file/services/config-file.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { DataEvaluada, DescargarData, IArchivoDatosEnvio, IArchivoDatosError, IArchivoValidacion, IMensajeError, IPlantillas, TmpDataFile, TmpTemplate } from '../../models/archivos.interface';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class UploadFilesComponent implements OnInit, OnDestroy {
  dataTabla: any[] = [];
  // FILTRAR
  filterValueTable: string = '';
  filterValue: string = '';
  // Linea que cuenta la linea del excel
  cantidadExcelEvaludados = 0;
  cantidadExcel = 1;
  linea: number = 1;
  totalRegistro: number = 0;
  dataValidos: IArchivoDatosError[] = [];
  dataInvalidos: IArchivoDatosError[] = [];
  cargados: number = 0;
  fallidos: number = 0;
  fallidosList: number[] = [];
  restriciones: any[] = [];
  username: string = '';
  dataEvaluda: DataEvaluada[] = [];
  // PLANTILLA
  plantillaObtenida!: IPlantillas;
  plantillaEnviada!: TmpTemplate;
  plantillaObtenidaBack: TmpTemplate[] = [];
  dataPlantilla: TmpDataFile[] = [];
  evaluacionesCeldas: IMensajeError[] = [];
  evaluacionCeldas: IMensajeError[] = [];
  evaluacionCeldasModal: IMensajeError[] = [];
  evaluacionCeldasModalCopy: IMensajeError[] = [];
  evaluacionCeldasCopy: IMensajeError[] = [];
  checked: boolean = false;
  descargarData: DescargarData = {};

  key: any[] = [];
  // MODAL
  isVisible: boolean = false;
  dataModal: IArchivoDatosError[] = [];
  listOfData: IArchivoDatosEnvio[] = [];
  listOfDataCopy: IArchivoDatosEnvio[] = [];

  // PAGINADO
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  numberRow: number = 5;
  page: number = 1;

  currentFileName!: string;
  currentFileSize!: string;

  haveFile: boolean = false;

  templates!: IPlantillas[];
  templateSelect: any;

  // ARCHIVP
  extension: string = '';

  file!: File | null;

  subscription: Subscription = new Subscription()
  constructor(
    private utils: UtilsService,
    private api: ConfigFileService,
  ) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit() {
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));
    this.username = entity.username;
    await this.loadPlantillas();
  }

  // Paginador
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }
  onChangePage(event: number): void {
    this.page = event;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  searchTable() {
    let data: IArchivoDatosEnvio[];
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.listOfDataCopy.filter(
        (current: IArchivoDatosEnvio) => {
          return this.utils.validateObject(current.nombre) && current.nombre!.toString().toUpperCase().includes(this.filterValue!.toUpperCase())
          // this.utils.validateObject(current.descripcion) && current.fila !.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
          // this.utils.validateObject(current.mensaje) && current.mensaje !.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
        }
      );
      if (data) {
        this.listOfData = data;
      }
    } else {
      if (this.evaluacionCeldasCopy) {
        this.listOfData = this.listOfDataCopy;
        this.filterValue = ''
      }
    }
  }
  searchModal() {
    let data: IMensajeError[];
    if (this.filterValueTable || (this.filterValueTable && this.filterValueTable.trim() != '')) {
      data = this.evaluacionCeldasModalCopy.filter(
        (current: IMensajeError) => {
          return this.utils.validateObject(current.fila) && current.fila!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            this.utils.validateObject(current.fecha) && current.fecha!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
          // this.utils.validateObject(current.descripcion) && current.fila !.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
          // this.utils.validateObject(current.mensaje) && current.mensaje !.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
        }
      );
      if (data) {
        this.evaluacionCeldasModal = data;
      }
    } else {
      if (this.evaluacionCeldasModalCopy) {
        this.evaluacionCeldasModal = this.evaluacionCeldasModalCopy;
        this.filterValueTable = ''
      }
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.haveFile = true;
      this.currentFileName = event.target.files[0].name;
      this.currentFileSize = this.utils.formatBytes(event.target.files[0].size);
    }
    this.file = event.target.files[0];
  }
  descargarTabla(nombre: string | undefined, formato: string | undefined, index: number): void {
    // Filtrar los datos según el nombre del archivo
    let data = this.dataEvaluda.filter((element) => element.nombreFile == nombre && element.id == index);
    let registros: any[] = [];
    data = data.filter((element) => {
      registros.push(element.registro);
    });
    const tabla: Object[][] = [
      [this.key[index][0]] // Encabezado de la tabla
    ];
    // Añadir las keys restantes a la matriz 'tabla'
    for (let i = 1; i < this.key[index].length; i++) {
      tabla[0].push(this.key[index][i]);
    }
    // Generar filas de datos
    registros.forEach((element) => {
      const fila: any[] = [];
      for (let i = 0; i < this.key[index].length; i++) {
        const key = this.key[index][i];
        fila.push(element[key]);
      }
      tabla.push(fila);
    });

    let libro: any;
    let archivo: Blob;

    if (formato === 'xlsx') {
      // Crear una hoja de cálculo en formato XLSX
      libro = XLSX.utils.book_new();
      const hoja = XLSX.utils.aoa_to_sheet(tabla);
      // Asignar el encabezado de la tabla
      XLSX.utils.sheet_add_aoa(hoja, tabla, { origin: 'A1' });
      // Agregar la hoja de cálculo al libro
      XLSX.utils.book_append_sheet(libro, hoja, 'Tabla');
      // Generar el archivo XLSX
      const libroExcel = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
      archivo = new Blob([libroExcel], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    } else if (formato === 'csv') {
      // Crear el archivo CSV
      const csv = tabla.map(row => row.join(',')).join('\n');
      archivo = new Blob([csv], { type: 'text/csv' });
    } else if (formato === 'txt') {
      // Crear el archivo TXT
      const txt = tabla.map(row => row.join('\t')).join('\n');
      archivo = new Blob([txt], { type: 'text/plain' });
    } else {
      console.error('Formato de archivo no válido.');
      return;
    }

    // Descargar el archivo
    saveAs(archivo, `${nombre}.${formato}`);
  }



  evaluarLinea(restricciones: IArchivoValidacion[], valores: any[], json: any) {
    // Imprimir los valores y restricciones recibidos
    // console.log(valores);
    // console.log(json)
    // console.log(restricciones);
    this.linea++; // Incrementa el número de línea
    let lineaEvaluda: any[] = [];
    const lineaValida: boolean[] = []; // Lista para indicar si cada celda de la línea es válida o no
    // const evaluacionesCeldas: IMensajeError[] = []; // Lista de evaluaciones de cada celda de la línea
    // Definir el arreglo de propiedades "dato" del modelo TmpDataFile
    const propiedadesDato: string[] = [];
    // Recorrer las restricciones y valores para evaluar cada celda de la línea
    for (let index = 0; index < restricciones.length; index++) {
      propiedadesDato.push(`dato${index + 1}`);
      const restriccion = restricciones[index];
      let valor = valores[index];
      let celdaValida = true; // Variable para indicar si la celda es válida o no
      let evaluacionCelda: IMensajeError = {}; // Objeto para almacenar la evaluación de la celda
      let tipoColumna = ''; // Obtiene el tipo de la columna
      // Evaluar el tipo de dato de la columna
      if (restriccion.dataType == "date") {
        tipoColumna = "date";
        const fechaString = valor;
        const formatoDeseado = "YYYY/MM/DD";
        const esFechaValida = moment(fechaString, formatoDeseado).isValid();
        // console.log(esFechaValida)
        if (esFechaValida) {
          // console.log("La fecha es válida y cumple con el formato deseado.");
        } else {
          celdaValida = false;

          evaluacionCelda = {
            id: this.cantidadExcelEvaludados,
            columna: restriccion,
            descripcion: `Fecha`,
            mensaje: `Fecha inválida (Rectifique el formato) o dato invalido`,
          };
        }
      } else {
        // El tipo de dato de la columna no es "date"
        tipoColumna = typeof valor;
      }
      // Evaluar el tamaño de la celda
      if (restriccion.longMax != null) {
        if (
          (tipoColumna === "string" && valor.length > restriccion.longMax) ||
          (tipoColumna === "number" && valor > restriccion.longMax)
        ) {
          // La longitud de la celda excede el límite permitido
          celdaValida = false;
          evaluacionCelda = {
            id: this.cantidadExcelEvaludados,
            columna: restriccion,
            descripcion: `Longitud de caracteres`,
            mensaje:
              tipoColumna === "string"
                ? `Longitud de la celda inválida, supera la cantidad de caracteres permitidos (${restriccion.longMax})`
                : `Rango de la celda superior al permitido (${restriccion.longMax})`,
          };
        }
      }
      if (
        restriccion.dataType == "int8" ||
        restriccion.dataType == "numeric" ||
        restriccion.dataType == "int2"
      ) {
        // const resultado = parseFloat(valor); // Convierte el valor a un número decimal
        if (isNaN(valor)) {
          // La longitud de la celda excede el límite permitido
          celdaValida = false;
          evaluacionCelda = {
            id: this.cantidadExcelEvaludados,
            columna: restriccion,
            descripcion: `Tipo de dato`,
            mensaje: 'Tipo de la columna invalido'
          };
        }
      }
      // Evaluar si la celda es vacía
      if (!restriccion.nule) {
        if (valor === '' || valor === null || valor === undefined) {
          // La celda está vacía
          celdaValida = false;
          evaluacionCelda = {
            id: this.cantidadExcelEvaludados,
            columna: restriccion,
            descripcion: `Campo nulo`,
            mensaje: `El campo no puede ser vacío`,
          };
        }
      }

      lineaEvaluda.push(json)
      lineaValida.push(celdaValida); // Agrega el resultado de la evaluación de la celda a la lista de celdas válidas/inválidas
      evaluacionCelda["fecha"] = new Date().toLocaleDateString('es-ES', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '/');;
      evaluacionCelda["fila"] = `Linea ${this.linea}`;

      if (!(lineaValida.every((valida) => valida))) {
        this.evaluacionCeldas.push(evaluacionCelda)
        this.evaluacionCeldasCopy = this.evaluacionCeldas;
      } else {
        this.evaluacionesCeldas.push(evaluacionCelda); // Agrega la evaluación de la celda a la lista de evaluaciones de celdas
        this.evaluacionCeldasCopy = this.evaluacionCeldas;
      }
    }

    this.dataEvaluda.push(
      {
        "id": this.cantidadExcelEvaludados,
        "nombreFile": this.plantillaObtenida!.nombre,
        "registro": json,
        "extension": this.extension
      }
    );

    const lineaData: IArchivoDatosError = {
      registro: lineaEvaluda,
      fila: this.linea,
      // fecha: null,
      codigo: `Linea ${this.linea}`,
      tipo: lineaValida.every((valida) => valida) ? "success" : "warning",
      descripcion: lineaValida.every((valida) => valida) ? "Carga exitosa" : "Carga fallida",
      mensajeError: lineaValida.every((valida) => valida) ? "Todas las celdas son válidas" : "Algunas celdas son inválidas",
      evaluacionesCeldas: this.evaluacionesCeldas, // Agrega la lista de evaluaciones de celdas al objeto de datos de línea
    };

    if (lineaValida.every((valida) => valida)) {
      this.dataValidos.push(lineaData); // Agrega los datos de línea a la lista de líneas válidas
      this.cargados++; // Incrementa el contador de cargados exitosos
    } else {
      this.dataInvalidos.push(lineaData); // Agrega los datos de línea a la lista de líneas inválidas
      this.fallidos++; // Decrementa el contador de cargados fallidos
    }
    // Crear objeto de validación con las celdas guardadas en las propiedades "dato"
    // this.plantillaObtenida!.id
    const validacion: TmpDataFile = {
      idFIle: this.plantillaObtenida!.id,
      user: this.username,
      state: lineaValida.every((valida) => valida) ? true : false
    };
    for (let i = 0; i < valores.length; i++) {
      const propiedad = propiedadesDato[i];
      validacion[propiedad] = valores[i];
    }

    this.dataPlantilla.push(validacion)
  }


  validarArchivos(jsonData: any, restriciones: IArchivoValidacion[]) {
    console.log(jsonData)
    let keys = false;
    for (let index = 0; index < jsonData.length; index++) {
      const data = Object.values(jsonData[index]);
      for (let j = 0; j < restriciones.length; j++) {
        this.evaluarLinea(restriciones, data, jsonData[index])
        if (!keys) {
          this.key.push(Object.keys(jsonData[index]))
          keys = true;
        }
        break;
      }
    }

    this.totalRegistro = jsonData.length;
    if (this.totalRegistro == 0) {
      this.utils.openInfoAlert("Este archivo no contiene valores para evaluar")
    } else {
      this.listOfData = [
        ...this.listOfData, // Conserva los datos anteriores
        {
          nombre: this.plantillaObtenida!.nombre,
          fechaSubida: new Date(),
          totalRegistros: this.totalRegistro,
          cargados: this.cargados,
          fallidos: this.fallidos,
          usuario: this.username,
          extension: this.extension,
          active: true
        }
      ];
      // this.listOfData = this.listOfData.sort((a: IArchivoDatosEnvio, b:IArchivoDatosEnvio) => (a.fechaSubida!.valueOf() > b.fechaSubida!.valueOf() ? -1 : 1));
      // console.log(this.listOfData)
      // this.listOfData.push(
      //   {
      //     nombre: this.plantillaObtenida!.nombre,
      //     fechaSubida: new Date(),
      //     totalRegistros: this.totalRegistro,
      //     cargados: this.cargados,
      //     fallidos: this.fallidos,
      //     usuario: this.username,
      //     extension: this.extension
      //   })
      this.listOfDataCopy = this.listOfData;
      // console.log("Total Registros ->" + this.totalRegistro)
      // console.log("Total Cargados ->" + this.cargados)
      // console.log("Total Fallidos ->" + this.fallidos)
    }
  }

  validarColumnas(header: string[]): boolean {
    return header.length == this.restriciones.length
  }

  leerArchivos(fileExtension: string, file: File, separador: string): any {
    const columnasValidas = true;
    switch (fileExtension) {
      case 'xlsx': {
        // console.log(fileExtension);
        return new Promise((resolve, reject) => {
          const reader: FileReader = new FileReader();

          reader.onload = (e: any) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
            const header = jsonData[0]; // Obtener la primera fila como encabezado
            // Validamos columnas
            if (!this.validarColumnas(header)) {
              this.utils.openInfoAlert("No se pudo evaluar el documento no cuenta con las misma cantida de columnas")
              return;
            }

            const result: any[] = [];
            for (let i = 1; i < jsonData.length; i++) { // Iterar a través de las filas de datos (omitir la primera fila que es el encabezado)
              const row = jsonData[i];
              const obj: any = {};

              for (let j = 0; j < header.length; j++) { // Iterar a través de las columnas y asignar los valores a las propiedades del objeto
                const key = header[j];
                const value = row[j];
                obj[key] = value;
              }
              result.push(obj); // Agregar el objeto al resultado final
            }
            console.log(result)
            this.dataTabla = result;
            resolve(result);
          };

          reader.onerror = (e) => {
            reject(e);
          };

          reader.readAsArrayBuffer(file);
        });
      }
      case 'csv': {
        // console.log(fileExtension);
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const contents = e.target!.result as string; // Obtener el contenido del archivo como una cadena de texto
            const lines = contents.split('\n'); // Dividir el contenido en líneas
            const header = lines[0].split(separador); // Obtener la primera línea como encabezado
            const result: any[] = [];

            if (!this.validarColumnas(header)) {
              this.utils.openInfoAlert("No se pudo evaluar el documento no cuenta con las misma cantida de columnas")
              return;
            }

            for (let i = 1; i < lines.length - 1; i++) { // Iterar a través de las líneas de datos (omitir la primera línea que es el encabezado)
              const line = lines[i];
              const row = line.split(separador);

              const obj: any = {};
              for (let j = 0; j < header.length; j++) { // Iterar a través de las columnas y asignar los valores a las propiedades del objeto
                const key = header[j];
                const value = row[j];
                obj[key] = value;
              }
              result.push(obj); // Agregar el objeto al resultado final
            }
            resolve(result)
          };
          reader.onerror = (error) => {
            reject(error);
          };

          reader.readAsText(file);
        })
      }
      case 'txt': {
        // console.log(fileExtension);
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const contents = e.target!.result as string;
            const rows = contents.split("\n"); // Dividir el contenido por saltos de línea para obtener filas individuales
            const headers = rows[0].split(separador); // Obtener los encabezados de la primera fila
            headers.pop();
            rows.pop();

            if (!this.validarColumnas(headers)) {
              this.utils.openInfoAlert("No se pudo evaluar el documento no cuenta con las misma cantida de columnas")
              return;
            }
            const jsonData: any[] = [];

            for (let i = 1; i < rows.length - 1; i++) {
              const values = rows[i].split(separador); // Obtener los valores de cada fila
              const rowObject = {};

              for (let j = 0; j < headers.length; j++) {
                rowObject[headers[j]] = values[j]; // Asignar los valores a las claves correspondientes
              }

              jsonData.push(rowObject); // Agregar el objeto de fila al arreglo de datos JSON
            }

            resolve(jsonData);
          };

          reader.onerror = (error) => {
            reject(error);
          };

          reader.readAsText(file);
        });
      }
      default: {
        console.log("Esta extensión no está disponible");
      }
    }
  }

  async handleFile() {
    // Linea que cuenta la linea del excel
    this.cantidadExcel = 1;
    this.linea = 1;
    this.totalRegistro = 0;
    this.dataValidos = [];
    this.dataInvalidos = [];
    this.cargados = 0;
    this.fallidos = 0;
    // this.username = '';
    // this.dataEvaluda = [];
    // PLANTILLA
    // plantillaObtenida!: IPlantillas;
    // plantillaEnviada!: TmpTemplate;
    this.dataPlantilla = [];
    this.evaluacionesCeldas = [];
    // this.evaluacionCeldas = [];
    // this.evaluacionCeldasCopy = [];
    const inputElement = document.getElementById('fileInput') as HTMLInputElement; // Obtener el elemento de entrada de archivo por su id
    if (inputElement.files && inputElement.files.length > 0) { // Verificar si se ha seleccionado un archivo
      const file = inputElement.files[0]; // Obtener el primer archivo seleccionado
      const fileNameParts = file.name.split('.'); // Dividir el nombre del archivo en partes separadas por punto
      this.extension = fileNameParts[fileNameParts.length - 1]; // Obtener la última parte como la extensión

      // Buscamos la plantilla que tenga el mismo nombre para obtener los datos
      const plantilla: IPlantillas | undefined = this.templates.find((element) => element.nombre == fileNameParts[0])
      this.plantillaObtenida = plantilla!;
      if (!this.plantillaObtenida) {
        this.utils.openInfoAlert("Este archivo no está disponible para evaluación")
        return;
      }
      this.restriciones = await this.api.getListPlantillasConfig(`${this.utils.getFilesEndpoint(`listFieldsConfigTemplate/${plantilla!.id}`)}`);
      try {
        const jsonData = await this.leerArchivos(this.extension, file, this.plantillaObtenida.separador);
        this.validarArchivos(this.dataTabla, this.restriciones)
        inputElement.value = ''; // Restablecer el valor a una cadena vacía
      } catch (error) {
        console.error("Error al parsear el archivo CSV:", error);
      }
    } else {
      this.utils.openErrorAlert("Debe selecionar un archivo para cargar")
    }
    this.plantillaEnviada = {
      nombre: this.plantillaObtenida!.nombre,
      fecha: new Date(),
      estado: this.fallidos <= 0 ? true : false
    }
    this.fallidosList.push(this.fallidos)
    // console.log(this.dataPlantilla)
    // console.log(this.plantillaEnviada)
    // console.log(this.dataValidos);
    // console.log(this.dataInvalidos);
    // console.log(this.dataEvaluda)
    // console.log(this.evaluacionCeldas)
    this.linea = 1;
    this.totalRegistro = 0;
    this.cantidadExcelEvaludados++;
    this.savePlantilla();
    this.currentFileName = '';
    this.currentFileSize = '';
    this.haveFile = false;
  }

  uploadFile(data, index: number) {
    this.api.updatePlantilla(`${this.utils.getFilesEndpoint2(`change-status/tmp-file/${this.plantillaObtenidaBack[index].id}`)}`, data.active)
      .subscribe(
        {
          next: (value: any) => {
            console.log(value)
          },
          error: (err: any) => {
            console.log(err)
          }
        }
      )
  }

  openModal(index: number, nombre: string | undefined, formato: string | undefined, i: number) {
    this.descargarData = {
      nombre: nombre,
      formato: formato,
      index: i
    }
    // console.log(this.evaluacionCeldas)
    this.evaluacionCeldasModal = this.evaluacionCeldas.filter((element: IMensajeError) => element.id == index)
    this.evaluacionCeldasModalCopy = this.evaluacionCeldasModal;
    this.isVisible = true;
  }
  async downloadTemplate() {
    const api = await this.api.getListPlantillas(`${this.utils.getFilesEndpoint(`listConfigFile`)}`)
    const plantilla: any = api.find((element) => element.name == this.templateSelect.nombre)
    this.extension = String(plantilla.format).toLowerCase()

    switch (this.extension) {
      case 'xls': {
        this.api.downloadPlantillas(`${this.utils.getFilesEndpoint2(`downloadtemplate/${this.templateSelect.id}`)}`, this.templateSelect.nombre, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
          .subscribe({
            next: (value: Blob) => {
              const url = window.URL.createObjectURL(value);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${plantilla.name}.${this.extension}x`;
              link.click();
              window.URL.revokeObjectURL(url);
            },
            error: (err: any) => {
              console.error('Error al descargar la plantilla:', err);
            }
          });
        break;
      }
      case 'csv': {
        this.api.downloadPlantillas(`${this.utils.getFilesEndpoint2(`downloadtemplate/${this.templateSelect.id}`)}`, this.templateSelect.nombre, 'text/csv')
          .subscribe(
            {
              next: (value: Blob) => {
                // Procesa el archivo Blob descargado
                const url = window.URL.createObjectURL(value); // Crea un URL del Blob descargado
                const link = document.createElement('a'); // Crea un elemento <a> en el DOM
                link.href = url; // Establece el atributo href del enlace con el URL del Blob
                link.download = `${plantilla.name}.${this.extension}`; // Establece el atributo download del enlace con el nombre de archivo
                link.click(); // Simula un clic en el enlace para iniciar la descarga del archivo
                window.URL.revokeObjectURL(url); // Libera el URL del Blob después de la descarga
              },
              error: (err: any) => {
                // Maneja errores en la descarga
                console.error('Error al descargar la plantilla:', err);
              }
            }
          );
        break;
      }
      case 'txt': {
        this.api.downloadPlantillas(`${this.utils.getFilesEndpoint2(`downloadtemplate/${this.templateSelect.id}`)}`, this.templateSelect.nombre, 'text/csv')
          .subscribe({
            next: (value: Blob) => {
              console.log(value)
              const url = window.URL.createObjectURL(value);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${plantilla.name}.${this.extension}`;
              link.click();
              window.URL.revokeObjectURL(url);
            },
            error: (err: any) => {
              console.error('Error al descargar la plantilla:', err);
            }
          });
        break;
      }
    }
  }

  async loadPlantillas() {
    const resp = await this.api.getListPlantillas(`${this.utils.getBasicEndPoint(`plantilla/listar-plantillas`)}`);
    if (resp.status === this.utils.successMessage) {
      resp.data.plantillas.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.nombre > b.nombre) {
          return 1;
        } else {
          return 0;
        }
      });
      this.templates = resp.data.plantillas;
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async savePlantilla() {
    this.subscription = this.api.createdPlantillas(`${this.utils.getFilesEndpoint2(`create/tmp-template`)}`, this.plantillaEnviada)
      .subscribe(
        {
          next: (value: TmpTemplate) => {
            this.dataPlantilla.forEach((element, index) => {
              this.dataPlantilla[index]['idFIle'] = value.id;
            })
            console.log(this.dataPlantilla)
            this.plantillaObtenidaBack.push(value)
            this.subscription = this.api.subirPlantillas(`${this.utils.getFilesEndpoint2(`upload/tmp-data`)}`, this.dataPlantilla)
              .subscribe(
                {
                  next: (value: any) => {
                  },
                  error: (err: any) => {
                  }
                }
              )

          },
          error: (err: any) => {
            console.log(err)
          }
        }
      )
  }
}
