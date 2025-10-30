import { Component } from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-appro-attribute-pop-up',
  standalone: true,
  imports: [],
  templateUrl: './appro-attribute-pop-up.component.html',
  styleUrl: './appro-attribute-pop-up.component.css'
})
export class ApproAttributePopUpComponent {

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
    this.modalRef.hide();
  }

}
