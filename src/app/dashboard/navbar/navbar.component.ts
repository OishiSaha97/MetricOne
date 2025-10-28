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
  active : boolean= false;
  activeSubTask: string | null = null;
  superTasks = [
    {
      name: 'KPI Management',
      subTasks: [
        { name: 'My KPI', routePath: 'myKPI' },
        { name: 'Team`s KPI', routePath: 'teamsKPI' },
        { name: 'All Employee KPI', routePath: 'allEmployeeKPI' },
      ]
    }
  ];
    constructor(private router: Router){}
    ngOnInit() {

      console.log('superTasks:', this.superTasks);
      console.log('superTasks:', this.superTasks.subTasks);

    }
  navigateTo(path: string) {
    this.activeSubTask = path;
    console.log('Navigating to:', path);
    this.router.navigate(['dashboard', path]);
  }

  logout() {
    this.router.navigate(['']);
  }

  openTask() {
    this.active=!this.active;
  }
}
