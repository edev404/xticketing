import { Component, Input, OnInit } from '@angular/core';
import { PassengerAdminApiService } from 'src/app/modules/clientes/service/passenger.admin.api.service';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';
import { ManageService } from 'src/app/modules/descuentos/models/modelManager';
import { IDiscount } from 'src/app/modules/descuentos/models/modulos';
import { ServiceRateService } from 'src/app/modules/tarifas/service/service-rate.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Component({
  selector: 'app-discount-passenger',
  templateUrl: './discount-passenger.component.html',
  styleUrls: ['./discount-passenger.component.scss']
})
export class DiscountPassengerComponent implements OnInit {

  // Paginado
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  page: number = 1;
  numberRow: number = 5;


  @Input() dataTable!: IDiscount[];
  @Input() btnProperties!: any[];
  dataTableCopy!: IDiscount[];
  filterValue!: string;

  // @ViewChild('modalDetailDiscount') modalDetailDiscount;

  // Columnas de la tabla
  tableColumn = [
      { id: 1, name: 'Identificador del descuento',   field: 'id',               class: 'center w11-em',  value: true },
      { id: 2, name: 'Servicio',                      field: 'nameService',      class: 'center',         value: true },
      { id: 3, name: 'Descuento',                     field: 'name',             class: '',               value: true },
      { id: 4, name: 'Vigencia',                      field: 'dateInit',         class: '',               value: true },
  ];

  // objects
  discountSend:  any = {
    geographi : [],
    checkOptionsOne : [
      { label: 'Lunes', value: 'Lunes', checked: false },
      { label: 'Martes', value: 'Martes', checked: false },
      { label: 'Miercoles', value: 'Miercoles', checked: false },
      { label: 'Jueves', value: 'Jueves', checked: false },
      { label: 'Viernes', value: 'Viernes', checked: false },
      { label: 'Sabado', value: 'Sabado', checked: false },
      { label: 'Domingo', value: 'Domingo', checked: false },
      { label: 'Festivos', value: 'Festivos', checked: false },
    ],
    userTerm: {
      bornLocation: {city: {}, country: {}, department: {}},
      residenceLocation: {city: {}, country: {}, department: {}},
    },
    timeTerm: { alwaysHours: true, rangeHours: false, days:"" }
  };;
  servicesList!: ManageService[];
  days: any[] = [];
  professionsList;
  countryIdBornPlaceList;
  countryIdResidencePlaceList;
  departmentIdBornPlaceList;
  departmentIdResidencePlaceList;
  municipalyIdBornPlaceList;
  municipalyIdResidencePlaceList;

  zones: [] = [];
  // Configuración para el selectMultiple
  dropdownSettings = {
    singleSelection: false,
    selectAllText: 'Seleccionar todo',
    unSelectAllText: 'Desmarcar todo',
    idField: 'id',
    textField: 'nombre',
    searchPlaceholderText: 'Buscar zona',
    allowSearchFilter: true,
    noDataAvailablePlaceholderText: 'No hay zonas existentes',
    itemsShowLimit: 5
  };

  // PAGINATION
  pageactual = 1;
  maxRow = 5;

  // Ordenar Ascendente y Descendente
  isAsc: boolean = false;
  propertyCopy: string = '';

  DISTCOUNT_PATH = 'discounts';

  // permission
  changeState;
  view;
  edit;

  constructor(
    public utils: UtilsService,
    private api: PassengerAdminApiService,
    private _api: DescuentosService,) {
    this.initObject();
  }

  initObject() {
    // this.discountSend = {
    //   geographi : [],
    //   userTerm: {
    //     bornLocation: {city: {}, country: {}, department: {}},
    //     residenceLocation: {city: {}, country: {}, department: {}},
    //   },
    //   timeTerm: { alwaysHours: true, rangeHours: false }
    // };
  }

  async ngOnInit() {
    this.loadDays();
    this.loadMasterSetting();
  }

    // Paginado met
    onChangeRowPerPage(event: number): void {
      this.numberRow = event;
      this.page = 1;
    }
  
    onChangePage(event: number): void {
      this.page = event;
    }

