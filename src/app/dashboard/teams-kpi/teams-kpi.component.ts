import { Component } from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../common-service.service";
import {KpiFormComponent} from "../kp-module/kpi-form/kpi-form.component";
import {EvaluationComponent} from "../kp-module/evaluation/evaluation.component";

@Component({
  selector: 'app-teams-kpi',
  templateUrl: './teams-kpi.component.html',
  styleUrls: ['./teams-kpi.component.css']
})
export class TeamsKPIComponent {
  label="Team’s KPI";
  choosedOption="Initial KPI settings";

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
  userName:any;
  userId:any;
  timePeriod:any;

  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }

  ngOnInit() {
    this.userName = localStorage.getItem('fullName');
    this.userId = localStorage.getItem('username');
    this.timePeriod = localStorage.getItem('timePeriod');
    this.loadData('');

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
    this.kpi.getTeamKpiList({
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

  viewDetails(user: any) {
    if(this.timePeriod === 'initiation'){
      const initialState = {
        kpiUserId: user.user_id,
        status: user.status,
        team: user.team,
        name: user.name,
        year: user.year,
        mode:"approver",
        kpiId: user.id,
      };
      this.modalService.show(KpiFormComponent, {
        backdrop: 'static',
        keyboard: false,
        class: 'modal-dialog modal-dialog-centered modal-xl',
        initialState: initialState
      });
    }
    else if(this.timePeriod === 'evaluation'){
      const initialState = {
        userData: user,
        title: 'Manager Evaluation',
        currentStatus:'manager',
      };
      this.modalService.show(EvaluationComponent, {
        backdrop: 'static',
        keyboard: false,
        class: 'modal-dialog modal-dialog-centered modal-xl',
        initialState: initialState
      });
    }
  }


  isClickable(user: any): boolean {
    return user.status === 'Submitted for Reviewer' || user.editPermission;
  }

}
