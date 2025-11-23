import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
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
  isInitCrossed: boolean = false;
  showEvaluation: boolean = false;
  isShowAdd: boolean = false;
 remarkList: any;
  isHierarchyOpen: boolean = false;

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
    const initialState = {
      currentStatus:'employee',
      view:true,
      draftShow:true
    };
    this.modalRef = this.modalService.show(KpiFormComponent, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-dialog modal-dialog-centered modal-max',
      initialState:initialState
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
  fullHierarchy: any;

  viewClick(user: any): void {

    console.log("user.edit_permission : ", user.edit_permission);
    console.log("this.timePeriod : ", this.timePeriod);

      if (this.timePeriod === 'evaluation'  ) {
        const initialState = {
          userData: user,
          title: 'Employee Evaluation',
          currentStatus:'employee',
          view:user.edit_permission,
        };

        this.modalRef = this.modalService.show(EvaluationComponent, {
          initialState:initialState,
          backdrop: 'static',
          keyboard: false,
          class: 'modal-dialog modal-dialog-centered modal-max'
        });

        let dataLoader = this.modalRef.content.saveEmitter.subscribe((res:any) => {
          this.loadData({});
          dataLoader.unsubscribe();
        });
      }
      else if(this.timePeriod === 'initiation'  ){

        const initialState = {
          kpiUserId: user.user_id,
          status: user.status,
          team: user.team,
          name: user.name,
          year: user.year,
          kpiId: user.id,
          approvalStatus: user.approval_status,
          currentStatus:'employee',
          view:user.edit_permission,
        };
        this.modalRef = this.modalService.show(KpiFormComponent, {
          backdrop: 'static',
          keyboard: false,
          class: 'modal-dialog modal-dialog-centered modal-max',
          initialState: initialState
        });

        let dataLoader = this.modalRef.content.saveEmitter.subscribe((res:any) => {
          this.loadData({});
          dataLoader.unsubscribe();
        });
      }
    }

  // activeDropdown: HTMLElement | null = null;
  // openHierarchy(user: any, event: MouseEvent) {
  //   event.stopPropagation();
  //   if (this.isHierarchyOpen) {
  //     this.closeAllDropdowns();
  //     return;
  //   }
  //   this.isHierarchyOpen = true;
  //   this.kpi.getLogData({ param: 'get_hierarchy', userIdKPI: this.userId, extraParam:user.team })
  //     .subscribe(res => {
  //       this.fullHierarchy = res?.['get_hierarchy'] || [];
  //
  //     });
  //
  //   const dropdown = (event.target as HTMLElement)
  //     .closest('.dropdown')!
  //     .querySelector('.hierarchy-dropdown') as HTMLElement;
  //
  //   this.activeDropdown = dropdown;
  //
  //   const rect = (event.target as HTMLElement).getBoundingClientRect();
  //
  //   dropdown.style.display = 'block';
  //   dropdown.style.top = (rect.top + 30) + 'px';
  //   dropdown.style.left = rect.left + 'px';
  //   dropdown.classList.add('show');
  //
  // }
  // @HostListener('document:click')
  // closeAllDropdowns() {
  //   if (this.activeDropdown) {
  //     this.activeDropdown.classList.remove('show');
  //   }
  //   this.isHierarchyOpen = false;
  // }


  openHierarchyIndex: number | null = null;
  activeDropdown: HTMLElement | null = null;

  openHierarchy(user: any, event: MouseEvent, index: number) {
    event.stopPropagation();

    // Toggle logic
    if (this.openHierarchyIndex === index) {
      this.closeDropdown();
      return;
    }

    this.openHierarchyIndex = index;

    // Load API
    this.kpi.getLogData({
      param: 'get_hierarchy',
      userIdKPI: this.userId,
      extraParam: user.team
    }).subscribe(res => {
      this.fullHierarchy = res?.['get_hierarchy'] || [];
    });

    // Position dropdown
    const dropdown = (event.target as HTMLElement)
      .closest('.dropdown')
      ?.querySelector('.hierarchy-dropdown') as HTMLElement;

    this.activeDropdown = dropdown;

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    dropdown.style.top = rect.top + 30 + 'px';
    dropdown.style.left = rect.left + 'px';

    dropdown.classList.add('show');
  }

  closeDropdown() {
    if (this.activeDropdown) {
      this.activeDropdown.classList.remove('show');
    }
    this.openHierarchyIndex = null;
  }

  @HostListener('document:click')
  onOutsideClick() {
    this.closeDropdown();
    this.closeRemarksDropdown();
  }


  openRemarksIndex: number | null = null;
  activeRemarksDropdown: HTMLElement | null = null;



  // openRemarks(user: any, event: MouseEvent, index: number) {
  //     this.kpi.getLogData({ param: 'reverted_remark_list', userIdKPI: this.userId, parameter:this.timePeriod,extraParam:user.id })
  //       .subscribe(res => {
  //         this.remarkList = res?.['reverted_remark_list'] || [];
  //
  //       });
  //     const dropdown = (event.target as HTMLElement)
  //       .closest('.dropdown')!
  //       .querySelector('.hierarchy-dropdown-remark') as HTMLElement;
  //
  //     const rect = (event.target as HTMLElement).getBoundingClientRect();
  //
  //     dropdown.style.display = 'block';
  //     dropdown.style.top = (rect.top + 20) + 'px';
  //     dropdown.style.left = rect.left + 'px';
  //   }

  openRemarks(user: any, event: MouseEvent, index: number) {
    event.stopPropagation();

    // If clicking same index → toggle close
    if (this.openRemarksIndex === index) {
      this.closeRemarksDropdown();
      return;
    }

    this.openRemarksIndex = index;

    this.kpi.getLogData({
      param: 'reverted_remark_list',
      userIdKPI: this.userId,
      parameter:this.timePeriod,
      extraParam:user.id

    }).subscribe(res => {
      this.remarkList = res?.['reverted_remark_list'] || [];
    });


    const dropdown = (event.target as HTMLElement)
      .closest('.dropdown')
      ?.querySelector('.hierarchy-dropdown-remark') as HTMLElement;

    this.activeRemarksDropdown = dropdown;

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    dropdown.style.top = rect.top + 30 + 'px';
    dropdown.style.left = rect.left + 'px';

    dropdown.classList.add('show');
  }

  closeRemarksDropdown() {
    if (this.activeRemarksDropdown) {
      this.activeRemarksDropdown.classList.remove('show');
    }
    this.openRemarksIndex = null;
  }



}
