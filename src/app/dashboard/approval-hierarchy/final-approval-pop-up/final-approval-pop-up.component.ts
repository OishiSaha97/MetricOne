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
   isOpenNew: boolean = false;
   filterAprroversList: any=[];
   constructor(public bsModalRef: BsModalRef,
              private kpi: CommonServiceService) {}
  userId:any;
  @Output() finalApproverSelected = new EventEmitter<any>();
  @Output() modeEdit = new EventEmitter<any>();
  finalApprover: any;
  finalApproverNew: any;
  aprrovers: any=[];
  searchApprover: any;

  ngOnInit(): void {

    this.userId = localStorage.getItem('username');
    this.getUserList();

    console.log("mode:", this.mode);
  }

  closePopup() {
    this.bsModalRef.hide();
  }

  onSubmit() {
    let approverId: string = '';
    let name: string = '';
    if(this.mode == 'edit'){
       approverId = this.finalApproverNew?.username || '';
       name = this.finalApproverNew?.full_name || '';

    }
    else{
       approverId = this.finalApprover?.username || '';
       name = this.finalApprover?.full_name || '';
    }

    const formData = new FormData();

    formData.append('userId', this.userId);
    formData.append('approverId', approverId);
    formData.append('name', name);
    console.log('Submitting Final Approver:', formData);
    this.kpi.saveFinalHierarchy(formData).subscribe({
      next: (response) => {
        this.finalApproverSelected.emit({'username': approverId, 'full_name': name});
        this.mode = 'edit'
        this.modeEdit.emit(this.mode);
        this.bsModalRef.hide();

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

    if(this.mode == 'edit'){
      this.finalApproverNew = option;
    }
    else{
      this.finalApprover = option;
    }
  }

  filterApprovers() {
    if (this.searchApprover.trim()) {
      this.filterAprroversList = this.aprrovers.filter((apr: any) =>
        apr.full_name.toLowerCase().includes(this.searchApprover.toLowerCase())
      );
    } else {
      this.filterAprroversList = [...this.aprrovers];
    }
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
