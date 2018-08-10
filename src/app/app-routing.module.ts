import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AppartementComponent} from './appartement/appartement.component';
import { LayoutComponent} from './layout/layout.component';
import {ManagerRoutingModule} from './manager/manager.module';
import {ManagerComponent} from './manager/manager.component';
import {TenantComponent} from './tenant/tenant.component';
import {TicketComponent} from './ticket/ticket.component';
import {AuthenticationResolve} from './service/Authentication';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: '', component: LayoutComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'appartement', component: AppartementComponent,
        children: [
          {
            path: '',
            loadChildren: './appartement/appartement-routing.module#AppartementRoutingModule'
          }
        ]
      },
      {path: 'manager', component: ManagerComponent,
        children: [
          {
            path: '',
            loadChildren: './manager/manager.module#ManagerRoutingModule'
          }
        ]
      },
      {path: 'tenant', component: TenantComponent,
        children: [
          {
            path: '',
            loadChildren: './tenant/tenant.module#TenantRoutingModule'
          }
        ]
      },
      {path: 'ticket', component: TicketComponent,
        children: [
          {
            path: '',
            loadChildren: './ticket/ticket.module#TicketRoutingModule'
          }
        ]
      },
    ],
    resolve: {
      data: AuthenticationResolve,
    }
  },
  { path: '**', redirectTo: '/login'}
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
