import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './dashboard/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import {CommonModule} from "@angular/common";
import { TeamsKPIComponent } from './dashboard/teams-kpi/teams-kpi.component';
import { AllEmployeeKPIComponent } from './dashboard/all-employee-kpi/all-employee-kpi.component';
import {KpiFormComponent} from "./dashboard/kp-module/kpi-form/kpi-form.component";
import {ListComponent} from "./dashboard/list/list.component";
import {BsModalService, ModalModule} from "ngx-bootstrap/modal";
import { ApprovalHierarchyComponent } from './dashboard/approval-hierarchy/approval-hierarchy.component';
import { KpiAttributeComponent } from './dashboard/kpi-attribute/kpi-attribute.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavbarComponent,
    TeamsKPIComponent,
    AllEmployeeKPIComponent,
    KpiFormComponent,
    ListComponent,
    ApprovalHierarchyComponent,
    KpiAttributeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    HttpClientModule,
    RouterModule,
    CommonModule,
    ModalModule.forRoot()

  ],
  providers: [BsModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
