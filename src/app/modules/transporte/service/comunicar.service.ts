import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComunicarService {
    evento: boolean;
     
    constructor() {
        this.evento = false;
    }

    getEvento(): boolean {
        return this.evento;
    }

    setEvento(evento: boolean) {
        this.evento = evento;
    }
}