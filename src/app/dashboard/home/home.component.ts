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
  initialtionDate: string | Date | undefined = undefined;
  userId:any;
  role:any;
  dashBoardData: any;
  pendingHR: any;
  totalEmloyee: any;
   settingTitle: any;
   mode: any;
   completed: number = 101;
  anncText:any='';
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
  announcements:any[] = [];
  progressValue: number =75;

  ngOnInit() {
    this.userId = localStorage.getItem('username');
    this.role = localStorage.getItem('role');
    this.checkEndDate();
    this.getData();
    this.getAnnouncements();
    this.updateCountdown();
    setInterval(() => this.updateCountdown(), 60000); // Update every minute
    this.progressValue = 75;
    this.completed = 101;
    this.updateProgress();

  }
  get dashOffset() {
    const circumference = 2 * Math.PI * 50;
    let progress = circumference - (this.progressValue / 100) * circumference;
    return progress;
  }

  updateProgress() {
    this.progressValue = 65;
    this.completed = 180;
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

        this.initialtionDate = this.formatDateForInput(this.resData.kpi_last_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [year, month, day] = this.initialtionDate.split('-').map(Number);
        const kpiDate = new Date(year, month - 1, day);
        if(this.initialtionDate && (kpiDate >= today)){
          this.settingTitle = "Initiation";
          this.mode = "edit";
        }
        else if (kpiDate < today) {
          this.settingTitle = "Evaluation";
          this.checkEvaEndDate();
          this.mode = "add";
        }
        else {
          this.settingTitle = "Setting";
          this.mode = "add";
        }
      });
  }
  formatDateForInput(dateString: string): string {
    if (!dateString) return '';

    // Parse manually to avoid UTC timezone shift
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const formattedYear = date.getFullYear();
    const formattedMonth = ('0' + (date.getMonth() + 1)).slice(-2);
    const formattedDay = ('0' + date.getDate()).slice(-2);

    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
  }

  openSetting(): void {
    this.modalRef = this.modalService.show(SettingsComponent, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-dialog modal-dialog-centered modal-lg',
      initialState: {
        mode: this.mode,
      },
    });

    if (this.modalRef) {
      const modalContent = this.modalRef.content as SettingsComponent;

      const subscription = modalContent.requestEmitter.subscribe(() => {
        this.checkEndDate();
      });

      this.modalRef.onHidden?.subscribe(() => {
        subscription.unsubscribe();
      });
    }
  }


  onDone() {

  }


  checkEvaEndDate() {
    this.kpi.getLogData({ param: 'EvaEndDate', userIdKPI: this.userId })
      .subscribe(res => {
        this.resData = res?.['EvaEndDate'][0] || [];

        this.initialtionDate = this.formatDateForInput(this.resData.kpi_last_date);
      });
  }

  publishAnnoc() {
    const formData = new FormData();
    formData.append('userId', this.userId);
    formData.append('remarkData', this.anncText);
    this.kpi.saveAnnouncement(formData).subscribe({
      next: (response) => {
       this.anncText='';
       this.getAnnouncements();
      },
      error: (error) => {

      }
    });
  }

  getAnnouncements() {
    this.kpi.getLogData({ param: 'announcement-list', userIdKPI: this.userId })
      .subscribe(res => {
        this.announcements = res?.['announcement-list'] || [];
        console.log("this.announcements  : ", this.announcements );
      });
  }
}
