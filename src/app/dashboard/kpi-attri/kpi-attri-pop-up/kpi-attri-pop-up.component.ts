import { Component } from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-kpi-attri-pop-up',
  templateUrl: './kpi-attri-pop-up.component.html',
  styleUrls: ['./kpi-attri-pop-up.component.css']
})
export class KpiAttriPopUpComponent {

  dropdownOpen = false;
  selectedKpiType = '';
  kpiType = ['KPI Category', 'KPI Behavioural Attributes', 'Category Rating', 'Behavioural Rating'];
  constructor(public modalRef: BsModalRef) {}
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(type: string, event: Event) {
    this.selectedKpiType = type;
    this.dropdownOpen = false;
    event.stopPropagation();
  }

  save() {
    // your save logic here
    this.modalRef.hide(); // this will close the popup
  }


}
