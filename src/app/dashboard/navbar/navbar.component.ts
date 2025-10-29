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
    },
    {
      name: 'Configuration',
      subTasks: [
        { name: 'Approval Hierarchy List', routePath: 'hierarchy' },
        { name: 'KPI Attributes', routePath: 'attributes' },
      ]
    }
  ];
    constructor(private router: Router){}
    ngOnInit() {


    }
  navigateTo(path: string) {
    this.activeSubTask = path;
    console.log('Navigating to:', path);
    this.router.navigate(['dashboard', path]);
  }

  logout() {
    this.router.navigate(['']);
  }

  activeIndex: number | null = null;

  toggleTask(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}
