import {Component, EventEmitter, Input, Output} from '@angular/core';

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
  @Input() userData: any;
  objectives: Objective[] = [
    { id: 1, name: 'HR’S COMMENT', isOpen: false, isEditingObjective: false, objectiveText: '', keyObjective: '' }];
  mode: any;
  rating: any[] = ['Role Model', 'Very Good', 'Good', 'Improvement Required', 'Unacceptable'];
  attendanceRating: any;
  leaveRating: any;
  issueRating: any;
  awardRating: any;

  toggleObjective(obj: Objective): void {
    obj.isOpen = !obj.isOpen;
  }
  onAttendanceRating(type: any) {
    this.attendanceRating = type;
  }
  onLeaveRating(type: any) {
    this.leaveRating = type;
  }
  onIssueRating(type: any) {
    this.issueRating = type;
  }
  onAwardRating(type: any) {
    this.awardRating = type;
  }
  submitData() {
    this.dataSubmitted.emit(this.objectives);
    console.log(this.objectives);
  }

}
