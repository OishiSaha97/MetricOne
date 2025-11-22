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
  isHr: boolean = false;
  role: any;
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

  // logout() {
  //   localStorage.clear();
  //   this.router.navigate(['']);
  // }

  logout() {

    localStorage.clear();

    sessionStorage.clear();

    this.router.navigate([''], { replaceUrl: true });


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
          if(data.allPermission ) {
            localStorage.setItem('role', "hr");
            this.role = "hr";
            this.isHr = true;
          }else if(data.teamKpi){
            localStorage.setItem('role', "manager");
            this.role = "manager";
            this.isHr = false;
          }else {
            localStorage.setItem('role', "employee");
            this.role = "employee";
            this.isHr = false;
          }
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
      .subscribe({
        next: (res) => {
          this.resData = res?.['KPIendDate']?.[0] || {};
          this.initialtionDate = this.formatDate(this.resData.kpi_last_date);

          if (!this.initialtionDate) {
            this.setTimePeriod('new year');
            return;
          }

          const today = this.getToday();
          const kpiDate = this.parseDate(this.initialtionDate);

          if (kpiDate >= today) {
            this.setTimePeriod('initiation');
          } else {
            this.checkEvaluationEndDate();
          }
        },
        error: (err) => {
          console.error('Error fetching KPI end date:', err);
        }
      });
  }

  checkEvaluationEndDate(): void {
    this.kpi.getLogData({ param: 'EvaEndDate', userIdKPI: this.userId })
      .subscribe({
        next: (res) => {
          this.resData = res?.['EvaEndDate']?.[0] || {};
          this.initialtionDate = this.formatDate(this.resData.kpi_last_date);

          if (!this.initialtionDate) {
            this.setTimePeriod('new year');
            return;
          }

          const today = this.getToday();
          const kpiDate = this.parseDate(this.initialtionDate);

          if (kpiDate >= today) {
            this.setTimePeriod('evaluation');
          } else {
            this.setTimePeriod('new year');
          }
        },
        error: (err) => {
          console.error('Error fetching evaluation end date:', err);
        }
      });
  }



  formatDate(dateString?: string): string {
    if (!dateString) return '';

    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const formattedYear = date.getFullYear();
    const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(date.getDate()).padStart(2, '0');

    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
  }

  private parseDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  private setTimePeriod(period: 'initiation' | 'evaluation' | 'new year'): void {
    localStorage.setItem('timePeriod', period);
  }

}
