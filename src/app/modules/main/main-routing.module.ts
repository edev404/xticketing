import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/modules/home/home/home.component';
import { TarifasComponent } from 'src/app/modules/tarifas/tarifas/tarifas.component';
import { AdminComponent } from '../admin/admin/admin.component';
import { ClientesComponent } from '../clientes/clientes/clientes.component';
import { DescuentosComponent } from '../descuentos/descuentos/descuentos.component';
import { MediosPagoComponent } from '../medios-pago/medios-pago/medios-pago.component';
import { TransporteComponent } from '../transporte/transporte/transporte.component';
import { AntifraudesHomeComponent } from '../antifraudes/antifraudes-home.component';
import { PqrComponent } from '../pqr/pqr/pqr.component';
import { Navbar } from 'src/app/shared/models/navbar.interface';
import { MonitoreoComponent } from '../monitoreo/monitoreo.component';

const menu: Navbar[] = JSON.parse(localStorage.getItem("sidebar")!)
let routes: Routes = [];

if (menu) {
  menu.forEach((element: Navbar) => {
    routes.push(
      {
        path: '',
        component: HomeComponent,
        data: {
          active: true
        }
      },
      {
        path: 'monitoreo',
        component: MonitoreoComponent,
        loadChildren: () => import('../monitoreo/monitoreo.module').then(m => m.MonitoreoModule),
        data: {
          active: element.path == 'monitoreo' ? element.active : ''
        }
      },
      {
        path: 'tarifas',
        component: TarifasComponent,
        loadChildren: () => import('../tarifas/tarifas.module').then(m => m.TarifasModule),
        data: {
          active: element.path == 'tarifas' ? element.active : ''
        }
      },
      {
        path: 'transporte',
        component: TransporteComponent,
        loadChildren: () => import('../transporte/transporte.module').then(m => m.TransporteModule),
        data: {
          active: element.path == 'transporte' ? element.active : ''
        }
      },
      {
        path: 'descuentos',
        component: DescuentosComponent,
        loadChildren: () => import('../descuentos/descuentos.module').then(m => m.DescuentosModule),
        data: {
          active: element.path == 'descuentos' ? element.active : ''
        }
      },
      {
        path: 'clientes',
        component: ClientesComponent,
        loadChildren: () => import('../clientes/clientes.module').then(m => m.ClientesModule),
        data: {
          active: element.path == 'clientes' ? element.active : ''
        }
      },
      {
        path: 'cards',
        component: MediosPagoComponent,
        loadChildren: () => import('../medios-pago/medios-pago.module').then(m => m.MediosPagoModule),
        data: {
          active: element.path == 'cards' ? element.active : ''
        }
      },
      {
        path: 'admin',
        component: AdminComponent,
        loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule),
        data: {
          active: element.path == 'admin' ? element.active : ''
        }
      },
      {
        path: 'antifraude',
        component: AntifraudesHomeComponent,
        loadChildren: () => import('../antifraudes/antifraudes.module').then(m => m.AntifraudesModule),
        data: {
          active: element.path == 'antifraude' ? element.active : ''
        }
      }, {
      path: 'pqr',
      component: PqrComponent,
      loadChildren: () => import('../pqr/pqr.module').then(m => m.PqrModule),
      data: {
        active: element.path == 'pqr' ? element.active : ''
      }
    }, {
      path: 'clearing',
      loadChildren: () => import('../clearing/clearing.module').then(m => m.ClearingModule),
      data: {
        active: element.path == 'clearing' ? element.active : ''
      }
    }, {
      path: 'recharges',
      loadChildren: () => import('../recharge/recharges.module').then(m => m.RechargesModule),
      data: {
        active: element.path == 'recharges' ? element.active : ''
      }
    }, {
      path: 'reports',
      loadChildren: () => import('../reportes/reportes.module').then(m => m.ReportesModule),
      data: {
        active: element.path == 'reports' ? element.active : ''
      }
    }
    );
  })
}
routes = routes.filter((element: any) => element.data.active != false);


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
