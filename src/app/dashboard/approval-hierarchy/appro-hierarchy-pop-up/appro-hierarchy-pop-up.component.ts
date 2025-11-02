import {Component, EventEmitter, Output} from '@angular/core';
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

  @Output() hierarchySaved = new EventEmitter<void>();
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
    this.filterApproversList[tier] = [...this.approvers];
  }

  selectOption(tier: number, option: { username: string; full_name: string }, i: number) {

    this.selectedValues['tier' + tier] = {
      index: tier,
      username: option.username,
      full_name: option.full_name
    };
    this.dropdownOpen[tier] = false;
    console.log("selectedValues: ", this.selectedValues);
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
        this.hierarchySaved.emit();
      },
      error: (error) => {

      }
    });
  }


  approvers: any=[];
  managers: any=[];
  searchApprover: { [tier: number]: string } = {};
  filterApproversList: { [tier: number]: any[] } = {};

  filterManagerList: any=[];
  getUserList() {
    this.kpi.getLogData({ param: 'user-name-list', userIdKPI: this.userId })
      .subscribe(res => {
        this.approvers = res?.['user-name-list'] || [];

        this.tiers.forEach(tier => {
          this.filterApproversList[tier] = [...this.approvers];
        });

        console.log('filterApproversList:', this.filterApproversList);
      });
  }

  filterApprovers(tier: number) {
    const searchText = this.searchApprover[tier]?.trim().toLowerCase() || '';

    if (searchText) {
      this.filterApproversList[tier] = this.approvers.filter((apr: any) =>
        apr.full_name.toLowerCase().includes(searchText)
      );
    } else {
      this.filterApproversList[tier] = [...this.approvers];
    }
  }



}
