import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

   name = "Skipper";
   designation = "full stack web-mobile-ml dev";
  superTasks = [
    {
      name: 'KPI Management',
      subTasks: [
        { name: 'KPI Dashboard' },
        { name: 'KPI Configuration' }
      ]
    }
  ];
    constructor(private router: Router){}
    ngOnInit() {

      // this.superTasks = [
      //   {
      //     name: 'KPI Management',
      //     subTasks: [
      //       { name: 'KPI Dashboard' },
      //       { name: 'KPI Configuration' }
      //     ]
      //   }
      // ];

    }

  logout() {
    this.router.navigate(['']);
  }
}
