import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KpiFormComponent} from "./kpi-form/kpi-form.component";
import {AppRoutingModule} from "../../app-routing.module";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {HttpClientModule} from "@angular/common/http";
import {ListComponent} from "../list/list.component";
import {AllEmployeeKPIComponent} from "../all-employee-kpi/all-employee-kpi.component";
import {TeamsKPIComponent} from "../teams-kpi/teams-kpi.component";
import {DashboardComponent} from "../dashboard.component";
import {Routes} from "@angular/router";

// const routes: Routes = [
//   {
//     path: '',
//     component: DashboardComponent,
//     children: [
//       { path: 'myKPI', component: ListComponent },
//       { path: 'teamsKPI', component: TeamsKPIComponent },
//       { path: 'allEmployeeKPI', component: AllEmployeeKPIComponent },
//       { path: '', redirectTo: 'myKPI', pathMatch: 'full' } // default route
//     ]
//   }
// ];

@NgModule({
  declarations: [ListComponent, KpiFormComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    HttpClientModule,
    FormsModule
  ]
})
export class KpModuleModule { }
