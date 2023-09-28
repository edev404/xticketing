import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Grupo } from '../../../../interfaces/fraude.interfaces';

@Component({
  selector: 'app-modal-show-grupo',
  templateUrl: './modal-show-grupo.component.html',
  styleUrls: ['./modal-show-grupo.component.scss', '../../../../../../../../assets/themes/white/core/_formulario.scss']
})
export class ModalShowGrupoComponent {

  // Variable para abrir modal 
  @Input() isModalShowGrupo: boolean = false;

  /** Paginación */

  /** Página inicial */
  page: number = 1;

  /** Variable para definir límite de 5 registros por página. */ 
  numberRow: number = 5;

  /** Registros por paginas */
  tableSizes = [5, 10, 15, 20, 30, 50, 100];

  // Emisión de eventos (cerrar modal)
  @Output() onCloseModalShowGrupo = new EventEmitter();

  /** Formulario reactivo */
  form!: FormGroup;

  /** Objeto grupo fraudes enviado desde el componente padre para llenar el formulario */
  @Input() set grupoFraudeDetalle(grupoFraudeDetalle: Grupo | undefined) {
    if (!grupoFraudeDetalle) return;
    this.form.disable();
    this.form.reset(grupoFraudeDetalle);
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      // Grupo
      id:                  [ ],
      nombre:              [ ],
      analista:            [ ],
      criterio_agrupacion: [ ],
      observacion:         [ ],
      // Fraudes
      fraudes:             [ ]
    });
  }

  /** Cerrar modal */
  closeModal(): void {
    this.form.reset();
    this.onCloseModalShowGrupo.emit();
  }

  /** Cambiar de página */
  onChangePage(event: number): void {
    this.page = event;
  }  

  /** Cambiar el tamaño de filas por página */
  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }  

}
