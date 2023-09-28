import { Component, OnInit } from '@angular/core';
import { Company } from '../../transporte/models/company';
import { GestionService } from './service/gestion.service';
import { Gestion } from './models/gestion.interface';
import { UtilsService } from '../../../myUtils/utils.service';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss', '../../../../assets/themes/white/core/_formulario.scss']
})
export class GestionComponent implements OnInit {

  listOfData: any[] = [];
  listOfDataCopy: Gestion[] = [];
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  mostrarData: boolean = false;
  filterValueTable: string = ''

  page: number = 0;
  numberRow: number = 5;
  idEmpresa: number = 0;

  dateSelect!: Date;

  selectedCompany: string = '';
  companies: Company[] = []

  constructor(private _gestionService: GestionService, private _utilsService: UtilsService) {
    // Constructor del componente, se inyectan dos servicios como dependencias
  }

  ngOnInit(): void {
    this.getCompany();
    // Método del ciclo de vida: se ejecuta al inicializar el componente
    // Llama al método getCompany() para obtener información sobre la empresa
  }

  search() {
    let data: any[] = [];
    // Inicializa un array vacío para almacenar los datos filtrados

    if (this.filterValueTable || (this.filterValueTable && this.filterValueTable.trim() != '')) {
      // Verifica si filterValueTable existe o no está vacío
      data = this.listOfDataCopy.filter(
        (current: any) => {
          // Filtra listOfDataCopy utilizando la función filter() y una función de filtrado personalizada
          return this._utilsService.validateObject(current.fecha) && current.fecha!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase()) ||
            this._utilsService.validateObject(current.empresa) && current.empresa.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
        }
      );

      if (data) {
        this.listOfData = data;
        // Si se encontraron datos filtrados, actualiza listOfData con esos datos
      }
    } else {
      if (this.listOfDataCopy) {
        this.listOfData = this.listOfDataCopy;
        this.filterValueTable = '';
        // Si filterValueTable está vacío, restaura listOfData a su estado original
      }
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

  // Este método se utiliza para borrar los datos de una lista (listOfData)
  // y restablecerlos a la copia original (listOfDataCopy) si dateSelect no es verdadero.
  // Es decir, si dateSelect es falso, entonces la lista de datos se restaura a su estado original.
  clearData() {
    if (this.dateSelect) return; // Si dateSelect es verdadero, no hacemos nada
    this.listOfData = this.listOfDataCopy; // Restaurar los datos a la copia original
  }


  filterbyDate() {
    // Verifica si 'dateSelect' es falsa (nula o indefinida).
    if (!this.dateSelect) {
      // Si 'dateSelect' es falsa, muestra una alerta indicando que se debe seleccionar una fecha y luego sale de la función.
      this._utilsService.openInfoAlert('Por favor seleccione una fecha');
      return;
    }

    // Filtra los objetos en 'listOfData' utilizando la función 'filter'.
    const resultadosFiltrados = this.listOfData.filter((obj) => {
      // Obtiene la fecha del objeto actual y la formatea utilizando la función 'formatDate' del servicio '_utilsService'.
      let fecha = this._utilsService.formatDate(new Date(obj.fecha));

      // Compara la fecha formateada del objeto actual con la fecha formateada en 'dateSelect'.
      // Si son iguales, el objeto se incluirá en 'resultadosFiltrados'.
      return fecha === this._utilsService.formatDate(this.dateSelect);
    });

    // Reemplaza 'listOfData' con los resultados filtrados.
    this.listOfData = resultadosFiltrados;
  }


  // Define una función llamada setSelectedCompany con tres parámetros: event, page y size, con valores predeterminados de 0 y 6 respectivamente.
  setSelectedCompany(event: any, page: number = 0, size: number = 6) {
    // Asigna el valor de 'event' a la propiedad 'idEmpresa'.
    this.idEmpresa = event;
    if (event) {
      // Si 'event' tiene un valor verdadero (no es nulo o indefinido), realiza lo siguiente:
      // - Llama al servicio '_gestionService.getGestionTrans' con los valores de 'event', 'page' y 'size', y se suscribe a los resultados.
      this._gestionService.getGestionTrans(event, page!, size!).subscribe({
        next: (value: any) => {
          // Cuando se obtiene una respuesta exitosa del servicio, asigna los datos de gestión a 'listOfData'.
          this.listOfData = value.data.gestion;
          // Asigna 'listOfData' a 'listOfDataCopy'.
          this.listOfDataCopy = this.listOfData;
          // Establece 'mostrarData' en verdadero si 'listOfData' tiene elementos; de lo contrario, en falso.
          this.mostrarData = this.listOfData.length > 0 ? true : false;
        },
        error: (err: any) => {
          // En caso de error, registra el error en la consola.
          console.log(err);
        }
      });
      return;
    }
    // Si 'event' es falsa (nula o indefinida), vacía 'listOfData'.
    this.listOfData.length = 0;
    // Establece 'mostrarData' en verdadero si 'listOfData' tiene elementos; de lo contrario, en falso.
    this.mostrarData = this.listOfData.length > 0 ? true : false;
  }

  // Define una función llamada getCompany.
  getCompany() {
    // Obtiene los datos de la empresa desde el almacenamiento local (localStorage).
    const companies = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (companies) {
      // Filtra las empresas activas de tipo 1 (presumiblemente, tipo de empresa) y las asigna a la propiedad 'companies'.
      this.companies = companies.companies.filter(
        (company: Company) => company.active && company.typeId == 1
      );
    }
  }

}
