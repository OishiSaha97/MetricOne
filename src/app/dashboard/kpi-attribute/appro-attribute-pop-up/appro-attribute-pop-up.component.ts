import { Component } from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../common-service.service";

@Component({
  selector: 'app-appro-attribute-pop-up',
  templateUrl: './appro-attribute-pop-up.component.html',
  styleUrls: ['./appro-attribute-pop-up.component.css']
})
export class ApproAttributePopUpComponent {
  userId:any;
  dropdownOpen = false;
  selectedKpiType = '';
  mode:any = '';
  kpiType = ['KPI Category', 'KPI Behavioural Attributes', 'Category Rating', 'Behavioural Rating'];
  attributeName: any = '';

  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {}
  ngOnInit(): void {

    this.userId = localStorage.getItem('username');


  }



  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(type: string, event: Event) {
    this.selectedKpiType = type;
    this.dropdownOpen = false;
    event.stopPropagation();
  }

  save() {

    const formData = new FormData();

    formData.append('userId', this.userId);
    formData.append('attributeName', this.attributeName);
    formData.append('selectedKpiType', this.selectedKpiType);
    console.log('Submitting Final Approver:', formData);

    this.kpi.saveKPIAttribute(formData).subscribe({
      next: (response) => {
        this.modalRef.hide();

      },
      error: (error) => {

      }
    });


  }

  closePopup() {
    this.modalRef.hide();
  }

}
