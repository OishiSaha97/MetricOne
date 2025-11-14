import { Component } from '@angular/core';
import {KpiFormComponent} from "../kp-module/kpi-form/kpi-form.component";
import {Router} from "@angular/router";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {CommonServiceService} from "../common-service.service";
import {EvaluationComponent} from "../kp-module/evaluation/evaluation.component";
import {SettingsComponent} from "../settings/settings.component";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {

  // constructor(public modalService: BsModalService) {}


  label="My KPI";
  choosedOption="Initial KPI settings";

  userName:any;
  userId:any;
  timePeriod:any;
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
  viewDetails: any = [];
  resDataDup: any = [];
  scrollStatus: any = true;
  check_kpi:any =[];
  year:any = '2025';
  isShowAdd: boolean = false;

  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }

  ngOnInit() {
    this.userName = localStorage.getItem('fullName');
    this.userId = localStorage.getItem('username');
    this.timePeriod = localStorage.getItem('timePeriod');
    this.loadData('');
    //this.checkInitiationDate();
    // this.kpi.getLogData({param: 'check_kpi_my',objectId:this.year,extraParam:this.userId})
    //   .subscribe(res => {
    //
    //       this.check_kpi = Array.isArray(res?.['check_kpi_my']) ? res?.['check_kpi_my'] : res?.['check_kpi_my']
    //       console.log(this.check_kpi);
    //     },
    //     (error) => {
    //       console.error("Error fetching permission list", error);
    //     }
    //   );


  }

  // checkInitiationDate() {
  //   this.kpi.getLogData({ param: 'initiationCheck', userIdKPI: this.userId })
  //     .subscribe(res => {
  //       this.isInitCrossed = res?.['initiationCheck'][0].deadline_crossed;
  //       if(this.isInitCrossed){
  //         this.showEvaluation = true;
  //       }
  //     });
  // }


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
          this.isShowAdd = res.result['addPermission']?.[0]?.addPermission;

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
    this.modalRef = this.modalService.show(KpiFormComponent, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-dialog modal-dialog-centered modal-xl'
    });

    if (this.modalRef) {
      const modalContent = this.modalRef.content as SettingsComponent;

      const subscription = modalContent.requestEmitter.subscribe(() => {
        this.loadData('');
      });

      this.modalRef.onHidden?.subscribe(() => {
        subscription.unsubscribe();
      });
    }

    let dataLoader = this.modalRef.content.saveEmitter.subscribe((res:any) => {
      this.loadData({});
      dataLoader.unsubscribe();
    });

    // this.router.navigate(['', 'my-form']);
  }


  search() {
     this.loadData({})
  }

  // modalRef: BsModalRef ;

  viewClick(user: any): void {

      if (this.timePeriod === 'evaluation' && user.edit_permission ) {
        const initialState = {
          userData: user,
          title: 'Employee Evaluation',
          currentStatus:'employee',
        };

        this.modalRef = this.modalService.show(EvaluationComponent, {
          initialState:initialState,
          backdrop: 'static',
          keyboard: false,
          class: 'modal-dialog modal-dialog-centered modal-xl'
        });

        let dataLoader = this.modalRef.content.saveEmitter.subscribe((res:any) => {
          this.loadData({});
          dataLoader.unsubscribe();
        });
      }
      else if(this.timePeriod === 'initiation' && user.edit_permission){
        const initialState = {
          kpiUserId: user.user_id,
          status: user.status,
          team: user.team,
          name: user.name,
          year: user.year,
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


}
