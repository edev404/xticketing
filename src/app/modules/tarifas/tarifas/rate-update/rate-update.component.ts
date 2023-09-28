import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceRateService } from '../../service/service-rate.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { RateDetailModel, ServicesRateModel, Tarifas } from '../../models/tarifas';
import { NzTimePickerComponent } from 'ng-zorro-antd/time-picker';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { filter } from 'rxjs';

@Component({
  selector: 'app-rate-update',
  templateUrl: './rate-update.component.html',
  styleUrls: ['./rate-update.component.scss']
})
export class RateUpdateComponent implements OnInit {
  @ViewChild('timePicker', { static: false }) timePicker!: NzTimePickerComponent;
  validateForm!: FormGroup;
  time1!: Date | null;
  time2!: Date | null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);

  button: string = 'Agregar';
  monto!: string | null;
  montoFormateado!: string | null;

  rateServicesForm: ServicesRateModel = new ServicesRateModel();
  rateDetailForm: RateDetailModel = {};

  listaDias: any[] = [];
  listOfData: any[] = [];
  charactsList: any[] = [];
  valuesCharactsList1: any[] = [];
  valuesCharactsList2: any[] = [];
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  page: number = 1;
  numberRow: number = 5;
  idTarifa!: number;
  idDetailTarifa!: number;
  rateServiceId!: number;

  serviceRoute: any;

  cities;
  zones;
  caracterOne;
  caracterTwo;

  inputFeaturesError!: boolean;
  haveRoutes!: boolean;
  routeDisable: boolean = false;
  timeError: boolean = false;
  daysError: boolean = false;
  haveZonesCoberturas: boolean = false;
  diasOff!: boolean;

  allChecked = false;
  indeterminate = true;
  dias = [
    { label: 'L', value: 'L', checked: false },
    { label: 'M', value: 'M', checked: false },
    { label: 'M', value: 'M', checked: false },
    { label: 'J', value: 'J', checked: false },
    { label: 'V', value: 'V', checked: false },
    { label: 'S', value: 'S', checked: false },
    { label: 'D', value: 'D', checked: false },
    { label: 'F', value: 'F', checked: false },
  ];

  // Fechas zonas horarias
  listaFechaInicial: string[] = [];
  listaFechaFinal: string[] = [];
  // Listas de consumo 
  listaConsumoInicial: number[] = [];
  listaConsumoFinal: number[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private api: ServiceRateService,
    private util: UtilsService,
    private datePipe: DatePipe,
  ) {
    this.validateForm = this.fb.group({
      ruta: [null, [Validators.required]],
      zonainicial: [null, [Validators.required]],
      zonafinal: [null, [Validators.required]],
      caracteristica1: [null],
      caracteristica2: [null],
      valortarifa: [null, [Validators.required]],
      rangoconsumo1: [null],
      rangoconsumo2: [null],
    });
  }

  /**
 * Valida si una hora específica está dentro de uno de los rangos de horas especificados.
 * @param horaAValidar - Hora que se desea validar en formato 'HH:mm:ss'.
 * @param horaInicioRango - Arreglo de horas de inicio de cada rango en formato 'HH:mm:ss'.
 * @param horaFinRango - Arreglo de horas de fin de cada rango en formato 'HH:mm:ss'.
 * @returns `true` si la hora a validar está dentro de al menos uno de los rangos, de lo contrario, devuelve `false`.
 * @throws Error - Si hay algún error al intentar analizar las horas en formato incorrecto.
 */
  validarFechaEnRango(horaAValidar: string, horaInicioRango: string[], horaFinRango: string[]): boolean {
    let rangoDias: boolean[] = [];
    let fechasDias: boolean[] = [];
    try {
      const horaAValidarObj = moment(horaAValidar, 'HH:mm:ss');

      for (let index = 0; index < horaInicioRango.length; index++) {
        const horaInicioRangoObj = moment(horaInicioRango[index], 'HH:mm:ss');
        const horaFinRangoObj = moment(horaFinRango[index], 'HH:mm:ss');

        if (horaAValidarObj.isBetween(horaInicioRangoObj, horaFinRangoObj, null, '[]')) {
          fechasDias.push(true);
        }
        for (let j = 0; j < this.rateDetailForm.dias!.length; j++) {
          if (this.listaDias[0][j] == 1) {
            if (this.listaDias[0][j] == this.rateDetailForm.dias![j]) {
              rangoDias.push(true);
            }

          }
        }
      }
      if (fechasDias.length > 0 && rangoDias.length == 0) {
        return false;
      }
      else if (fechasDias.length == 0 && rangoDias.length > 0) {
        return true;
      }
      else if (fechasDias.length > 0 && rangoDias.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      // Manejo de errores si el formato de las horas es incorrecto
      console.error("Error: Asegúrate de usar el formato 'HH:mm:ss' para las horas.");
      return false;
    }
  }

  validarRangoConsumo(rangoValidar: number, rangosInicalesValidar: number[], rangosFinalesValidar: number[]): boolean {
    let rangoDias: boolean[] = [];
    let fechasDias: boolean[] = [];
    try {
      for (let index = 0; index < rangosInicalesValidar.length; index++) {
        if (rangoValidar >= rangosInicalesValidar[index] && rangoValidar <= rangosFinalesValidar[index]) {
          fechasDias.push(true);
        }
        for (let j = 0; j < this.rateDetailForm.dias!.length; j++) {
          if (this.listaDias[0][j] == 1) {
            if (this.listaDias[0][j] == this.rateDetailForm.dias![j]) {
              rangoDias.push(true);
            }

          }
        }
      }
      if (fechasDias.length > 0 && rangoDias.length == 0) {
        return false;
      }
      else if (fechasDias.length == 0 && rangoDias.length > 0) {
        return true;
      }
      else if (fechasDias.length > 0 && rangoDias.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      // Manejo de errores si el formato de las horas es incorrecto
      console.error("Error");
      return false;
    }
  }

  async ngOnInit() {
    this.rateServiceId = parseInt(this.route.snapshot.paramMap.get('rate')!); // ID DE TARIFA
    const entity = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (entity) { // SI ENTIDDA NO ES VACIA
      const idEntity = entity.entities[0].id;
      this.rateDetailForm.dias = [0, 0, 0, 0, 0, 0, 0, 0];
      // LLAMADA API PARA OBTERNE EL SERVICE FORM
      const resp = await this.api.getList(this.util.getBasicEndPoint(`fareServices/${idEntity}/fareServicesAll`));
      this.rateServicesForm = await resp.data.service.find((services) => services.id === this.rateServiceId);
      await this.loadRuotes(this.rateServicesForm);
      this.setDisabled(this.rateServicesForm);
      // COMPRUEBA SI TIENE LAS CARRACTERISTICAS
      if (this.rateServicesForm.characteristicFirst || this.rateServicesForm.characteristicSecond) {
        this.loadValuesCharactsList(this.rateServicesForm, idEntity);
      }
      await this.loadDetailRates(this.rateServiceId);
      this.util.señalesSelectEntityBehavior(true);
    }
  }

  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }

  updateAllChecked(event): void {
    if (event) {
      this.dias.forEach((element, i) => {
        this.dias[i]['checked'] = true;
      })
    } else {
      this.dias.forEach((element, i) => {
        this.dias[i]['checked'] = false;
      })
    }
  }

  updateSingleChecked(event): void {
    // 
  }

  createRateDetailForm(form) {
    this.rateDetailForm.rute = this.cities.find(e => e.id == form.value.ruta);
    this.rateDetailForm.zoneInitial = form.value.zonainicial;
    this.rateDetailForm.zoneFinal = form.value.zonafinal;
    this.rateDetailForm.featuresOne = form.value.caracteristica1;
    this.rateDetailForm.featuresTwo = form.value.caracteristica2;
    this.rateDetailForm.horaria_desde = this.time1!.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).split('.')[0];
    this.rateDetailForm.horaria_hasta = this.time2!.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).split('.')[0];
    this.rateDetailForm.rango_ini = form.value.rangoconsumo1;
    this.rateDetailForm.rango_end = form.value.rangoconsumo2;
    this.rateDetailForm.tarifa = form.value.valortarifa;
  }

  createRateUpdateDetail(data, rate) {
    this.rateDetailForm.id = data.id
    this.rateDetailForm.id_rates = this.idTarifa;
    this.rateDetailForm.rute = rate.ruta;
    this.rateDetailForm.zoneInitial = rate.zona_cobertura_inicial;
    this.rateDetailForm.zoneFinal = rate.zona_cobertura_final;
    this.rateDetailForm.featuresOne = rate.caracteristica_adicional;
    this.rateDetailForm.featuresTwo = rate.caracteristica_adicional_segunda;
    this.rateDetailForm.horaria_desde = rate.franja_horaria_inicial;
    this.rateDetailForm.horaria_hasta = rate.franja_horaria_final;
    this.rateDetailForm.rango_ini = rate.rango_consumo_inicial;
    this.rateDetailForm.rango_end = rate.rango_consumo_final;
    this.rateDetailForm.tarifa = rate.valor_tarifa;
    this.rateDetailForm.activa = rate.activa;
  }

  setDisabled(data) {
    let form = this.validateForm;
    if (!this.routeDisable) {
      form.controls['ruta'].disable();
    }
    if (data.type != 'Distancia entre zonas') {
      form.controls['zonainicial'].disable();
      form.controls['zonafinal'].disable();
    }
    if (data.type != 'Tiempo') {
      form.controls['rangoconsumo1'].disable();
      form.controls['rangoconsumo2'].disable();
    }
    if (!data.characteristicFirst) form.controls['caracteristica1'].disable();
    if (!data.characteristicSecond) form.controls['caracteristica2'].disable();
  }

  setEnable(form) {
    form.controls['zonainicial'].enable();
    form.controls['zonafinal'].enable();
    form.controls['rangoconsumo1'].enable();
    form.controls['rangoconsumo2'].enable();
    form.controls['caracteristica1'].enable();
    form.controls['caracteristica2'].enable();
  }

  cancelConfig() {
    this.setEnable(this.validateForm);
    this.router.navigateByUrl('/main/tarifas');
    this.util.señalesSelectEntityBehavior(false);
  }

  async loadValuesCharactsList(data, idEntity) {
    // OBTENER TODAS LAS CARACTERISTICAS DE SERVICIO
    const response = await this.api.getList(this.util.getBasicEndPoint(`characteristicservices/${idEntity}/servicesCharacteristic`));
    if (response.status === this.util.successMessage) {
      this.charactsList = response.data.service;
    } else {
      await this.util.openErrorAlert(response.message);
    }
    // CONFIGURAR LAS LISTAS
    this.charactsList.map(async caracter => {
      // LISTA PARA CARACTERISTICA 1
      if (caracter.name == data.characteristicFirst) {
        const caracterOne = await this.api.getList(this.util.getBasicEndPoint(`characteristicservices/${caracter.id}/servicesListVCharacServices`));
        caracterOne.data.service.map(insert => {
          this.valuesCharactsList1.push(insert);
        })
      }
      // LISTA PARA CARACTERISTICA 2
      if (caracter.name == data.characteristicSecond) {
        this.caracterTwo = caracter.id
        const w = await this.api.getList(this.util.getBasicEndPoint(`characteristicservices/${this.caracterTwo}/servicesListVCharacServices`));
        w.data.service.map(insert => {
          this.valuesCharactsList2.push(insert);
        })
      }
    });
  }

  async loadRuotes(data) {
    this.haveRoutes = false;
    // CARGO LOS SERVICIOSS DE LA TARIFA
    const respService = await this.api.getList(this.util.getBasicEndPoint(`services/${data.idServices}`));
    if (respService.status === this.util.successMessage) {
      var service = respService.data.service;
      if (Number(service.options.split(',')[1])) this.routeDisable = true;
    } else {
      await this.util.openErrorAlert(respService.message);
    }
    // CONFIGURO SEGUN LAS OPCIONES DEL SERVCIO
    let opcionesServicio = service.options.split(',');
    if (opcionesServicio[0] == 1 || data.unity == 'Zonas de cobertura') {// CARGO LAS ZONAS
      this.haveZonesCoberturas = true;
      const coberturas = await this.api.getList(this.util.getBasicEndPoint(`zone/smartZones`));
      if (coberturas.status === this.util.successMessage) {
        this.zones = coberturas.data.service;
      } else {
        await this.util.openErrorAlert(coberturas.message);
      }
    }
    // CRAGO LAS RUTAS
    if (opcionesServicio[1] == 1 || data.unity == 'Zonas de una ruta de transporte') {
      this.haveRoutes = true;
      const rutas = await this.api.getList(this.util.getBasicEndPoint(`companies/${data.company}/routes`));
      if (rutas.status === this.util.successMessage) {
        this.cities = rutas.data.routes;
      } else {
        await this.util.openErrorAlert(rutas.message);
      }
    }
  }

  async loadDetailRates(id: number) {
    this.idTarifa = id;

    const resp = await this.api.getList(this.util.getBasicEndPoint(`detailsFareServices/${id}/detailsFareServicesAll`));
    if (resp.status === this.util.successMessage) {
      let service = resp.data.service;
      let arrayDays;
      this.listOfData = service.map((service) => {
        arrayDays = service.dias.split(",").map(Number);
        this.cities.map(ruta => { if (ruta.code == service.ruta) service.ruta = ruta.name; })

        const fecha_inicial = new Date('2000-01-01T' + service.franja_horaria_inicial.slice(0, 5) + ':00');
        const fecha_final = new Date('2000-01-01T' + service.franja_horaria_final.slice(0, 5) + ':00');

        const json = {
          dias: arrayDays,
          id: service.id,
          zoneInitial: service.zona_cobertura_inicial,
          zoneFinal: service.zona_cobertura_final,
          rute: service.ruta,
          featuresOne: service.caracteristica_adicional,
          featuresTwo: service.caracteristica_adicional_segunda,
          horaria_desde: service.franja_horaria_inicial,
          horaria_hasta: service.franja_horaria_final,
          horaria_desde_format: this.datePipe.transform(fecha_inicial, 'h:mm a'),
          horaria_hasta_format: this.datePipe.transform(fecha_final, 'h:mm a'),
          activa: service.activa,
          rango_ini: service.rango_consumo_inicial,
          rango_end: service.rango_consumo_final,
          tarifa: service.valor_tarifa
        }

        return json;
      })
      this.listOfData.sort((a, b) => b.activa - a.activa);
    } else {
      await this.util.openErrorAlert(resp.message);
    }
  }

  async changeStateModal(data) {
    Swal.fire(this.util.getQuestionModalOptions('¿Está seguro de que desea cambiar el estado de la tarifa para esta ruta?',
      `El estado de la tarifa asociada a esta ruta pasará de estar ${data.activa ? 'activo a inactivo.' : 'inactivo a activo.'} `)).then(async (result) => {
        if (result.isConfirmed) {
          await this.changeState(data);
        } else {
          this.loadDetailRates(this.rateServiceId);
        }
      });
  }

  async changeState(chageState) {
    const response = await this.api.changeState(this.util.getBasicEndPoint(`detailsFareServices/${chageState.id}/change-state`), !chageState.activa);
    if (response.status === this.util.successMessage) {
      await this.util.openSuccessAlert('¡Se ha cambiado el estado correctamente!');
      this.loadDetailRates(this.idTarifa);
    } else if (response.showAlert) {
      await this.util.openErrorAlert(response.message);
    }
  }

  async addDetail() {
    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          if (!this.time2 || !this.time1) this.timeError = true;
        }
      });
      return
    }

    let rutaFinal = '';
    let result;
    let form = this.validateForm;



    this.createRateDetailForm(form);
    let ruta: any[] = [];
    this.rateDetailForm.dias = this.dias.map(item => item.checked ? 1 : 0);
    const lista = this.listOfData.filter((element) => element.id != this.rateDetailForm.id)
    console.log(lista)
    // Agragamos las fechas inciciales y finales al array
    ruta = this.cities.filter((element) => element.id == this.validateForm.value.ruta)
    lista.forEach((element) => {
      if (element.rute == ruta[0].name) {
        this.listaFechaInicial.push(element.horaria_desde)
        this.listaFechaFinal.push(element.horaria_hasta)
        this.listaConsumoInicial.push(element.rango_ini)
        this.listaConsumoFinal.push(element.rango_end)
        this.listaDias.push(element.dias)
      }
    })

    let fechaIn;
    let fechaFin;
    let consumoIn;
    let consumoFin;

    if (this.rateDetailForm) {
      if (this.listaFechaInicial || this.listaFechaFinal) {
        fechaIn = this.validarFechaEnRango(this.rateDetailForm.horaria_desde!, this.listaFechaInicial, this.listaFechaFinal)
        fechaFin = this.validarFechaEnRango(this.rateDetailForm.horaria_hasta!, this.listaFechaInicial, this.listaFechaFinal)
      }

      if (this.listaConsumoInicial || this.listaConsumoFinal) {
        consumoIn = this.validarRangoConsumo(this.rateDetailForm.rango_ini!, this.listaConsumoInicial, this.listaConsumoFinal)
        consumoFin = this.validarRangoConsumo(this.rateDetailForm.rango_end!, this.listaConsumoInicial, this.listaConsumoFinal)
      }
    }
    if (this.rateDetailForm.featuresOne && this.rateDetailForm.featuresTwo && this.rateDetailForm.featuresOne == this.rateDetailForm.featuresTwo) {
      this.inputFeaturesError = true
    } else {
      this.inputFeaturesError = false;
    }

    if (this.dias.filter(item => item.checked == false).length == 8) {
      this.daysError = true;
      return
    }
        
    if (this.time2! < this.time1!) {
      this.util.openErrorAlert('La franja de hora final no puede ser menor a la inicial');
      return
    }

    // if (this.rateDetailForm.rango_ini! > this.rateDetailForm.rango_end!) {
    //   this.util.openErrorAlert('El rango de consumo inicial no puede ser mayor al rango de consumo final');
    //   return
    // }

    // if (this.rateDetailForm.rango_ini! < 0 || this.rateDetailForm.rango_end! < 0) {
    //   this.util.openErrorAlert('El rango de consumo no puede ser menor a cero');
    //   return
    // }

    if (this.rateDetailForm.tarifa! < 0) {
      this.util.openErrorAlert('La tarifa no puede ser menor a cero');
      return
    }

    // if (consumoIn || consumoFin) {
    //   this.util.openErrorAlert('Ya se encuentra este rango de consumo para esta tarifa');
    //   return;
    // }

    if (fechaIn || fechaFin) {
      this.util.openErrorAlert('Ya se encuentra una franja horaria para esta tarifa');
      return;
    }

    if (this.inputFeaturesError) return;
    if (this.rateDetailForm.rute) { rutaFinal = this.rateDetailForm.rute.code; }
    const json = {
      id_tarifa_servicios: this.rateServiceId,
      zona_cobertura_inicial: this.rateDetailForm.zoneInitial,
      zona_cobertura_final: this.rateDetailForm.zoneFinal,
      ruta: rutaFinal,
      caracteristica_adicional: this.rateDetailForm.featuresOne,
      caracteristica_adicional_segunda: this.rateDetailForm.featuresTwo,
      dias: String(this.rateDetailForm.dias),
      franja_horaria_inicial: this.rateDetailForm.horaria_desde,
      franja_horaria_final: this.rateDetailForm.horaria_hasta,
      rango_consumo_inicial: this.rateDetailForm.rango_ini,
      rango_consumo_final: this.rateDetailForm.rango_end,
      valor_tarifa: this.rateDetailForm.tarifa,
      activa: this.rateDetailForm.activa
    }

    if (this.rateDetailForm.id) {
      result = await this.api.update(this.util.getBasicEndPoint(`detailsFareServices/${this.rateDetailForm.id}`), json);
    } else {
      result = await this.api.create(this.util.getBasicEndPoint(`detailsFareServices`), json);
    }
    if (result.status === this.util.successMessage) {
      await this.util.openSuccessAlert(this.rateDetailForm.id ? '¡El detalle de la tarifa ha sido actualizado correctamente!' : '¡El detalle de la tarifa ha sido creado correctamente!').then(() => {
        this.rateDetailForm = {};
        form.reset();
        this.time1 = null;
        this.time2 = null;
        this.dias.map((e) => { e.checked = false });
        this.loadDetailRates(this.rateServiceId);
        this.button = 'Agregar'
      });
    } else if ('error') {
      await this.util.openErrorAlert('¡No se ha podido añadir la configuración al detalle de la tarifa!');
    }
  }

  async updateRate(data) {
    let form = this.validateForm;
    let fecha = new Date();
    let fecha2 = new Date();
    this.button = 'Actualizar'

    this.dias.map(dia => dia.checked = false)
    const rates = await this.api.getList(this.util.getBasicEndPoint(`detailsFareServices/${this.idTarifa}/detailsFareServicesAll`));

    if (rates.status === this.util.successMessage) {
      let arrayDays
      const rate = rates.data.service.find(rate => rate.id == data.id);

      this.idDetailTarifa = rate.id
      this.createRateUpdateDetail(data, rate);

      form.controls['ruta'].setValue(this.cities.find(ruta => ruta.code == this.rateDetailForm.rute).id);
      form.controls['zonainicial'].setValue(rate.zona_cobertura_inicial);
      form.controls['zonafinal'].setValue(rate.zona_cobertura_inicial);
      form.controls['caracteristica1'].setValue(rate.caracteristica_adicional);
      form.controls['caracteristica2'].setValue(rate.caracteristica_adicional_segunda);
      fecha.setHours(rate.franja_horaria_inicial.split(':')[0]);
      fecha.setMinutes(rate.franja_horaria_inicial.split(':')[1]);
      this.time1 = fecha
      fecha2.setHours(rate.franja_horaria_final.split(':')[0]);
      fecha2.setMinutes(rate.franja_horaria_final.split(':')[1]);
      this.time2 = fecha2
      form.controls['valortarifa'].setValue(rate.valor_tarifa);
      form.controls['rangoconsumo1'].setValue(rate.rango_consumo_inicial);
      form.controls['rangoconsumo2'].setValue(rate.rango_consumo_final);


      arrayDays = rate.dias.split(",");
      for (let j = 0; j < arrayDays.length; j++) {
        arrayDays[j] = Number(arrayDays[j]);
      }
      this.rateDetailForm.dias = arrayDays;
      for (let i = 0; i < this.rateDetailForm.dias!.length; i++) {
        if (this.rateDetailForm.dias![i] == 1) {
          this.dias[i].checked = true;
        }
      }

    } else {
      await this.util.openErrorAlert(rates.message);
    }

  }
}
