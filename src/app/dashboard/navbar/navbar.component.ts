import { Component } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {DomSanitizer} from "@angular/platform-browser";
import {CommonServiceService} from "../common-service.service";
import {CookiesService} from "../cookies.service";



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
  token:any;
    constructor(private router: Router,
                private kpi: CommonServiceService,
                public cookieService: CookiesService
    ){}

    ngOnInit() {

      this.role = this.cookieService.getCookie('role');
      this.userId = this.cookieService.getCookie('username');
      this.userName = this.cookieService.getCookie('fullName');
      this.token = this.cookieService.getCookie('token');

      // this.userId = localStorage.getItem('username');
      // this.userName = localStorage.getItem('fullName');


      this.getPermission();
      this.setActiveMenu(this.router.url);

      // also check on navigation
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.setActiveMenu(event.urlAfterRedirects);
        }
      });

    }

  setActiveMenu(url: string) {
    if (url.includes('/dashboard/home')) {
      this.isHomeActive = true;
      this.activeIndex = null;
      return;
    }

    this.isHomeActive = false;
    if (!url.includes('/dashboard/home')) {
      // this.activeIndex = 1;
      this.activeSubTask = url.split('/dashboard/')[1];
    }

  }

    navigateTo(path: string) {
      console.log('Navigating to:', path);
      this.activeSubTask = path;
      if(path === 'home'){
        this.isHomeActive = true;
        this.activeIndex= null;
      }
      else{
        this.isHomeActive = false;
      }

      this.router.navigate(['dashboard', path]);
    }

  // logout() {
  //   localStorage.clear();
  //   this.router.navigate(['']);
  // }

  logout() {

    this.cookieService.deleteCookie('username');
    this.cookieService.deleteCookie('fullName');
    this.cookieService.deleteCookie('token');
    this.cookieService.deleteCookie('timePeriod');
    this.cookieService.deleteCookie('role');

   // sessionStorage.clear();

    this.router.navigate([''], { replaceUrl: true });


  }

  activeIndex: number | null = null;

  toggleTask(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
    this.isHomeActive = false;
    this.active = !this.active;
  }

  getPermission() {
    this.kpi.getLogData({param: 'permission-list',objectId:this.userId,})
      .subscribe(res => {
          const data = res?.['permission-list']?.[0];
          if (data) {
            this.allPermission = data.allPermission;
            this.teamKpi = data.teamKpi;

          }
          if (data.allPermission) {
            this.cookieService.setCookie('role', 'hr', 1);
            this.role = "hr";
          }
          else if (data.teamKpi) {
            this.cookieService.setCookie('role', 'manager', 1);
            this.role = "manager";
          }
          else {
            this.cookieService.setCookie('role', 'employee', 1);
            this.role = "employee";
          }

          // if(data.allPermission ) {
          //   localStorage.setItem('role', "hr");
          //   this.role = "hr";
          //   this.isHr = true;
          // }else if(data.teamKpi){
          //   localStorage.setItem('role', "manager");
          //   this.role = "manager";
          //   this.isHr = false;
          // }else {
          //   localStorage.setItem('role', "employee");
          //   this.role = "employee";
          //   this.isHr = false;
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
     // localStorage.setItem('timePeriod', period);
    // this.setCookie('timePeriod', period, 1);
    this.userId = this.cookieService.getCookie('username');
    this.userName = this.cookieService.getCookie('fullName');
  }




  setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  eraseCookie(name: string) {
    document.cookie = name + '=; Max-Age=-99999999;';
  }



}
