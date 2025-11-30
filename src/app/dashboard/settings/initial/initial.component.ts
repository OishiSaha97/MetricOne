import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {BsModalRef} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../common-service.service";
import {CookiesService} from "../../cookies.service";

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.css']
})
export class InitialComponent {
  bsConfig?: Partial<BsDatepickerConfig>;
  today: any;
  @Input() mode: any;
  selectedDate: string | null = null;
  selectedDateEva: string | null = null;
  @Output() selectedDates: EventEmitter<string | null> = new EventEmitter<string | null>();
  @Output() selectedDatesEva: EventEmitter<string | null> = new EventEmitter<string | null>();
  totalEmloyee: any;
  userId:any;
  timePeriod:any;
  @Input() tabs: any;
   resData: any;
   dashBoardData: any;
    completed: any;
   showProceedButton: boolean = false;

  constructor(public bsModalRef: BsModalRef,
              private kpi: CommonServiceService,
              public cookieService: CookiesService) {}
  ngOnInit() {
    this.userId = this.cookieService.getCookie('username');
    this.timePeriod = this.cookieService.getCookie('timePeriod');
    this.today = new Date();
    this.bsConfig = {
      adaptivePosition: false,
      containerClass: 'theme-default bs-datepicker-top',
      dateInputFormat: 'DD MMM YYYY',
      showWeekNumbers: false
    };

    this.completed = 250;
    this.checkEndDate();
    if(this.mode=='edit'){
      this.getData();
    }
      const now = new Date();
      this.today = now.toISOString().split('T')[0];  // yyyy-mm-dd

  }
  @Output() showProceed = new EventEmitter<any>();
  getData() {
    this.kpi.getLogData({ param: 'dashboardInfo', userIdKPI: this.userId })
      .subscribe(res => {
        this.dashBoardData = res?.['dashboardInfo'][0] || [];
        this.totalEmloyee = this.dashBoardData.totalEmployee || 0;

        if(this.completed == this.totalEmloyee){
          this.showProceedButton = true;
        }
        this.showProceed.emit(this.showProceedButton);

      });
  }

  checkEndDate() {
    let param;
    if(this.tabs==='evaluation'){
      param='EvaEndDate';
    }
    else{
      param='KPIendDate';
    }
    this.kpi.getLogData({ param: param, userIdKPI: this.userId })
      .subscribe(res => {
        if(this.tabs==='evaluation'){
          this.resData = res?.['EvaEndDate'][0] || [];
          this.selectedDateEva = this.formatDateForInput(this.resData.kpi_last_date);
          this.selectedDatesEva.emit(this.selectedDateEva);
        }
        else{
          this.resData = res?.['KPIendDate'][0] || [];

          this.selectedDate = this.formatDateForInput(this.resData.kpi_last_date);
          this.selectedDates.emit(this.selectedDate);
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
    if(this.tabs === 'evaluation'){
      this.selectedDatesEva.emit(this.selectedDateEva);
    }
    else{
      this.selectedDates.emit(this.selectedDate);
    }

  }

}
