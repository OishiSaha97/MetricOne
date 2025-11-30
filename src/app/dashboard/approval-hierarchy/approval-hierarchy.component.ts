import {Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ApproHierarchyPopUpComponent} from "./appro-hierarchy-pop-up/appro-hierarchy-pop-up.component";
import {CommonServiceService} from "../common-service.service";
import {FinalApprovalPopUpComponent} from "./final-approval-pop-up/final-approval-pop-up.component";
import {Router} from "@angular/router";
import {CookiesService} from "../cookies.service";

declare var $: any;
@Component({
  selector: 'app-approval-hierarchy',
  templateUrl: './approval-hierarchy.component.html',
  styleUrls: ['./approval-hierarchy.component.css']
})
export class ApprovalHierarchyComponent {
  label = "Approval Hierarchy";
   modalRef?: BsModalRef;
  @ViewChild('errorToast', { static: false }) errorToast!: ElementRef;
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
  scrollStatus: any = true;
  scrollTop: any = 0;

  resData: any = [];
  resDataDup: any = [];

  rightCheck: any = [];
  checkBox: any = [];
  rowNo: any = 0;
  userName:any;
  userId:any;
  finalApprover: any = [];
  selectedType: string='';
  mode: any;
  toastMessage:any= '';
  role:any;
  token: any;


  constructor(private router: Router,
              private modalService: BsModalService,
              private kpi: CommonServiceService,
              public cookieService: CookiesService) {
  }


  ngOnInit() {
    this.role = this.cookieService.getCookie('role');
    this.userId = this.cookieService.getCookie('username');
    this.userName = this.cookieService.getCookie('fullName');
    this.token = this.cookieService.getCookie('token');
    if (this.role !== 'hr') {
      this.router.navigate(['/dashboard/404']);
      return;
    }
    // this.userName = localStorage.getItem('fullName');
    // this.userId = localStorage.getItem('username');
    this.loadData('');
    this.getFinalApprover();

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
    console.log("loading !!!")
    this.kpi.getHierarchyList({
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

  showToast(msg: string) {
    this.toastMessage = msg;

    setTimeout(() => {
      const el = this.errorToast.nativeElement;

      el.classList.add('show');

      setTimeout(() => {
        el.classList.remove('show');
      }, 5000);

    }, 0);
  }


  edit(data:any) {
    // console.log(data)
    // const initialState = {
    //   team_name: data.team_name,
    // };
    if(!this.finalApprover && this.finalApprover.length <= 0){
      return;
    }

    if(data.hierarchy_with_final && data.hierarchy_with_final.length){
      this.mode = 'edit';
    }
    else{
      this.mode = 'add';
    }
    this.modalRef = this.modalService.show(ApproHierarchyPopUpComponent, {
      class: 'modal-dialog modal-dialog-centered modal-lg',
      initialState: {
        team_name: data.team_name,
        finalApprover:this.finalApprover,
        mode: this.mode
      },
      backdrop: 'static',
      keyboard: false,

    });
    this.modalRef.content.hierarchySaved.subscribe(() => {
      this.loadData('');
      if(this.mode == 'edit'){
        this.showToast("Approval Hierarchy updated successfully.");
      }else{
        this.showToast(" Approval Hierarchy added successfully.");
      }
    });


  }

  onFinalApr(apr: any) {
    this.selectedType = apr.name;

  }

  getFinalApprovers() {
    this.modalRef = this.modalService.show(FinalApprovalPopUpComponent, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-dialog modal-dialog-centered modal-lg',
      initialState: {
        mode: this.mode,
        finalApprover: this.mode === 'edit' ? this.finalApprover : []
      },

    });
    const modalContent = this.modalRef.content as FinalApprovalPopUpComponent;
    modalContent.finalApproverSelected.subscribe((approver: any) => {
      console.log('Final Approver Received:', approver);
      this.finalApprover = approver;
      this.loadData('');
    });
    modalContent.modeEdit.subscribe((mode: any) => {
      console.log('mode Received:', mode);
      this.mode = mode;
    });


  }

  getFinalApprover(){
      this.kpi.getLogData({ param: 'final_approver', userIdKPI: this.userId })
        .subscribe(res => {
          this.finalApprover = res?.['final_approver'][0] || [];
          if (this.finalApprover && this.finalApprover.full_name) {
            this.mode = 'edit';
          }
          else{
            this.mode = 'add';
          }
        });

  }

  search() {
    this.pagination.paramOffset=0;
    this.loadData('');

  }
}
