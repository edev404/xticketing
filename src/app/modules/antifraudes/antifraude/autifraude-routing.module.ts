import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { SearchControlsComponent } from './search-controls/pages/search-controls/search-controls.component';
import { ReportControlsComponent } from './reports-controls/pages/report-controls/report-controls.component';

const routes: Routes = [
  {
    path: 'search',
    component: SearchControlsComponent,
    loadChildren: () => import('./search-controls/search-controls.module').then( m => m.SearchControlsModule),
  },
  {
    path: 'reports',
    component: ReportControlsComponent,
    loadChildren: () => import('./reports-controls/reports-controls.module').then( m => m.ReportsControlsModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutifraudeRoutingModule { }
