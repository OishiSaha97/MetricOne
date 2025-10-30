import {Component, EventEmitter, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../common-service.service";

@Component({
  selector: 'app-final-approval-pop-up',
  templateUrl: './final-approval-pop-up.component.html',
  styleUrls: ['./final-approval-pop-up.component.css']
})
export class FinalApprovalPopUpComponent {
    mode:any;
   isOpen: boolean = false;
   filterAprroversList: any=[];
   constructor(public bsModalRef: BsModalRef,
              private kpi: CommonServiceService) {}
  userId:any;
  @Output() finalApproverSelected = new EventEmitter<any>();
  finalApprover: any;
  aprrovers: any=[];
  searchApprover: any;

  ngOnInit(): void {

    this.userId = localStorage.getItem('username');
    this.getUserList();
  }

  closePopup() {
    this.bsModalRef.hide();
  }

  onSubmit() {
    this.finalApproverSelected.emit(this.finalApprover);
    this.bsModalRef.hide();

    const formData = new FormData();

    formData.append('userId', this.userId);
    formData.append('approverId', this.finalApprover?.username || '');
    formData.append('name', this.finalApprover?.full_name || '');
    console.log('Submitting Final Approver:', formData);
    this.kpi.saveFinalHierarchy(formData).subscribe({
      next: (response) => {

      },
      error: (error) => {

      }
    });
  }

  toggleDropdown() {
    this.aprrovers = [
      {id: 1,name:'abc' },
      {id: 2,name:'abc' },
      {id: 3,name:'abc' },
    ]


  }

  selectOption( option: any) {
    this.finalApprover = option;
  }

  filterApprovers() {

  }

  getUserList() {
    this.kpi.getLogData({param: 'user-name-list',userIdKPI:this.userId})
      .subscribe(res => {
          this.aprrovers = res?.['user-name-list'];
          this.filterAprroversList = res?.['user-name-list'];
        }, error => {
          // this.alerts.closeAlert();
          // this.alerts.toast('error', 'Unable to fetch incident Category List.  Please try again. If the problem persists then please contact our Support Team')
        }
      );
  }
}
