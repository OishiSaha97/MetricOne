import {Component, ElementRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../common-service.service";
import {EvaluationComponent} from "../kp-module/evaluation/evaluation.component";
import {KpiFormComponent} from "../kp-module/kpi-form/kpi-form.component";
import {SettingsComponent} from "../settings/settings.component";
import {Router} from "@angular/router";

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
  initialtionDate: string | Date | undefined = undefined;
  dateData: any;
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  choosedOptionDate: any;
  role:any;


  constructor(private router: Router,public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }

  timerId: any;
   target!: Date;



  ngOnInit() {
    this.role = localStorage.getItem('role');
    if (this.role !== 'hr') {
      this.router.navigate(['/dashboard/404']);
      return;
    }

    this.timePeriod = localStorage.getItem('timePeriod');
    this.checkEndDate();
    this.timerId = setInterval(() => this.updateCountdown(), 1000);

    this.userName = localStorage.getItem('fullName');
    this.userId = localStorage.getItem('username');
    this.loadData('');
    this.userId = localStorage.getItem('username');
    // this.role = localStorage.getItem('role');
    // console.log(this.role);


  }

  checkEndDate() {
    let param = '';
      if(this.timePeriod == 'evaluation'){
         param = 'EvaEndDate'
      }else{
          param = 'KPIendDate'
      }
    this.kpi.getLogData({ param: param, userIdKPI: this.userId })
      .subscribe(res => {
        this.dateData = res?.[param][0] || [];

        this.initialtionDate = this.formatToLongDate(this.dateData.kpi_last_date);
        this.target = new Date(this.dateData.kpi_last_date + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [year, month, day] = this.initialtionDate.split('-').map(Number);
        const kpiDate = new Date(year, month - 1, day);

        this.updateCountdown();
      });
  }


  formatToLongDate(dateStr: string): string {
    if (!dateStr) return '';

    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);

    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

 pad(num: number): string {
    return String(num).padStart(2, '0');
  }

  updateCountdown(): void {
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const now = new Date();
    let diff = (this.target.getTime() + ONE_DAY) - now.getTime();

    if (diff <= 0) {
      this.choosedOptionDate = '00:00:00:00';
      clearInterval(this.timerId);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * 1000 * 60 * 60 * 24;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * 1000 * 60;

    const seconds = Math.floor(diff / 1000);

    // Format: DD:HH:MM:SS
    this.choosedOptionDate =
      `${this.pad(days)}:${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }



  openSetting(): void {
    this.modalRef = this.modalService.show(SettingsComponent, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-dialog modal-dialog-centered modal-lg',
      // initialState: {
      //   mode: this.mode,
      // },
    });

    if (this.modalRef) {
      const modalContent = this.modalRef.content as SettingsComponent;

      const subscription = modalContent.requestEmitter.subscribe(() => {
        this.checkEndDate();
      });

      this.modalRef.onHidden?.subscribe(() => {
        subscription.unsubscribe();
      });
    }
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

  view:any;
  @ViewChild('errorToast', { static: false }) errorToast!: ElementRef;
  toastMessage: string = '';

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


  viewDetails(user: any) {

    let viewMode: any = null;

    if (user.viewPermission == true) {
      viewMode = true;
    }

    if (this.timePeriod == 'evaluation') {

      const initialState = {
        userData: user,
        title: 'HR Evaluation',
        currentStatus: 'hr',
        view: user.editPermission      // <-- apply view mode here
      };

      this.modalRef = this.modalService.show(EvaluationComponent, {
        backdrop: 'static',
        keyboard: false,
        class: 'modal-dialog modal-dialog-centered modal-max',
        initialState
      });

      let dataLoader = this.modalRef.content.saveEmitter.subscribe((res:any) => {
        this.loadData({});
        dataLoader.unsubscribe();
      });

    } else {

      const initialState = {
        kpiUserId: user.user_id,
        status: user.status,
        team: user.team,
        name: user.name,
        year: user.year,
        mode: "approver",
        kpiId: user.id,
        currentStatus: 'hr',
        view: user.editPermission
      };

      this.modalRef = this.modalService.show(KpiFormComponent, {
        backdrop: 'static',
        keyboard: false,
        class: 'modal-dialog modal-dialog-centered modal-max',
        initialState
      });

      let dataLoader = this.modalRef.content.saveEmitter.subscribe((res:any) => {
        this.loadData({});
        if (res?.action == 'revert') {
          this.showToast("KPI Reverted Successfully.");
        }else if(res?.action === 'publish'){
          this.showToast("KPI Published Successfully.");
        }
        else if(res?.action === 'submit' ){
          this.showToast("KPI Submitted Successfully.");
        }
        else if (res?.action === 'forward') {
          this.showToast("KPI Forwarded Successfully.");
        }
        dataLoader.unsubscribe();
      });

    }
  }

  isViewAllowed(data: any) {
    return data.editPermission || data.viewPermission;
  }

  // viewDetails(user: any) {
  //   // if(user.status === 'closed'){
  //   //   this.view = ;
  //   // }
  //
  //   if(this.timePeriod == 'evaluation'){
  //     const initialState = {
  //       userData: user,
  //       title: 'HR Evaluation',
  //       currentStatus:'hr',
  //
  //     };
  //
  //     this.modalRef = this.modalService.show(EvaluationComponent, {
  //       backdrop: 'static',
  //       keyboard: false,
  //       class: 'modal-dialog modal-dialog-centered modal-max',
  //       initialState: initialState
  //     });
  //
  //     let dataLoader = this.modalRef.content.saveEmitter.subscribe((res:any) => {
  //       this.loadData({});
  //       dataLoader.unsubscribe();
  //     });
  //
  //   }else{
  //     const initialState = {
  //       kpiUserId: user.user_id,
  //       status: user.status,
  //       team: user.team,
  //       name: user.name,
  //       year: user.year,
  //       mode:"approver",
  //       kpiId: user.id,
  //       currentStatus:'hr',
  //       view:true
  //
  //     };
  //     this.modalRef = this.modalService.show(KpiFormComponent, {
  //       backdrop: 'static',
  //       keyboard: false,
  //       class: 'modal-dialog modal-dialog-centered modal-max',
  //       initialState: initialState
  //     });
  //
  //     let dataLoader = this.modalRef.content.saveEmitter.subscribe((res:any) => {
  //       this.loadData({});
  //       dataLoader.unsubscribe();
  //     });
  //
  //   }
  //
  // }


  search() {
   this.loadData({});
  }

  fullHierarchy: any;
  openHierarchy(user: any) {
    this.kpi.getLogData({ param: 'get_hierarchy', userIdKPI: this.userId, extraParam:user.team,pid:user.id  })
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
  remarkList: any;
  openRemarks(user: any) {
    this.kpi.getLogData({ param: 'reverted_remark_list', userIdKPI: this.userId, parameter:this.timePeriod,extraParam:user.id })
      .subscribe(res => {
        this.remarkList = res?.['reverted_remark_list'] || [];

      });
  }
}
