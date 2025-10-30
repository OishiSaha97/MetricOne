import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {CommonServiceService} from "../../common-service.service";

@Component({
  selector: 'app-appro-hierarchy-pop-up',
  templateUrl: './appro-hierarchy-pop-up.component.html',
  styleUrls: ['./appro-hierarchy-pop-up.component.css']
})
export class ApproHierarchyPopUpComponent {
  finalApprover: any;

  constructor(public bsModalRef: BsModalRef,
              private kpi: CommonServiceService) {}



  teamName = 'Development Team';

  tiers: number[] = [1, 2];
  maxTiers = 4;
  selectedValues: any = {};
  dropdownOpen: { [tier: number]: boolean } = {};

  managers = ['Manager A', 'Manager B', 'Manager C'];
  approvers = ['Approver X', 'Approver Y', 'Approver Z'];

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

  selectOption(tier: number, option: string) {
    this.selectedValues['tier' + tier] = option;
    this.dropdownOpen[tier] = false;

    if (tier === this.tiers[this.tiers.length - 2]) {
      const finalTier = this.tiers[this.tiers.length - 1];
      this.selectedValues['tier' + finalTier] = option;
    }

    console.log("Selected Values:", this.selectedValues);
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
    let obj ={
      tier:this.selectedValues,
      approver:this.finalApprover,
      team:this.teamName,
      param:'kpi_insert_hierarchy_data'
    }
    console.log('Submitting Objectives:', obj);
    this.kpi.saveKpiHierarchy(obj).subscribe({
      next: (response) => {

      },
      error: (error) => {

      }
    });
  }


}
