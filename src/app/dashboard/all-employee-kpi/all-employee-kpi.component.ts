import { Component } from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../common-service.service";

@Component({
  selector: 'app-all-employee-kpi',
  templateUrl: './all-employee-kpi.component.html',
  styleUrls: ['./all-employee-kpi.component.css']
})
export class AllEmployeeKPIComponent {
  filterParam: any = [];
  searchParam: any = '';
  orderParam: any = '';
  orderType: any = '';
  rowNo: any = 0;

  label="All Employee KPI";
  choosedOption= "Initial KPI settings";

  userList: any[] = [];
  pagination: any = {
    paramLimit: 100,
    paramOffset: 0,
  };
  scrollStatus: any = true;

  ngOnInit() {
    this.loadData('');
  }
  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
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
    this.kpi.getAllEmpKpiList({
      filterParam: this.filterParam,
      searchParam: this.searchParam,
      orderParam: this.orderParam,
      orderType: this.orderType,
      paramLimit: this.pagination.paramLimit,
      paramOffset: offset
    })
      .subscribe((res:any) => {
          this.pagination.paramOffset=offset
          this.userList = res.result['content'];
          this.userList = res.result['content'];

          this.scrollStatus = false;
          // document.getElementById('dataTable').scrollTo(0, 0);

        }, (error:any) => {
        }
      );


  }

}
