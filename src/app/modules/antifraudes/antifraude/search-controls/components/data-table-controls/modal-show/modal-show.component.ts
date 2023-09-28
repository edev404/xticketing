import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ControlView, ServicioEmpresa, Trazabilidad } from '../../../interfaces/search-controles.interfaces';

@Component({
  selector: 'app-modal-show',
  templateUrl: './modal-show.component.html',
  styleUrls: ['./modal-show.component.scss']
})
export class ModalShowComponent {

  /** Detalle del control */
  controlDetalle!: ControlView | undefined;

  /** Objeto para mostrar en la tabla */
  listOfEmpresasServicios: ServicioEmpresa[] = [];

  /** Objeto para mostrar en la tabla */
  listOfTrazabilidad: Trazabilidad[] = [];

  // Variable para abrir modal 
  @Input() isModalShow: boolean = false;

  // Emisión de eventos (cerrar modal)
  @Output() onCloseModalShow = new EventEmitter();
  
  /** Objeto fraudes enviado desde el componente padre para llenar el formulario */
  @Input() set controlDetalleInput(controlDetalle: ControlView | undefined) {
    if (!controlDetalle) return;
    this.controlDetalle = controlDetalle;
    /** Llenar datos de servicios, empresa y trazabilidad */
    if (controlDetalle.servicioEmpresa)
      this.listOfEmpresasServicios = controlDetalle.servicioEmpresa;
    if (controlDetalle.trazabilidad)
      this.listOfTrazabilidad = controlDetalle.trazabilidad;
  }

  /** Cerrar modal */
  closeModal(): void {
    /** Limpiar objetos de tablas */
    this.controlDetalle = undefined;
    this.listOfEmpresasServicios = [];
    this.listOfTrazabilidad = [];
    this.onCloseModalShow.emit();
  }

}
