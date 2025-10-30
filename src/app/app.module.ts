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
//import { SettingsComponent } from './dashboard/settings/settings.component';
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
//import { ApprovalHierarchyComponent } from './dashboard/approval-hierarchy/approval-hierarchy.component';
//import { ApproHierarchyPopUpComponent } from './dashboard/approval-hierarchy/appro-hierarchy-pop-up/appro-hierarchy-pop-up.component';

//import { ApprovalHierarchyComponent } from './dashboard/approval-hierarchy/approval-hierarchy.component';
import { KpiAttributeComponent } from './dashboard/kpi-attribute/kpi-attribute.component';
import {SettingsComponent} from "./dashboard/settings/settings.component";
import {ApprovalHierarchyComponent} from "./my-list/approval-hierarchy/approval-hierarchy.component";
import {
  ApproHierarchyPopUpComponent
} from "./my-list/approval-hierarchy/appro-hierarchy-pop-up/appro-hierarchy-pop-up.component";
import { KpiAttriComponent } from './dashboard/kpi-attri/kpi-attri.component';
import { KpiAttriPopUpComponent } from './dashboard/kpi-attri/kpi-attri-pop-up/kpi-attri-pop-up.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavbarComponent,
    TeamsKPIComponent,
    AllEmployeeKPIComponent,
    KpiFormComponent,
    ListComponent,
    SettingsComponent,
    ApprovalHierarchyComponent,
    ApproHierarchyPopUpComponent,
    //ApproHierarchyPopUpComponent,
    KpiAttributeComponent,
    KpiAttriComponent,
    KpiAttriPopUpComponent
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
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),

  ],
  providers: [BsModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
