import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {BsModalRef} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../common-service.service";

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.css']
})
export class InitialComponent {
  bsConfig?: Partial<BsDatepickerConfig>;
  today: any;
  selectedDate: string | null = null;
  @Output() selectedDates: EventEmitter<string | null> = new EventEmitter<string | null>();
  totalEmloyee: any;
  userId:any;
  @Input() tabs: any;
   resData: any;
   dashBoardData: any;
    pendingHR: any;
   showProceedButton: boolean = false;

  constructor(public bsModalRef: BsModalRef,
              private kpi: CommonServiceService) {}
  ngOnInit() {
    this.userId = localStorage.getItem('username');
    this.today = new Date();
    this.bsConfig = {
      adaptivePosition: false, // disables auto reposition
      containerClass: 'theme-default bs-datepicker-top',        // forces it above
      dateInputFormat: 'DD MMM YYYY',
      showWeekNumbers: false
    };

    this.pendingHR = 250;

    this.checkEndDate();
    this.getData();
  }
  @Output() showProceed = new EventEmitter<any>();
  getData() {
    this.kpi.getLogData({ param: 'dashboardInfo', userIdKPI: this.userId })
      .subscribe(res => {
        this.dashBoardData = res?.['dashboardInfo'][0] || [];
        this.totalEmloyee = this.dashBoardData.totalEmployee || 0;

        if(this.pendingHR == 0){
          this.showProceedButton = true;
        }
        this.showProceed.emit(this.showProceedButton);

      });
  }

  checkEndDate() {
    this.kpi.getLogData({ param: 'KPIendDate', userIdKPI: this.userId })
      .subscribe(res => {
        this.resData = res?.['KPIendDate'][0] || [];

        this.selectedDate = this.formatDateForInput(this.resData.kpi_last_date);
      });
  }
  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  closePopup() {

  }


  onActive() {
    const formattedDate = this.selectedDate || '';
    const formData = new FormData();

    formData.append('userId', this.userId);
    formData.append('date', formattedDate);

    console.log('Submitting EndDate:', formData);
    this.kpi.saveEndDate(formData).subscribe({
      next: (response) => {
        // this.finalApproverSelected.emit({'username': approverId, 'full_name': name});


      },
      error: (error) => {

      }
    });
  }

  onDateSelect() {
    console.log("selected Date : ", this.selectedDate);
    this.selectedDates.emit(this.selectedDate);

  }

}
