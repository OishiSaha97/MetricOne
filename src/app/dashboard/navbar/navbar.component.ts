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

   name = "";
   designation = "";
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
    localStorage.clear();
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
            this.allPermission = data.allPermission;
            this.teamKpi = data.teamKpi;
          }
          // if(data.allPermission && data.teamKpi) {
          //   localStorage.setItem('role', "hr");
          // }else if(data.teamKpi){
          //   localStorage.setItem('role', "manager");
          // }else {
          //   localStorage.setItem('role', "employee");
          // }
          this.checkEndDate();

        },
        (error) => {
          console.error("Error fetching permission list", error);
          // optionally show a toast or alert
        }
      );
  }
  initialtionDate: string | Date | undefined = undefined;
  resData: any;
  checkEndDate() {
    this.kpi.getLogData({ param: 'KPIendDate', userIdKPI: this.userId })
      .subscribe(res => {
        this.resData = res?.['KPIendDate'][0] || [];

        this.initialtionDate = this.formatDateForInput(this.resData.kpi_last_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [year, month, day] = this.initialtionDate.split('-').map(Number);
        const kpiDate = new Date(year, month - 1, day);
        if(this.initialtionDate && (kpiDate >= today)){
          localStorage.setItem('timePeriod', "initiation");
        }
        else if (kpiDate < today) {
          this.checkEvaEndDate();
        }
        else if(this.initialtionDate === ''){
          localStorage.setItem('timePeriod', "new year");
        }

      });
  }
  formatDateForInput(dateString: string): string {
    if (!dateString) return '';

    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const formattedYear = date.getFullYear();
    const formattedMonth = ('0' + (date.getMonth() + 1)).slice(-2);
    const formattedDay = ('0' + date.getDate()).slice(-2);

    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
  }

  checkEvaEndDate() {
    this.kpi.getLogData({ param: 'EvaEndDate', userIdKPI: this.userId })
      .subscribe(res => {
        this.resData = res?.['EvaEndDate'][0] || [];

        this.initialtionDate = this.formatDateForInput(this.resData.kpi_last_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [year, month, day] = this.initialtionDate.split('-').map(Number);
        const kpiDate = new Date(year, month - 1, day);
        if(this.initialtionDate && (kpiDate > today)){
          localStorage.setItem('timePeriod', "evaluation");
        }

      });
  }

}
