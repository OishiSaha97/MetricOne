import { Component } from '@angular/core';
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {BsModalRef} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../common-service.service";

@Component({
  selector: 'app-kpi-modification-setting',
  templateUrl: './kpi-modification-setting.component.html',
  styleUrls: ['./kpi-modification-setting.component.css']
})
export class KpiModificationSettingComponent {
  bsConfig?: Partial<BsDatepickerConfig>;
  today: any;
  selectedDate: Date | undefined = undefined;
  totalEmloyee: any;
  userId:any;

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

    const [day, month, year] = '25-06-2025'.split('-').map(Number);
    this.selectedDate = new Date(year, month - 1, day);
  }

  onActive() {

  }

  closePopup() {

  }
}
