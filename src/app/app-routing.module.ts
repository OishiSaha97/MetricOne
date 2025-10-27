import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {KpiFormComponent} from "./dashboard/kp-module/kpi-form/kpi-form.component";
import {ListComponent} from "./dashboard/list/list.component";
import {TeamsKPIComponent} from "./dashboard/teams-kpi/teams-kpi.component";
import {AllEmployeeKPIComponent} from "./dashboard/all-employee-kpi/all-employee-kpi.component";
import {KpModuleModule} from "./dashboard/kp-module/kp-module.module";

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'my-form', component:KpiFormComponent},
  { path:'dashboard', component:DashboardComponent},

  {
    path: 'dashboard',
    component: DashboardComponent,
    // loadChildren: () => import('./dashboard/kp-module/kp-module.module').then(m => m.KpModuleModule),
    children: [
      { path: 'myKPI', component: ListComponent },
      { path: 'teamsKPI', component: TeamsKPIComponent },
      { path: 'allEmployeeKPI', component: AllEmployeeKPIComponent }
    ]
  }
  // {
  //   path: 'dashboard',
  //   loadChildren: () =>
  //     import('./dashboard/kp-module/kp-module.module').then(m => m.KpModuleModule)
  // }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
