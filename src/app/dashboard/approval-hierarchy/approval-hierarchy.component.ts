import {Component, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ApproHierarchyPopUpComponent} from "./appro-hierarchy-pop-up/appro-hierarchy-pop-up.component";


@Component({
  selector: 'app-approval-hierarchy',
  templateUrl: './approval-hierarchy.component.html',
  styleUrls: ['./approval-hierarchy.component.css']
})
export class ApprovalHierarchyComponent {
  label = "Approval Hierarchy";
   modalRef?: BsModalRef;
  constructor(private modalService: BsModalService) {
  }

  userList = [
    { designation: "Software Engineer", team: "Frontend" },
    { designation: "Senior Developer", team: "Backend" },
    { designation: "Project Manager", team: "Frontend" },
    { designation: "QA Engineer", team: "QA" },
    { designation: "UI/UX Designer", team: "Design" },
    { designation: "DevOps Engineer", team: "Infrastructure" },
    { designation: "Software Engineer", team: "Backend" },
    { designation: "Senior Developer", team: "Frontend" },
    { designation: "Project Manager", team: "QA" },
    { designation: "QA Engineer", team: "Design" }
  ];


  @ViewChild('template') template!: TemplateRef<any>;

  edit() {
    this.modalRef = this.modalService.show(ApproHierarchyPopUpComponent, {
      class: 'modal-lg modal-dialog-centered',
      backdrop: 'static',
      keyboard: false
    });
  }

}
