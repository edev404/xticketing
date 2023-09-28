import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// Services
import { FraudesService } from '../../../services/fraudes.service';
import { SearchFraudeService } from '../../../services/search-fraude.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

// Interfaces
import { AsignarFraudeUpdate } from '../../../interfaces/fraudes-acciones';
import { TipoLista } from 'src/app/modules/antifraudes/antifraude/search-controls/interfaces/lists-controls.interfaces';
import { UsuariosFraude } from '../../../interfaces/search-fraude.interfaces';

@Component({
  selector: 'app-modal-asignar-fraude',
  templateUrl: './modal-asignar-fraude.component.html',
  styleUrls: ['./modal-asignar-fraude.component.scss', '../../../../../../../../assets/themes/white/core/_formulario.scss']
})
export class ModalAsignarFraudeComponent implements OnInit {

  // Variable para abrir modal 
  @Input() isModalAsignar: boolean = false;

  /** Variable para obtener todos los IDS de fraudes seleccionados en la tabla */
  @Input() setOfCheckedId = new Set<number>();

  // Lista de usuarios
  @Input() users: UsuariosFraude[] = [];

  // Tipos de prioridad
  @Input() tpPrioridad: TipoLista[] = [];

  // Emisión de eventos (cerrar modal)
  @Output() onCloseModalAsignar = new EventEmitter();

  /** Formulario reactivo */
  form!: FormGroup;

  constructor(private fraudesService: FraudesService,
              private searchFraudeService: SearchFraudeService,
              private utils: UtilsService,
              private fb: FormBuilder) {
    this.form = this.fb.group({
      usuario_asignado: [null, Validators.required ],
      prioridad1      : [null, Validators.required ],
      observacion     : [null ]
    });
  }

  ngOnInit(): void {
  }

  /** Asignar fraude*/
  async save(): Promise<void> {
    if ( this.form.invalid ) {
      this.utils.validateForm(this.form);
      return;
    }
    /** Obtener formulario */
    const data: AsignarFraudeUpdate = this.form.getRawValue();

    /** Objeto de posibles fraudes a guardar */
    let listaAsignacionFraude: AsignarFraudeUpdate[] = [];

    this.setOfCheckedId.forEach(id => {
      const elementAsignacionFraude: AsignarFraudeUpdate = { 
        id: id,
        usuario_asignado: data.usuario_asignado,
        prioridad1: data.prioridad1,
        observacion: data.observacion
      }
      listaAsignacionFraude.push(elementAsignacionFraude);
    });
    // Realizar petición para asignar 1 o mas fraudes
    const response = await this.fraudesService.asignarFraudes(listaAsignacionFraude);

    if ( response && response.status === this.utils.successMessage ) {
      await Swal.fire(this.utils.getSuccessModalOptions(`Posibles fraudes asignados correctamente.`, this.utils.titleSuccessMessage));
      // Refrescar busqueda de fraudes
      await this.searchFraudeService.refreshFraudesSubject$.next(true);
      /** Limpiar registro checked seleccionados */
      this.setOfCheckedId.clear();
      this.closeModal();
    } else {
      await Swal.fire(this.utils.getErrorModalOptions(response.message));
    }
  }

  /** Cerrar modal asinar fraude */
  closeModal(): void {
    this.form.reset();
    this.onCloseModalAsignar.emit();
  }


}
