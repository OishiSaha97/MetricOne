import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {CommonServiceService} from "../../common-service.service";

@Component({
  selector: 'app-appro-hierarchy-pop-up',
  templateUrl: './appro-hierarchy-pop-up.component.html',
  styleUrls: ['./appro-hierarchy-pop-up.component.css']
})
export class ApproHierarchyPopUpComponent {
  finalApprover: any=[];
  userId:any;
  constructor(public bsModalRef: BsModalRef,
              private kpi: CommonServiceService) {}

  ngOnInit(): void {

    this.userId = localStorage.getItem('username');
    this.getUserList();
    console.log("finalApprover : ", this.finalApprover);
  }

  team_name :any = '';

  tiers: number[] = [1, 2];
  maxTiers = 4;
  selectedValues: any = {};
  dropdownOpen: { [tier: number]: boolean } = {};
  userList:any='';
  filterUserList:any='';

  managers = [
    { id: 1, name: 'Manager A' },
    { id: 2, name: 'Manager B' },
    { id: 3, name: 'Manager C' }
  ];

  approvers = [
    { id: 1, name: 'Approver X' },
    { id: 2, name: 'Approver Y' },
    { id: 3, name: 'Approver Z' }
  ];
  dropdownOpenStates: { [key: string]: boolean } = {};



  addTier() {
    if (this.tiers.length < this.maxTiers) {
      const insertIndex = this.tiers.length - 1;
      const newTier = this.tiers.length;
      this.tiers.splice(insertIndex, 0, newTier);
    }
  }

  isAddVisible(): boolean {
    return this.tiers.length < this.maxTiers;
  }

  toggleDropdown(tier: number) {
    Object.keys(this.dropdownOpen).forEach(key => this.dropdownOpen[+key] = false);

    this.dropdownOpen[tier] = !this.dropdownOpen[tier];
  }

  selectOption(tier: number, option: { id: number; name: string},  i : any ) {

    this.selectedValues['tier' + tier] = {
      index: tier,
      id: option.id,
      name: option.name
    };

    this.dropdownOpen[tier] = false;

    if (tier === this.tiers[this.tiers.length - 2]) {
      const finalTier = this.tiers[this.tiers.length - 1];
      this.selectedValues['tier' + finalTier] = {
        index: finalTier,
        id: option.id,
        name: option.name
      };
    }
    this.dropdownOpen[tier] = false;

    console.log('Selected Values:', this.selectedValues);
  }

  isDropdownOpen(tier: number) {
    return this.dropdownOpen[tier];
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  closePopup() {
    this.bsModalRef.hide();
  }

  onSubmit() {
    const tierArray = Object.values(this.selectedValues);

    let obj = {
      userIdKPI:this.userId,
      hierarchyData: JSON.stringify(tierArray),
      approver: this.finalApprover,
      team: this.team_name,
      param: 'kpi_insert_hierarchy_data'
    };
    console.log('Submitting Objectives:', obj);
    this.kpi.saveKpiHierarchy(obj).subscribe({
      next: (response) => {
        this.bsModalRef.hide();
      },
      error: (error) => {

      }
    });
  }


  getUserList() {
    this.kpi.getLogData({param: 'user-name-list',userIdKPI:this.userId,})
      .subscribe(res => {
         this.userList = res?.['user-name-list'];
         this.filterUserList = res?.['user-name-list'];
        }, error => {
          // this.alerts.closeAlert();
          // this.alerts.toast('error', 'Unable to fetch incident Category List.  Please try again. If the problem persists then please contact our Support Team')
        }
      );
  }


}
