import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-appro-hierarchy-pop-up',
  templateUrl: './appro-hierarchy-pop-up.component.html',
  styleUrls: ['./appro-hierarchy-pop-up.component.css']
})
export class ApproHierarchyPopUpComponent {

  constructor(public bsModalRef: BsModalRef) {}

  team_name :any = '';

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
    this.dropdownOpen[tier] = !this.dropdownOpen[tier];
  }

  selectOption(tier: number, option: string) {
    this.selectedValues['tier' + tier] = option;
    this.dropdownOpen[tier] = false;
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
    console.log();
  }


}
