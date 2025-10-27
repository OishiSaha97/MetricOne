import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {KpiFormComponent} from "../kp-module/kpi-form/kpi-form.component";
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

   name = "Skipper";
   designation = "full stack web-mobile-ml dev";

  modalRef?: BsModalRef;

   constructor(private router: Router,private modalService: BsModalService){}

  logout()
  {
        this.router.navigate(['']);
  }

  onClick() {
    this.modalRef = this.modalService.show(KpiFormComponent, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    });

    // You can pass data to the modal component
    this.modalRef.content.title = 'Add KPI Form';
    this.modalRef.content.someInputData = { year: 2025 };
  }

}
