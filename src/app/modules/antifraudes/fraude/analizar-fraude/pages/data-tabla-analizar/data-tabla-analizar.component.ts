import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

// Services
import { AnalizarFraudeService } from '../../services/analizar-fraude.service';

@Component({
  selector: 'app-data-tabla-analizar',
  templateUrl: './data-tabla-analizar.component.html',
  styleUrls: ['./data-tabla-analizar.component.scss']
})
export class DataTablaAnalizarComponent implements OnInit {

  /** Objeto para mostrar en la tabla */
  @Input() fraudesData: any[] = [];

  // Variable para cambiar de pestaña en tablas
  tabIndex: number = 0;

  // Variable para manejar la suscripción
  subscriptions: Subscription[] = [];

  constructor(private analizarFraudeService: AnalizarFraudeService) { }

  ngOnInit(): void {
    /** Cambiar de pestaña al emitir un nuevo evento en las pestañas de acciones */
    this.subscriptions.push(this.analizarFraudeService.tabAccionesSubjectBehavior.subscribe((tabAccion: number) => {
      tabAccion === 0 ? this.tabIndex = 0 : 
      tabAccion === 1 ? this.tabIndex = 2 :
      tabAccion === 2 ? this.tabIndex = 3 : this.tabIndex = 0;
    }));
  }

  /** Cambiar pestaña */
  changeTab(tabIndex: number): void {
    this.analizarFraudeService.tabTablasSubject$.next(tabIndex);
  }

  /** Resetear tab y desuscribirse */
  ngOnDestroy(): void {
    this.analizarFraudeService.tabAccionesSubject$.next(0);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
