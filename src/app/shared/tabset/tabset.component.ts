import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IReporte } from '../models/reportes.interface';

@Component({
  selector: 'app-tabset',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.scss']
})
export class TabsetComponent implements OnInit {

  @Input() reports: IReporte[] = [];
  @Output() emitir: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  tabSelected(event: number): void {
    this.emitir.emit(event)
  }
}
