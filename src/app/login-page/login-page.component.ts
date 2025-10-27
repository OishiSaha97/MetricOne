import { Component } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {environment} from "../../environments/environment";
import { NgModule } from '@angular/core';
import {Router} from "@angular/router";

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


  constructor(private client:HttpClient, private router: Router) {
  }



  signIn() {

    if(this.username && this.password){
      let formData = new FormData();
      formData.append('username', this.username);
      formData.append('password', this.password);
      this.client.post(`${environment.baseUrl}/authenticate`, formData).subscribe((result:any)=>{
        if(result){
          localStorage.setItem('username', this.username);
          localStorage.setItem('fullName', result['Name']);
          localStorage.setItem('token', result['token']);
          //this.router.navigate(['/dashboard']);
          this.router.navigate(['/dashboard']);
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



}
