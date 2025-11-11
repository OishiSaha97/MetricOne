import {Component, EventEmitter, Input, Output} from '@angular/core';

interface Objective {
  id: number;
  name: string;
  isOpen: boolean;
  isEditingObjective: boolean;
  objectiveText: string;
  keyObjective?: string;
  attendanceRating:string;
  leaveRating:string;
  issueRating:string;
  awardRating:string;
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
    { id: 1, name: 'HR’S COMMENT', isOpen: false, isEditingObjective: false, objectiveText: '', keyObjective: '',attendanceRating:'',leaveRating:'',issueRating:'' ,awardRating:''}];
  mode: any;
  rating: any[] = ['Role Model', 'Very Good', 'Good', 'Improvement Required', 'Unacceptable'];
  // attendanceRating: any;
  // leaveRating: any;
  // issueRating: any;
  // awardRating: any;

  toggleObjective(obj: Objective): void {
    obj.isOpen = !obj.isOpen;
  }

  onAttendanceRating(obj: Objective,type: any) {
    // this.attendanceRating = type;
    obj.attendanceRating=type;
  }

  onLeaveRating(obj: Objective,type: any) {
    // this.leaveRating = type;
    obj.leaveRating=type;
  }

  onIssueRating(obj: Objective,type: any) {
    // this.issueRating = type;
    obj.issueRating=type;
  }

  onAwardRating(obj: Objective,type: any) {
    // this.awardRating = type;
    obj.awardRating=type;
  }

  submitData() {
    this.dataSubmitted.emit(this.objectives);
  }

}
