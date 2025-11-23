import {Component, ElementRef, ViewChild} from '@angular/core';
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
  @ViewChild('errorToast', { static: false }) errorToast!: ElementRef;
  toastMessage: string = '';

  constructor(private client:HttpClient, private router: Router,
              private kpi: CommonServiceService) {
  }


  showToast(msg: string) {
    this.toastMessage = msg;

    // Show toast after 20 sec
    setTimeout(() => {
      const el = this.errorToast.nativeElement;

      el.classList.add('show');

      // Auto-hide after 3 seconds
      setTimeout(() => {
        el.classList.remove('show');
      }, 1000);

    }, 0);
  }



  signIn() {

    if(this.username && this.password){
      let formData = new FormData();
      formData.append('username', this.username);
      formData.append('password', this.password);
      this.client.post(`${environment.baseUrl}/authenticate`, formData).subscribe((result:any)=>{

        if(result){
          if(result.isLoginSuccess){
            localStorage.setItem('username', this.username);
            localStorage.setItem('fullName', result['Name']);
            localStorage.setItem('token', result['token']);

            this.router.navigate(['/dashboard/home']);
          }else{
            this.showToast(`Invalid user ID or password`);
          }

          // this.dialogRef.close(true)
        }

      }, (error)=>{
        console.log(error);
      })

    }
  }
  showPassword: boolean = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // getPermission() {
  //   this.kpi.getLogData({param: 'permission-list',objectId:this.username})
  //     .subscribe(res => {
  //         const data = res?.['permission-list']?.[0];
  //         if (data) {
  //           this.allPermission = data.allPermission;
  //           this.teamKpi = data.teamKpi;
  //         }
  //         if(data.allPermission && data.teamKpi) {
  //           localStorage.setItem('role', "hr");
  //         }else if(data.teamKpi){
  //           localStorage.setItem('role', "manager");
  //         }else {
  //           localStorage.setItem('role', "employee");
  //         }
  //       },
  //       (error) => {
  //         console.error("Error fetching permission list", error);
  //         // optionally show a toast or alert
  //       }
  //     );
  // }


}
