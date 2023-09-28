import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ControlView } from '../../../../interfaces/search-controles.interfaces';

@Component({
  selector: 'app-detalle-control',
  templateUrl: './detalle-control.component.html',
  styleUrls: ['./detalle-control.component.scss', '../../../../../../../../../assets/themes/white/core/_formulario.scss']
})
export class DetalleControlComponent {

  /** Formulario reactivo */
  form!: FormGroup;

  /** Objeto fraudes enviado desde el componente padre para llenar el formulario */
  @Input() set controlDetalle(controlDetalle: ControlView | undefined) {
    if (!controlDetalle) {
      this.form.reset();
      return;
    }
    this.form.disable();
    this.form.reset(controlDetalle);
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      estado:            [ ],
      codigo:            [ ],
      control:           [ ],
      tipo_control:      [ ],
      componente:        [ ],
      descripcion:       [ ],
      criticidad:        [ ],
      fuente:            [ ],
      deteccion:         [ ],
      accion_resultante: [ ]
    });
  }

}
