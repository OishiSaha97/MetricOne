import { Component } from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ApproAttributePopUpComponent} from "./appro-attribute-pop-up/appro-attribute-pop-up.component";
import {CommonServiceService} from "../common-service.service";

@Component({
  selector: 'app-kpi-attribute',
  templateUrl: './kpi-attribute.component.html',
  styleUrls: ['./kpi-attribute.component.css']
})
export class KpiAttributeComponent {
  label="KPI Attributes";
  modalRef?: BsModalRef;
  mode: any;
  constructor(private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }

  userList = [
    { configuredName: "Revert Config", configuredType: "Type A", createdBy: "Admin", createdOn: "2025-01-01", updatedBy: "Admin", updatedOn: "2025-01-10", action: "" },
    { configuredName: "Alice Config", configuredType: "Type B", createdBy: "Alice", createdOn: "2025-01-02", updatedBy: "Bob", updatedOn: "2025-01-11", action: "" },
    { configuredName: "Bob Config", configuredType: "Type A", createdBy: "Bob", createdOn: "2025-01-03", updatedBy: "Charlie", updatedOn: "2025-01-12", action: "" },
    { configuredName: "Charlie Config", configuredType: "Type C", createdBy: "Charlie", createdOn: "2025-01-04", updatedBy: "David", updatedOn: "2025-01-13", action: "" },
    { configuredName: "David Config", configuredType: "Type B", createdBy: "David", createdOn: "2025-01-05", updatedBy: "Eva", updatedOn: "2025-01-14", action: "" },
    { configuredName: "Eva Config", configuredType: "Type D", createdBy: "Eva", createdOn: "2025-01-06", updatedBy: "Frank", updatedOn: "2025-01-15", action: "" },
    { configuredName: "Frank Config", configuredType: "Type B", createdBy: "Frank", createdOn: "2025-01-07", updatedBy: "Grace", updatedOn: "2025-01-16", action: "" },
    { configuredName: "Grace Config", configuredType: "Type A", createdBy: "Grace", createdOn: "2025-01-08", updatedBy: "Hannah", updatedOn: "2025-01-17", action: "" },
    { configuredName: "Hannah Config", configuredType: "Type C", createdBy: "Hannah", createdOn: "2025-01-09", updatedBy: "Ian", updatedOn: "2025-01-18", action: "" },
    { configuredName: "Ian Config", configuredType: "Type B", createdBy: "Ian", createdOn: "2025-01-10", updatedBy: "Jack", updatedOn: "2025-01-19", action: "" }
  ];


  edit()
  {
    this.modalRef = this.modalService.show(ApproAttributePopUpComponent,{
      class: 'modal-dialog-centered',
      backdrop: 'static',
      keyboard: false,
    });
  }


  add() {
    this.modalRef = this.modalService.show(ApproAttributePopUpComponent,{
      class: 'modal-dialog modal-dialog-centered modal-max-smaller',
      backdrop: 'static',
      keyboard: false,
      initialState: {
        mode: this.mode = 'add',
      },
    });

  }
}
