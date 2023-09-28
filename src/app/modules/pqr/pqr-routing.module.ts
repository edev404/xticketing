import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

// componentes
import { PqrRegistroComponent } from './pqr/pqr-registro/pqr-registro.component';
import { ListaPqrComponent } from './pqr/lista-pqr/lista-pqr.component';
import { VerPqrsComponent } from './pqr/ver-pqrs/ver-pqrs.component';
import { AccionesPqrComponent } from './pqr/acciones-pqr/acciones-pqr.component';
import { ParametrosPqrComponent } from './pqr/parametros-pqr/parametros-pqr.component';
import { ReportesPqrComponent } from './pqr/reportes-pqr/reportes-pqr.component';

const routes:Routes = [
    {
        path: '', 
        component: ListaPqrComponent ,
    },
    {
        path: 'registrar', 
        component: PqrRegistroComponent ,
    },
    {
        path: 'ver-pqrs', 
        component: VerPqrsComponent ,
    },
    {
        path: 'acciones-pqr', 
        component: AccionesPqrComponent ,
    },
    {
        path: 'param-pqrs', 
        component: ParametrosPqrComponent ,
    },
    {
        path: 'reports-pqr', 
        component: ReportesPqrComponent ,
    },
    {
        path: 'ficticio', 
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class PqrRoutingModule { }