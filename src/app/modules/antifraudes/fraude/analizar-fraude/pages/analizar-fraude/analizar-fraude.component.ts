import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Services
import { AnalizarFraudeService } from '../../services/analizar-fraude.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

// Interfaces

// Componentes
import { AccionesAnalizarComponent } from '../acciones-analizar/acciones-analizar.component';

@Component({
  selector: 'app-analizar-fraude',
  templateUrl: './analizar-fraude.component.html',
  styleUrls: ['./analizar-fraude.component.scss']
})
export class AnalizarFraudeComponent implements OnInit {

  /** Objeto para mostrar en la tabla */
  fraudesData: any = [];

  // Variable para la accion a ejecutar (registrar analisis, registrar sancion o enviar notificacion)
  accionAnalizar: number = 0;

  // Variable para habilitar o deshabilitar boton para enviar notificicacion
  enableOrDisabledEnviarNotificacion: boolean = false;

  // Variable para manejar la suscripción
  subscriptions: Subscription[] = [];

  // Emisión de evento de padre a hijo (Registrar o enviar)
  @ViewChild(AccionesAnalizarComponent) accionesAnalizarComponent!: AccionesAnalizarComponent;

  constructor(private analizarFraudeService: AnalizarFraudeService, 
              private changeDetectorRef: ChangeDetectorRef,
              private utils: UtilsService,
              private router: Router) { }

  /**
   * Método de Angular para comprobar expresiones y deteccion de cambios en la vista antes cambiar valores
   */
  ngAfterContentChecked() {
    // Eliminar errores de [ExpressionChangedAfterItHasBeenCheckedError]
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    /** Cambiar el numero de accion al emitir un nuevo evento en las pestañas*/
    this.subscriptions.push(this.analizarFraudeService.tabAccionesSubjectBehavior.subscribe((tabAcciones: number) => {
      this.accionAnalizar = tabAcciones;
    }));
    /** Obtener lista de fraudes emitidos desde tabla por analizar */
    this.subscriptions.push(this.analizarFraudeService.fraudesPorAnalizarBehavior.subscribe(fraudes => {
      this.fraudesData = fraudes;
    }));
    /** Obtener lista de fraudes emitidos desde tabla por analizar */
    this.subscriptions.push(this.analizarFraudeService.enableOrDisableBottomNotificacionBehavior.subscribe((enableOrDisable: boolean) => {
      this.enableOrDisabledEnviarNotificacion = enableOrDisable;
    }));
  }

  /** Metodo para registrar accion o enviar notificacion */
  registerAccion(): void {
    switch (this.accionAnalizar) {
      case 0:
        this.accionesAnalizarComponent.registerAnalisis();
        break;
      case 1: 
        this.accionesAnalizarComponent.registerSancion();
        break;
      case 2:
        this.accionesAnalizarComponent.sendNotificacion();
        break;
      case 3:
        this.accionesAnalizarComponent.cerrarCaso();
        break;
      default:
        break;
    }
  }

  /**
   * Accion a ejecutar cambiado desde el componente de tablas
   * @param event: number
   */
  changeAccion(event: number): void {
    this.accionAnalizar = event;
  }

  /** Regresar a la pantalla anterior */
  async regresar(): Promise<void> {
    const message: string = this.accionAnalizar == 0 ? 'registro del análisis del posible fraude' : 
                            this.accionAnalizar == 1 ? 'registro de la sanción' :
                            this.accionAnalizar == 2 ? 'envío de la notificación' : 'cerrar caso';
    await Swal.fire(this.utils.getQuestionModalOptions(`¿Estás seguro de que deseas cancelar el ${message}?`, ''))
    .then((result) => {
        // Regresar a la pantalla buscar fraudes
        if (result.isConfirmed) { 
          if (this.accionAnalizar == 2) {
            // Invocar petición para enviar notificacion en borrador
            this.accionesAnalizarComponent.sendNotificacion(true);
          }
          this.router.navigateByUrl('/main/antifraude/fraudes/search');
        }
      });
  }

  /** Resetear tab y desuscribirse */
  ngOnDestroy(): void {
    this.analizarFraudeService.tabAccionesSubject$.next(0);
    /** Limpiar lista de casos por analizar */
    this.analizarFraudeService.fraudesPorAnalizar$.next([]);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
