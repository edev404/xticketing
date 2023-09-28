import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { ViewListComponent } from './view-list/view-list.component';

const routes: Routes = [
    {
        path: 'view-statistics',
        loadChildren: () => import('./ver-estadisticas/ver-estadisticas.module').then(m => m.VerEstadisticasModule)
    }, 
    {
        path: 'reportes',
        loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule)
    },
    {
        path:'view-list',
        component: ViewListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class reportesRoutingModule { }