import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { PassageComponent } from './clearing/passage/passage.component';
import { ReportsComponent } from './clearing/reports/reports.component';

// componentes


const routes:Routes = [
    {
        path: 'passage', 
        component: PassageComponent,
    },
    {
        path: 'passage-settlement', 
        component: PassageComponent,
    },
    {
        path: 'reports', 
        component: ReportsComponent,
    },
    {
        path: 'ficticio', 
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class clearingRoutingModule { }