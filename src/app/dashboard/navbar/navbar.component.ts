import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {DomSanitizer} from "@angular/platform-browser";
import {CommonServiceService} from "../common-service.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

   name = "Skipper";
   designation = "full stack web-mobile-ml dev";
  userName:any = '';
  userId:any='';
  active : boolean= false;
  activeSubTask: string | null = null;
  allPermission: boolean = false;
  teamKpi: boolean = false;
  isHomeActive: boolean = true;
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

  permissionList:any='';
    constructor(private router: Router,private kpi: CommonServiceService){}

    ngOnInit() {
      this.userId = localStorage.getItem('username');
      this.userName = localStorage.getItem('fullName');
      this.getPermission();
    }

    navigateTo(path: string) {
      this.activeSubTask = path;
      this.isHomeActive = false;
      this.router.navigate(['dashboard', path]);
    }

  logout() {
    this.router.navigate(['']);
  }

  activeIndex: number | null = null;

  toggleTask(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
    this.isHomeActive = false;
  }

  getPermission() {
    this.kpi.getLogData({param: 'permission-list',objectId:this.userId,})
      .subscribe(res => {
          const data = res?.['permission-list']?.[0];
          if (data) {
            this.allPermission = !!data.allPermission;
            this.teamKpi = !!data.teamKpi;
          }
        },
        (error) => {
          console.error("Error fetching permission list", error);
          // optionally show a toast or alert
        }
      );
  }

}
