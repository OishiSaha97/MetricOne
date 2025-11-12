import { Component } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {environment} from "../../environments/environment";
import { NgModule } from '@angular/core';
import {Router} from "@angular/router";
import {CommonServiceService} from "../dashboard/common-service.service";

@Component({
  selector: 'app-login-page',
  standalone:true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  username: string = '';
  password: string = '';
  allPermission: boolean = false;
  teamKpi: boolean = false;

  constructor(private client:HttpClient, private router: Router,
              private kpi: CommonServiceService) {
  }



  signIn() {

    if(this.username && this.password){
      let formData = new FormData();
      formData.append('username', this.username);
      formData.append('password', this.password);
      this.client.post(`${environment.baseUrl}/authenticate`, formData).subscribe((result:any)=>{
        if(result){
          this.getPermission();
          localStorage.setItem('username', this.username);
          localStorage.setItem('fullName', result['Name']);
          localStorage.setItem('token', result['token']);
          //this.router.navigate(['/dashboard']);

          this.router.navigate(['/dashboard/home']);
          // this.dialogRef.close(true)
        }
      }, ()=>{
        // this.messageService.add({
        //   severity: "error",
        //   detail: `Invalid Credentials`,
        //   life: 3000
        // })
      })

    }
  }
  showPassword: boolean = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
  getPermission() {
    this.kpi.getLogData({param: 'permission-list',objectId:this.username})
      .subscribe(res => {
          const data = res?.['permission-list']?.[0];
          if (data) {
            this.allPermission = data.allPermission;
            this.teamKpi = data.teamKpi;
          }
          if(data.allPermission && data.teamKpi) {
            localStorage.setItem('role', "hr");
          }else if(data.teamKpi){
            localStorage.setItem('role', "manager");
          }else {
            localStorage.setItem('role', "employee");
          }
        },
        (error) => {
          console.error("Error fetching permission list", error);
          // optionally show a toast or alert
        }
      );
  }
}
