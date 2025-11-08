import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {KpiFormComponent} from "./dashboard/kp-module/kpi-form/kpi-form.component";
import {ListComponent} from "./dashboard/list/list.component";
import {TeamsKPIComponent} from "./dashboard/teams-kpi/teams-kpi.component";
import {AllEmployeeKPIComponent} from "./dashboard/all-employee-kpi/all-employee-kpi.component";
//import {SettingsComponent} from "./dashboard/settings/settings.component";
//import {ApprovalHierarchyComponent} from "./dashboard/approval-hierarchy/approval-hierarchy.component";
//import {ApproHierarchyPopUpComponent} from "./dashboard/approval-hierarchy/appro-hierarchy-pop-up/appro-hierarchy-pop-up.component";
//import {ApprovalHierarchyComponent} from "./dashboard/approval-hierarchy/approval-hierarchy.component";
import {KpiAttributeComponent} from "./dashboard/kpi-attribute/kpi-attribute.component";
import { ApprovalHierarchyComponent } from "./dashboard/approval-hierarchy/approval-hierarchy.component";
import { ApproHierarchyPopUpComponent } from "./dashboard/approval-hierarchy/appro-hierarchy-pop-up/appro-hierarchy-pop-up.component";
import {HomeComponent} from "./dashboard/home/home.component";
import {EvaluationComponent} from "./dashboard/kp-module/evaluation/evaluation.component";

const routes: Routes = [
  { path: '', component: EvaluationComponent },
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
      { path: 'allEmployeeKPI', component: AllEmployeeKPIComponent },
      { path: 'allEmployeeKPI', component: AllEmployeeKPIComponent },
      { path: 'hierarchy', component: ApprovalHierarchyComponent },
      { path: 'attributes', component: KpiAttributeComponent },
      { path: 'home', component: HomeComponent }
      // { path: 'approHierarchyPopUp', component: ApproHierarchyPopUpComponent }

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
