import {Component, Input} from '@angular/core';
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
  selectedDate: Date | undefined = undefined;
  totalEmloyee: any;
  userId:any;
  @Input() tabs: any;

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

    this.totalEmloyee = 250;

    console.log("tabs : ", this.tabs);
    const [day, month, year] = '25-06-2025'.split('-').map(Number);
    this.selectedDate = new Date(year, month - 1, day);
  }


  closePopup() {

  }


  onActive() {
    const formattedDate =
      this.selectedDate instanceof Date
        ? this.selectedDate.toISOString().split('T')[0]
        : String(this.selectedDate);
    const formData = new FormData();

    formData.append('userId', this.userId);
    formData.append('endDate', formattedDate);

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

  }
}