  search() {
    if (!this.dataTableCopy) {
      this.dataTableCopy = this.dataTable;
    }
    let data;
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.dataTableCopy.filter(
        (current) => {
          return  this.utils.validateObject(current.id) && current.id!
                    .toString()
                    .toUpperCase()
                    .includes(this.filterValue.toUpperCase()) ||
                  this.utils.validateObject(current.name) && current.name!
                    .toUpperCase()
                    .includes(this.filterValue.toUpperCase()) ||
                  this.utils.validateObject(current.nameService) && current.nameService!
                    .toUpperCase()
                    .includes(this.filterValue.toUpperCase()) ||
                  this.utils.validateObject(current.dateInit) && current.dateInit!
                    .toString()
                    .includes(this.filterValue) ||
                  this.utils.validateObject(current.datEnd) && current.datEnd!
                    .toString()
                    .includes(this.filterValue);
      }
      );
      if (data) {
        this.dataTable = data;
      }
    } else {
      if (this.dataTableCopy) {
        this.dataTable = this.dataTableCopy;
        // this.dataTableCopy = undefined;
      }
    }
  }

  orderColumn(property: string) {
    if (this.propertyCopy !== '' && this.propertyCopy !== property) {
      this.isAsc = false;
    }
    if (!this.isAsc) {
      this.isAsc = true;
      this.dataTable.sort((a, b) => a[`${property}`].toString().toLowerCase() < b[`${property}`].toString().toLowerCase() ? -1 :
                                    a[`${property}`].toString().toLowerCase() > b[`${property}`].toString().toLowerCase() ? 1 : 0);
    } else {
      this.isAsc = false;
      this.dataTable.sort((a, b) => a[`${property}`].toString().toLowerCase() < b[`${property}`].toString().toLowerCase() ? 1 :
                                    a[`${property}`].toString().toLowerCase() > b[`${property}`].toString().toLowerCase() ? -1 : 0);
    }
    this.propertyCopy = property;
  }

  // DETAILS DISCOUNT

  async viewDiscountDetail(row: IDiscount) {
    const response = await this._api.findById(this.utils.getBasicEndPoint(`${this.DISTCOUNT_PATH}/${row.idDiscount}`));
    
    if (response.status === this.utils.successMessage) {
      this.discountSend = response.data.discount;

      if (this.discountSend.timeTerm.days) {
        this.loadDaysByDiscount(this.discountSend.timeTerm.days);
      }

      if (this.discountSend.geographi) {
        this.discountSend.geographi = JSON.parse(response.data.discount.geographi);
      }

      if (!this.discountSend.userTerm.bornLocation) {
        this.discountSend.userTerm.bornLocation = {city: {}, country: {}, department: {}};
      }

      if (!this.discountSend.userTerm.residenceLocation) {
        this.discountSend.userTerm.residenceLocation = {city: {}, country: {}, department: {}};
      }
      if (this.discountSend.userTerm.bornLocation.country.id) {
        await this.loadDepartmentCombo(this.discountSend.userTerm.bornLocation.country.id, 'born');
        await this.loadCityCombo(this.discountSend.userTerm.bornLocation.department.id, 'born');
        this.discountSend.userTerm.bornLocation.department.id = String(this.discountSend.userTerm.bornLocation.department.id)
        this.discountSend.userTerm.bornLocation.city.id = String(this.discountSend.userTerm.bornLocation.city.id)
      }
      if (this.discountSend.userTerm.residenceLocation.country.id) {
        await this.loadDepartmentCombo(this.discountSend.userTerm.residenceLocation.country.id, 'residence');
        await this.loadCityCombo(this.discountSend.userTerm.residenceLocation.department.id, 'residence');
        this.discountSend.userTerm.residenceLocation.department.id = String(this.discountSend.userTerm.residenceLocation.department.id)
        this.discountSend.userTerm.residenceLocation.city.id = String(this.discountSend.userTerm.residenceLocation.city.id)
      }

      // this.modalDetailDiscount.show();

    } else if (response.showAlert){
      await this.utils.openErrorAlert(response.message);
    }

  }

  async loadDepartmentCombo(value, type) {
    
    const response = await this.api.getDepartments(this.utils.getBasicEndPoint(`masters/departments?countryId=${value}`));
    
    if (response.status === this.utils.successMessage) {
      if (type === 'born') {
        this.departmentIdBornPlaceList = response.data.departments;
      } else {
        this.departmentIdResidencePlaceList = response.data.departments;
      }
    }
  }

  async loadCityCombo(value, type) {
    
    const response = await this.api.getCities(this.utils.getBasicEndPoint(`masters/cities?departmentId=${value}`));
    
    if (response.status === this.utils.successMessage) {
      if (type === 'born') {
        this.municipalyIdBornPlaceList = response.data.cities;
      } else {
        this.municipalyIdResidencePlaceList = response.data.cities;
      }
    }
  }

  async loadDays() {
    this.days = [
      { name: 'Lunes', value: false },
      { name: 'Martes', value: false },
      { name: 'Miércoles', value: false },
      { name: 'Jueves', value: false },
      { name: 'Viernes', value: false },
      { name: 'Sábado', value: false },
      { name: 'Domingo', value: false },
      { name: 'Festivos', value: false }
    ];
  }

  loadDaysByDiscount(daysParams: string){
    if (!daysParams) return;
    const daysArray = daysParams.split(',');
    this.days = daysArray.map((res, index) => {
      const resValue = parseInt(res);
      return { name: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Festivos'][index], value: resValue };
    });
  }

  async loadMasterSetting() {
    
    let response = await this.api.getOccupations(this.utils.getBasicEndPoint(`masters/occupations`));
    
    if (response.status === this.utils.successMessage) {
      this.professionsList = response.data.occupations;
    }
    
    response = await this.api.getCountries(this.utils.getBasicEndPoint('masters/countries'));
    
    if (response.status === this.utils.successMessage) {
      this.countryIdBornPlaceList = response.data.countries;
      this.countryIdResidencePlaceList = response.data.countries;
    }
    
    const servicesAccess = JSON.parse(localStorage.getItem('selectedEntity')!);
    
    if (servicesAccess){
      const services = servicesAccess.services;
      if (services) {
        let hash = {};
        this.servicesList = services.filter((service: ManageService) => service.active == true && hash[service.name] ? false : hash[service.name]  = true)
                                    .sort((a,b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase()  > b.name.toLowerCase() ? 1 : 0 );
      }
    }
  }

}
