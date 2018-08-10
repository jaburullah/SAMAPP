import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import {FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LayoutComponentModule } from './layout/layout-component.module';
import {SessionModel} from './model/Session';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';

import { AppartementComponent } from './appartement/appartement.component';
import {ManagerComponent} from './manager/manager.component';

import { LayoutComponent } from './layout/layout.component';
import { DataTablesModule } from 'angular-datatables';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppServiceService} from './service/app-service.service';
import {AppErrorHandler} from './model/ErrorHandler';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {AuthenticationResolve} from './service/Authentication';
import { MaterialModule } from './material.module';
import { TenantComponent } from './tenant/tenant.component';
import { TicketComponent } from './ticket/ticket.component';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    LayoutComponent,
    AppartementComponent,
    ManagerComponent,
    TenantComponent,
    TicketComponent
  ],
  imports: [
    BrowserModule,
    MomentModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    LayoutComponentModule,
    DataTablesModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    MaterialModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: AuthenticationResolve, useClass: AuthenticationResolve },
    { provide: SessionModel, useClass: SessionModel },
    { provide: AppServiceService, useClass: AppServiceService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
