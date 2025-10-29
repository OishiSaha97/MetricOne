import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {KpiFormComponent} from "./dashboard/kp-module/kpi-form/kpi-form.component";
import {ListComponent} from "./dashboard/list/list.component";
import {TeamsKPIComponent} from "./dashboard/teams-kpi/teams-kpi.component";
import {AllEmployeeKPIComponent} from "./dashboard/all-employee-kpi/all-employee-kpi.component";
import {SettingsComponent} from "./dashboard/settings/settings.component";
import {ApprovalHierarchyComponent} from "./dashboard/approval-hierarchy/approval-hierarchy.component";
import {
  ApproHierarchyPopUpComponent
} from "./dashboard/approval-hierarchy/appro-hierarchy-pop-up/appro-hierarchy-pop-up.component";

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard/my-form', component:KpiFormComponent},
 // { path: 'settings', component: SettingsComponent },

  { path:'dashboard', component:DashboardComponent},

  {
    path: 'dashboard',
    component: DashboardComponent,
    // loadChildren: () => import('./dashboard/kp-module/kp-module.module').then(m => m.KpModuleModule),
    children: [
      { path: 'myKPI', component: ListComponent },
      { path: 'teamsKPI', component: TeamsKPIComponent },
      { path: 'allEmployeeKPI', component: AllEmployeeKPIComponent },
      { path: 'approvalHierarchy', component: ApprovalHierarchyComponent },
      { path: 'approHierarchyPopUp', component: ApproHierarchyPopUpComponent },

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
