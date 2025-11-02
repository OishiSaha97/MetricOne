import { Component } from '@angular/core';
import {KpiFormComponent} from "../kp-module/kpi-form/kpi-form.component";
import {Router} from "@angular/router";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {CommonServiceService} from "../common-service.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {

  // constructor(public modalService: BsModalService) {}


  label="My KPI";
  choosedOption="Initial KPI settings";

  userList = [
    { year: 2000, designation: "Software Engineer", team: "Frontend", manager: "Reza", status: "Draft", SBU: "Datasoft", Remarks: "1", Action: "" },
    { year: 2001, designation: "Senior Developer", team: "Backend", manager: "Alice", status: "Not Submitted", SBU: "Datasoft", Remarks: "2", Action: "" },
    { year: 2002, designation: "Project Manager", team: "Frontend", manager: "Bob", status: "Submitted", SBU: "Datasoft", Remarks: "3", Action: "" },
    { year: 2003, designation: "QA Engineer", team: "QA", manager: "Charlie", status: "In Review", SBU: "Datasoft", Remarks: "4", Action: "" },
    { year: 2004, designation: "UI/UX Designer", team: "Design", manager: "David", status: "In HR Review", SBU: "Datasoft", Remarks: "5", Action: "" },
    { year: 2005, designation: "DevOps Engineer", team: "Infrastructure", manager: "Eva", status: "In Manager Review", SBU: "Datasoft", Remarks: "6", Action: "" },
    { year: 2006, designation: "Software Engineer", team: "Backend", manager: "Frank", status: "Reverted", SBU: "Datasoft", Remarks: "7", Action: "" },
    { year: 2007, designation: "Senior Developer", team: "Frontend", manager: "Grace", status: "Published", SBU: "Datasoft", Remarks: "8", Action: "" },
    { year: 2008, designation: "Project Manager", team: "QA", manager: "Hannah", status: "Draft", SBU: "Datasoft", Remarks: "9", Action: "" },
    { year: 2009, designation: "QA Engineer", team: "Design", manager: "Ian", status: "Not Submitted", SBU: "Datasoft", Remarks: "10", Action: "" },
    { year: 2010, designation: "UI/UX Designer", team: "Frontend", manager: "Jack", status: "Submitted", SBU: "Datasoft", Remarks: "11", Action: "" },
    { year: 2011, designation: "DevOps Engineer", team: "Backend", manager: "Kathy", status: "In Review", SBU: "Datasoft", Remarks: "12", Action: "" },
    { year: 2012, designation: "Software Engineer", team: "QA", manager: "Leo", status: "In HR Review", SBU: "Datasoft", Remarks: "13", Action: "" },
    { year: 2013, designation: "Senior Developer", team: "Design", manager: "Mona", status: "In Manager Review", SBU: "Datasoft", Remarks: "14", Action: "" },
    { year: 2014, designation: "Project Manager", team: "Frontend", manager: "Nina", status: "Reverted", SBU: "Datasoft", Remarks: "15", Action: "" },
    { year: 2015, designation: "QA Engineer", team: "Backend", manager: "Oscar", status: "Published", SBU: "Datasoft", Remarks: "16", Action: "" },
    { year: 2016, designation: "UI/UX Designer", team: "QA", manager: "Paul", status: "Draft", SBU: "Datasoft", Remarks: "17", Action: "" },
    { year: 2017, designation: "DevOps Engineer", team: "Design", manager: "Quinn", status: "Not Submitted", SBU: "Datasoft", Remarks: "18", Action: "" },
    { year: 2018, designation: "Software Engineer", team: "Frontend", manager: "Rita", status: "Submitted", SBU: "Datasoft", Remarks: "19", Action: "" },
    { year: 2019, designation: "Senior Developer", team: "Backend", manager: "Steve", status: "In Review", SBU: "Datasoft", Remarks: "20", Action: "" }
  ];
  userName:any;
  userId:any;
  pagination: any = {
    paramLimit: 100,
    paramOffset: 0,
  };
  filter_names: any = [];
  filter_values: any = [];
  filterParam: any = [];
  searchParam: any = '';
  orderParam: any = '';
  orderType: any = '';
  rowNo: any = 0;
  resData: any = [];
  resDataDup: any = [];
  scrollStatus: any = true;

  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }

  ngOnInit() {
    this.userName = localStorage.getItem('fullName');
    this.userId = localStorage.getItem('username');
    this.loadData('');

  }

  loadData(obj:any){
    let offset:any =null;
    if(obj=='increment'){
      offset=this.pagination.paramOffset+100;
    }else if(obj=='decrease'){
      offset=this.pagination.paramOffset-100;
    }else{
      offset=this.pagination.paramOffset
    }

    this.rowNo = 0;
    this.kpi.getKpiList({
      userIdKPI:this.userId,
      filterParam: this.filterParam,
      searchParam: this.searchParam,
      orderParam: this.orderParam,
      orderType: this.orderType,
      paramLimit: this.pagination.paramLimit,
      paramOffset: offset
    })
      .subscribe((res:any) => {
          this.pagination.paramOffset=offset
          this.resData = res.result['content'];
          this.resDataDup = res.result['content'];

          this.scrollStatus = false;
          // document.getElementById('dataTable').scrollTo(0, 0);

        }, (error:any) => {
        }
      );


  }



  getStatusClass(status: string): string {
    if (!status) return '';

    switch (status.toLowerCase()) {
      case 'draft':
        return 'status-draft';
      case 'not submitted':
        return 'status-not-submitted';
      case 'submitted':
        return 'status-submitted';
      case 'in review':
        return 'status-in-review';
      case 'in hr review':
        return 'status-in-hr-review';
      case 'in manager review':
        return 'status-in-manager-review';
      case 'reverted':
        return 'status-reverted';
      case 'published':
        return 'status-published';
      default:
        return '';
    }
  }




  onClick() {
    this.modalService.show(KpiFormComponent, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-dialog modal-dialog-centered modal-xl'
    });

    // You can pass data to the modal component

    // this.router.navigate(['', 'my-form']);
  }


}
