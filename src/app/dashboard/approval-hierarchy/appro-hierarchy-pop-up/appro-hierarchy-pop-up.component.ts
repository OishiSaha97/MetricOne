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
  mode:any;
  @Output() clickOutside = new EventEmitter<MouseEvent>();
  @Output() hierarchySaved = new EventEmitter<void>();
  resData: any;
  constructor(public bsModalRef: BsModalRef,
              private kpi: CommonServiceService) {}

  ngOnInit(): void {

    this.userId = localStorage.getItem('username');
    this.getUserList();
    console.log("mode : ", this.mode);

    if(this.mode === 'edit'){
      this.getData();
    }
  }

  team_name :any = '';
  hierarchyLength:any=0;
  tiers: number[] = [1, 2];
  maxTiers = 4;
  selectedValues: any = [];
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


    // Object.keys(this.dropdownOpen).forEach(key => this.dropdownOpen[+key] = false);

    this.dropdownOpen[tier] = !this.dropdownOpen[tier];
    this.filterApproversList[tier] = [...this.approvers];
  }

  selectOption(tier: number, option: { username: string; full_name: string }, i: number) {

      if(this.mode === 'edit'){
        this.selectedValues[tier] = {
          index: tier,
          username: option.username,
          full_name: option.full_name
        };
        this.dropdownOpen[tier] = false;
        this.searchApprover[tier] = '';
      }else {
        this.selectedValues[tier-1] = {
          index: tier,
          username: option.username,
          full_name: option.full_name
        };
        this.dropdownOpen[tier] = false;
        this.searchApprover[tier] = '';
      }

  }


  isDropdownOpen(tier: number) {
    return this.dropdownOpen[tier];
  }

  closeDropdown(tier: number){
    this.dropdownOpen[tier] = false;
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  closePopup() {
    this.bsModalRef.hide();
  }

  onSubmit() {
    const tierArray = Object.values(this.selectedValues);
    if (this.finalApprover) {
      const finalApproverWithIndex = {
        index: tierArray.length + 1,
        ...this.finalApprover
      };

      tierArray.push(finalApproverWithIndex);
    }

    console.log("tierArray to submit:", tierArray);
    let obj = {
      userIdKPI:this.userId,
      hierarchyData: JSON.stringify(tierArray),
      approver: this.finalApprover,
      team: this.team_name,
      param: 'kpi_insert_hierarchy_data'
    };
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
    this.kpi.getLogData({ param: 'approver-list', userIdKPI: this.userId })
      .subscribe(res => {
        this.approvers = res?.['approver-list'] || [];

        this.tiers.forEach(tier => {
          this.filterApproversList[tier] = [...this.approvers];
        });

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


  getData() {
    this.kpi.getLogData({ param: 'getPrevHierarchy', userIdKPI: this.userId, parameter: this.team_name})
      .subscribe(res => {
        this.resData = res?.['getPrevHierarchy'] || [];
        this.hierarchyLength = this.resData.length;
        this.tiers = [];
        this.selectedValues = [];
        this.setViewHierarchy();
      });
  }

  setViewHierarchy() {
    this.tiers = Array.from({ length: this.hierarchyLength+1}, (_, i) => i);
    this.resData.forEach((element: any) => {
      this.selectedValues.push({
        index: element.index,
        username: element.username,
        full_name: element.full_name
      }) ;
      if (!this.tiers.includes(element.index)) {
        this.tiers.push(element.index+1);
      }
      console.log(this.selectedValues)
    });

  }

  removeTier(index: number) {
    this.tiers.pop();
    this.selectedValues.splice(index, 1);
    this.selectedValues = this.selectedValues.map((v:any, i:any) => ({ ...v, index: i+1 }));

  }



}
