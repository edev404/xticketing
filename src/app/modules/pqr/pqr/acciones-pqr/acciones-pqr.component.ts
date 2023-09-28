import { Component, OnInit, Input, EventEmitter, SimpleChanges, Output } from '@angular/core';

@Component({
  selector: 'app-acciones-pqr',
  templateUrl: './acciones-pqr.component.html',
  styleUrls: ['./acciones-pqr.component.scss']
})
export class AccionesPqrComponent implements OnInit {
  accionDeshabilitada = false;
  @Input("pqr") pqr:any;
  @Input("acciones") acciones:any;
  @Output() modalToOpen = new EventEmitter<string>();

  constructor(
  ) { }

  ngOnInit(): void {}

  // funcion para abrir un modal dependiendo de la acción a realizar
  openModal(accion: any) {
    this.modalToOpen.emit(accion);
  }

}
