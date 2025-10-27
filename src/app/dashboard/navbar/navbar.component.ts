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
        { name: 'My KPI' , routePath: 'my-kpi'},
        { name: 'Team`s KPI', routePath: 'team-kpi' },
        { name: 'All Employee KPI', routePath: 'all-employee-kpi' },
      ]
    }
  ];
    constructor(private router: Router){}
    ngOnInit() {

      console.log('superTasks:', this.superTasks);

    }
  navigateTo(path: string) {
    this.activeSubTask = path;
    console.log('Navigating to:', path);
    this.router.navigate(['/', path]);
  }

  logout() {
    this.router.navigate(['']);
  }
}
