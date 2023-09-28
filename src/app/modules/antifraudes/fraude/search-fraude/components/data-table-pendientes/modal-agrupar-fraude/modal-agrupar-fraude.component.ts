import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// Services
import { FraudesService } from '../../../services/fraudes.service';
import { SearchFraudeService } from '../../../services/search-fraude.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { LoginServiceService } from 'src/app/serivces/login-service/login-service.service';

// Interfaces
import { AgruparFraudeUpdate } from '../../../interfaces/fraudes-acciones';
import { TipoLista } from 'src/app/modules/antifraudes/antifraude/search-controls/interfaces/lists-controls.interfaces';
import { UsuariosFraude } from '../../../interfaces/search-fraude.interfaces';
import { Fraude } from '../../../../interfaces/fraude.interfaces';
import { IUser } from '../../../../../auth-antifraude/interfaces/authAntifraude.interfaces';

/** Interface que se utiliza para el formulario */
export interface AgruparForm {
  nombre             : string;
  usuario_asignado   : number;
  prioridad1         : number;
  criterio_agrupacion: string;
  observacion        : string;
}

/** Interface de respuesta al crear grupo */
export interface ResponseCreateGrupo {
  id:                  number;
  nombre:              string;
  criterio_agrupacion: string;
  estado:              string;
}

@Component({
  selector: 'app-modal-agrupar-fraude',
  templateUrl: './modal-agrupar-fraude.component.html',
  styleUrls: ['./modal-agrupar-fraude.component.scss', '../../../../../../../../assets/themes/white/core/_formulario.scss']
})
export class ModalAgruparFraudeComponent implements OnInit {

  // Variable para abrir modal 
  @Input() isModalAgrupar: boolean = false;

  /** Variable para obtener todos los IDS de fraudes (solos o que pertenezcan a un grupo) seleccionados en la tabla */
  @Input() setOfCheckedId = new Set<number>();

  // Lista de usuarios
  @Input() users: UsuariosFraude[] = [];

  // Tipos de prioridad
  @Input() tpPrioridad: TipoLista[] = [];

  // Emisión de eventos (cerrar modal)
  @Output() onCloseModalAgrupar = new EventEmitter();

  /** Formulario reactivo */
  form!: FormGroup;

  /** Variable de fraudes seleccionados para dividir y tomar el "usuario asignado a y prioridad" */
  @Input() set fraudesDividir(data: any[] | undefined) {
    if (!data) return;
    let fraude: Fraude;
    // Verificar si es un grupo
    if (data[0].isGroup) {
      fraude = data[0].fraudes[0];
    } else {
      fraude = data[0];
    }
    this.form.controls['usuario_asignado'].reset(fraude.usuario_asignado);
    this.form.controls['prioridad1'].reset(fraude.prioridad1);
    /** Obtener usuario */
    const auth: IUser = this.authService.getAuth();
    const profileUsuario = auth.user.profile;
    // Si el rol es diferente de admin el campo "asignado a" se deshabilita
    if (profileUsuario !== 'admin') {
      this.form.controls['usuario_asignado'].disable();
    }
  }

  constructor(private fraudesService: FraudesService,
              private searchFraudeService: SearchFraudeService,
              private authService: LoginServiceService,
              private utils: UtilsService,
              private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre             : [null, Validators.required ],
      usuario_asignado   : [null, Validators.required ],
      prioridad1         : [null, Validators.required ],
      criterio_agrupacion: [null, Validators.required ],
      observacion        : [null ]
    });
  }

  ngOnInit(): void {
  }

  /** Agrupar fraudes */
  async save(): Promise<void> {
    if ( this.form.invalid ) {
      this.utils.validateForm(this.form);
      return;
    }
    /** Obtener formulario */
    const data: AgruparForm = this.form.getRawValue();
    /** Desestructuración del objeto */
    const { usuario_asignado, prioridad1, observacion, ...grupoCreate } = data;
    /** Id del grupo al cual se va a agrupar */
    let id_fk_grupo: number;

    // Realizar petición para crear grupo y obtener el fk_grupo
    const responseCreateGrupo = await this.fraudesService.crearGrupo(grupoCreate);
    if ( responseCreateGrupo && responseCreateGrupo.status === this.utils.successMessage ) {
      const grupo: ResponseCreateGrupo = responseCreateGrupo.data.Grupo_fraude;
      id_fk_grupo = grupo.id;
    } else {
      await Swal.fire(this.utils.getErrorModalOptions(responseCreateGrupo.message));
      return;
    }

    /** Objeto de fraudes para Agrupar */
    let listaAgruparFraude: AgruparFraudeUpdate[] = [];
    
    this.setOfCheckedId.forEach(id => {
      const elementAgruparFraude: AgruparFraudeUpdate = { 
        id: id,
        usuario_asignado: usuario_asignado,
        prioridad1: prioridad1,
        observacion: observacion,
        fk_grupo: id_fk_grupo
      }
      listaAgruparFraude.push(elementAgruparFraude);
    });

    // Realizar petición para agrupar 1 o mas fraudes
    const responseAgrupar = await this.fraudesService.agruparFraudes(listaAgruparFraude);
    if ( responseAgrupar && responseAgrupar.status === this.utils.successMessage ) {
      await Swal.fire(this.utils.getSuccessModalOptions(`Fraudes agrupados correctamente.`, this.utils.titleSuccessMessage));
      // Refrescar busqueda de fraudes
      await this.searchFraudeService.refreshFraudesSubject$.next(true);
      /** Limpiar registro checked seleccionados */
      this.setOfCheckedId.clear();
      this.closeModal();
    } else {
      await Swal.fire(this.utils.getErrorModalOptions(responseAgrupar.message));
    }
  }

  /** Cerrar modal agrupar fraude */
  closeModal(): void {
    this.form.reset();
    this.onCloseModalAgrupar.emit();
  }

}
