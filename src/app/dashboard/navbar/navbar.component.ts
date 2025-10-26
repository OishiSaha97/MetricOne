import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
 
   name = "Skipper";
   designation = "full stack web-mobile-ml dev";

   constructor(private router: Router){}

  logout()
  {
        this.router.navigate(['']);
  }
}
