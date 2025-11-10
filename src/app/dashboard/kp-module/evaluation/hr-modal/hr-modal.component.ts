import {Component, EventEmitter, Output} from '@angular/core';

interface Objective {
  id: number;
  name: string;
  isOpen: boolean;
  isEditingObjective: boolean;
  objectiveText: string;
  keyObjective?: string;
}
@Component({
  selector: 'app-hr-modal',
  templateUrl: './hr-modal.component.html',
  styleUrls: ['./hr-modal.component.css']
})
export class HrModalComponent {

  @Output() dataSubmitted = new EventEmitter<any>();
  objectives: Objective[] = [
    { id: 1, name: 'HR’S COMMENT', isOpen: false, isEditingObjective: false, objectiveText: '', keyObjective: '' }];
  mode: any;
  rating: any[] = ['Role Model', 'Very Good', 'Good', 'Improvement Required', 'Unacceptable'];
  hrRating: any;

  toggleObjective(obj: Objective): void {
    obj.isOpen = !obj.isOpen;
  }
  onOverallRating(type: any) {
    this.hrRating = type;
  }
  submitData() {
    this.dataSubmitted.emit(this.objectives);
    console.log(this.objectives);
  }

}
