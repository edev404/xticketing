import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { CreateFraudeComponent } from './create-fraude/pages/create-fraude/create-fraude.component';
import { SearchFraudeComponent } from './search-fraude/pages/search-fraude/search-fraude.component';
import { AnalizarFraudeComponent } from './analizar-fraude/pages/analizar-fraude/analizar-fraude.component';

const routes: Routes = [
  {
    path: 'create',
    component: CreateFraudeComponent,
    loadChildren: () => import('./create-fraude/create-fraude.module').then( m => m.CreateFraudeModule),
  },
  {
    path: 'search',
    component: SearchFraudeComponent,
    loadChildren: () => import('./search-fraude/search-fraude.module').then( m => m.SearchFraudeModule),
  },
  {
    path: 'analizar',
    component: AnalizarFraudeComponent,
    loadChildren: () => import('./analizar-fraude/analizar-fraude.module').then( m => m.AnalizarFraudeModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FraudeRoutingModule { }
