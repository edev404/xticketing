import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Fraude } from '../../../../interfaces/fraude.interfaces';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-modal-show',
  templateUrl: './modal-show.component.html',
  styleUrls: ['./modal-show.component.scss', '../../../../../../../../assets/themes/white/core/_formulario.scss']
})
export class ModalShowComponent {

  // Variable para abrir modal 
  @Input() isModalShow: boolean = false;

  // Emisión de eventos (cerrar modal)
  @Output() onCloseModalShow = new EventEmitter();

  /** Formulario reactivo */
  form!: FormGroup;

  /** Objeto fraudes enviado desde el componente padre para llenar el formulario */
  @Input() set fraudeDetalle(fraudeDetalle: Fraude | undefined) {
    if (!fraudeDetalle) return;
    /** Formatear fecha con time zone GMT-5 */
    fraudeDetalle.fecha_creacion            = new Date(`${fraudeDetalle.fecha_creacion} GMT-5`);
    fraudeDetalle.fecha_probable_ocurrencia = new Date(`${fraudeDetalle.fecha_probable_ocurrencia} GMT-5`);
    this.form.disable();
    this.form.reset(fraudeDetalle);
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      // Información básica
      fecha_creacion:             [ ],
      fecha_probable_ocurrencia:  [ ],
      estado_anti:                [ ],
      id:             [ ],
      descripcion:    [ ],
      tipo_fraude:    [ ],
      componente:     [ ],
      fuente:         [ ],
      // Información avanzada
      nomUsuario:     [ ],
      riesgo:         [ ],
      impacto:        [ ],
      empresa:        [ ],
      servicio:       [ ]
    });
  }

  /** Cerrar modal */
  closeModal(): void {
    this.form.reset();
    this.onCloseModalShow.emit();
  }

}
