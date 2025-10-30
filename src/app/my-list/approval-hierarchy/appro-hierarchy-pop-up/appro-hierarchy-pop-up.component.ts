import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-appro-hierarchy-pop-up',
  templateUrl: './appro-hierarchy-pop-up.component.html',
  styleUrls: ['./appro-hierarchy-pop-up.component.css']
})
export class ApproHierarchyPopUpComponent {
  constructor(public bsModalRef: BsModalRef) {}

  teamName = 'Development Team';

  tiers: number[] = [1, 2];
  maxTiers = 4;

  managers = ['Manager A', 'Manager B', 'Manager C'];
  approvers = ['Approver X', 'Approver Y', 'Approver Z'];

  selectedValues: { [key: string]: string } = {};
  dropdownOpenStates: { [key: string]: boolean } = {};

  addTier() {
    if(this.tiers.length < this.maxTiers) {
      this.tiers.push(this.tiers.length + 1);
    }
  }

  isAddVisible(): boolean {
    return this.tiers.length < this.maxTiers;
  }

  toggleDropdown(tier: number) {
    const key = `tier${tier}`;
    this.dropdownOpenStates[key] = !this.dropdownOpenStates[key];
  }

  selectOption(tier: number, value: string) {
    this.selectedValues[`tier${tier}`] = value;
    this.dropdownOpenStates[`tier${tier}`] = false;
  }

  isDropdownOpen(tier: number): boolean {
    return !!this.dropdownOpenStates[`tier${tier}`];
  }

  closeModal() {
    this.bsModalRef.hide();
  }
}
