import { Component } from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../common-service.service";
import {EvaluationComponent} from "../kp-module/evaluation/evaluation.component";
import {KpiFormComponent} from "../kp-module/kpi-form/kpi-form.component";

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
    this.kpi.getAllEmpKpiList({
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
          this.userList = res.result['content'];
          this.userList = res.result['content'];

          this.scrollStatus = false;
          // document.getElementById('dataTable').scrollTo(0, 0);

        }, (error:any) => {
        }
      );


  }

  isClickable(user: any): boolean {
    return user.status === 'closed' ;
    // return user.status === 'closed' || user.editPermission;
  }


  viewDetails(user: any) {
    // if(user.editPermission == true){
    if(this.timePeriod == 'evaluation'){
      const initialState = {
        userData: user,
        title: 'HR Evaluation',
        currentStatus:'hr',
      };

      this.modalRef = this.modalService.show(EvaluationComponent, {
        backdrop: 'static',
        keyboard: false,
        class: 'modal-dialog modal-dialog-centered modal-xl',
        initialState: initialState
      });

      let dataLoader = this.modalRef.content.saveEmitter.subscribe((res:any) => {
        this.loadData({});
        dataLoader.unsubscribe();
      });

    }else{
      const initialState = {
        kpiUserId: user.user_id,
        status: user.status,
        team: user.team,
        name: user.name,
        year: user.year,
        mode:"approver",
        kpiId: user.id,
      };
      this.modalRef = this.modalService.show(KpiFormComponent, {
        backdrop: 'static',
        keyboard: false,
        class: 'modal-dialog modal-dialog-centered modal-xl',
        initialState: initialState
      });

      let dataLoader = this.modalRef.content.saveEmitter.subscribe((res:any) => {
        this.loadData({});
        dataLoader.unsubscribe();
      });

    }

  }


  search() {
   this.loadData({});
  }

  fullHierarchy: any;
  openHierarchy(user: any) {
    this.kpi.getLogData({ param: 'get_hierarchy', userIdKPI: this.userId, extraParam:user.team })
      .subscribe(res => {
        this.fullHierarchy = res?.['get_hierarchy'] || [];

      });

    // const dropdown = (event.target as HTMLElement)
    //   .closest('.dropdown')!
    //   .querySelector('.hierarchy-dropdown') as HTMLElement;
    //
    // const rect = (event.target as HTMLElement).getBoundingClientRect();
    //
    // dropdown.style.display = 'block';
    // dropdown.style.top = (rect.top + 30) + 'px';
    // dropdown.style.left = rect.left + 'px';

  }
}
