import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { MyListComponent } from './my-list/my-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {ListComponent} from "./dashboard/list/list.component";
import {TeamsKPIComponent} from "./dashboard/teams-kpi/teams-kpi.component";
import {AllEmployeeKPIComponent} from "./dashboard/all-employee-kpi/all-employee-kpi.component";

const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'my-list', component: MyListComponent },
  { path:'dashboard', component:DashboardComponent,

  children:[
    {path:'myKPI' , component:ListComponent },
    {path:'teamsKPI', component:TeamsKPIComponent},
    {path:'allEmployeeKPI', component:AllEmployeeKPIComponent}

  ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
