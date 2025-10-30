import { Component } from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../common-service.service";

@Component({
  selector: 'app-final-approval-pop-up',
  templateUrl: './final-approval-pop-up.component.html',
  styleUrls: ['./final-approval-pop-up.component.css']
})
export class FinalApprovalPopUpComponent {
   isOpen: boolean = false;
  constructor(public bsModalRef: BsModalRef,
              private kpi: CommonServiceService) {}

  finalApprover: any;
  aprrovers: any=[];
  searchApprover: any;

  closePopup() {
    this.bsModalRef.hide();
  }

  onSubmit() {

  }

  toggleDropdown() {
    this.aprrovers = [
      {id: 1,name:'abc' },
      {id: 2,name:'abc' },
      {id: 3,name:'abc' },
    ]


  }

  selectOption( option: any) {
    this.finalApprover = option;
  }

  filterApprovers() {

  }
}
