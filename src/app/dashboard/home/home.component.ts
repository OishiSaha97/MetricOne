import { Component } from '@angular/core';
import {FinalApprovalPopUpComponent} from "../approval-hierarchy/final-approval-pop-up/final-approval-pop-up.component";
import {SettingsComponent} from "../settings/settings.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../common-service.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  modalRef?: BsModalRef;
  resData: any;
  endDate: string | null = null;
  userId:any;
  dashBoardData: any;
  pendingHR: any;
  totalEmloyee: any;

  constructor(private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }

  notifications = [
    { name: 'Jaber Alom', message: 'KPI review session announced.', image: 'https://i.pravatar.cc/40?img=1' },
    { name: 'Asif Islam', message: 'Reminder for self-assessment.', image: 'https://i.pravatar.cc/40?img=2' },
    { name: 'Mehedi Hasan', message: 'Team evaluation due soon.', image: 'https://i.pravatar.cc/40?img=3' },
  ];
  employees = [
    { name: 'Sohail Rahman', designation: 'Software Engineer', team: 'QA', measure: 'KPI Review Session', date: 'Nov 2, 2025' },
    { name: 'Arafat Alam', designation: 'SQA Engineer', team: 'QA', measure: 'Performance Review', date: 'Nov 1, 2025' },
  ];

  ngOnInit() {
    this.userId = localStorage.getItem('username');
    this.checkEndDate();
    this.getData();
    this.updateCountdown();
    setInterval(() => this.updateCountdown(), 60000); // Update every minute


  }

  getData() {
    this.kpi.getLogData({ param: 'dashboardInfo', userIdKPI: this.userId })
      .subscribe(res => {
        this.dashBoardData = res?.['dashboardInfo'][0] || [];
        this.totalEmloyee = this.dashBoardData.totalEmployee || 0;


      });
  }

  updateCountdown() {
    const now = new Date().getTime();
    const date = new Date(this.resData.kpi_last_date);
    const distance = date.getTime() - now;

    this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  }
  checkEndDate() {
    this.kpi.getLogData({ param: 'KPIendDate', userIdKPI: this.userId })
      .subscribe(res => {
        this.resData = res?.['KPIendDate'][0] || [];

        this.endDate = this.formatDateForInput(this.resData.kpi_last_date);
      });
  }
  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  openSetting(){
    this.modalRef = this.modalService.show(SettingsComponent, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-dialog modal-dialog-centered modal-lg',
      initialState: {

      },

    });
  }

  onDone() {

  }
}
