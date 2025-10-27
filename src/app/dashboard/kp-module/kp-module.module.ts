import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KpiFormComponent} from "./kpi-form/kpi-form.component";
import {AppRoutingModule} from "../../app-routing.module";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {HttpClientModule} from "@angular/common/http";
import {ListComponent} from "../list/list.component";



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
