import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ListComponent} from "../list/list.component";
import {KpiFormComponent} from "./kpi-form/kpi-form.component";



@NgModule({
  declarations: [ListComponent, KpiFormComponent],
  imports: [
    CommonModule,
    ModalModule
  ]
})
export class KpModuleModule { }
