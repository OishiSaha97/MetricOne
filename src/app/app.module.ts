import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MyListComponent } from './my-list/my-list.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './dashboard/navbar/navbar.component';
import { ListComponent } from './dashboard/list/list.component';
import {CommonModule} from "@angular/common";
import {KpModuleModule} from "./dashboard/kp-module/kp-module.module";
@NgModule({
  declarations: [
    AppComponent,
    MyListComponent,
    DashboardComponent,
    NavbarComponent
  ],
  imports: [
  BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    KpModuleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
