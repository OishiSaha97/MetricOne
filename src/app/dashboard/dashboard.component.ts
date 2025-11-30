import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from "@angular/router";
import {CookiesService} from "./cookies.service";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private router: Router,
              private cdr: ChangeDetectorRef,
              public cookieService: CookiesService) {

  }

  generatedId: string = '';
  role: any;
  userId: any;
  userName: any;


  ngOnInit() {
    this.role = this.cookieService.getCookie('role');
    this.userId = this.cookieService.getCookie('username');
    this.userName = this.cookieService.getCookie('fullName');
    //this.token = this.cookieService.getCookie('token');
    const token = this.cookieService.getCookie('token');
    this.generatedId = Math.random().toString(36).substring(2, 10);

    if (!token) {
      this.router.navigate(['/login']);
    }
  }
}
