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
  selector: 'app-manager-insight',
  templateUrl: './manager-insight.component.html',
  styleUrls: ['./manager-insight.component.css']
})
export class ManagerInsightComponent {

  objectives: Objective[] = [
    { id: 1, name: 'MANAGER’S COMMENT', isOpen: false, isEditingObjective: false, objectiveText: '', keyObjective: '' },
    { id: 2, name: 'OVERALL PERFORMANCE', isOpen: false, isEditingObjective: false, objectiveText: '', keyObjective: '' },
    { id: 3, name: 'PROPOSED INCREMENT', isOpen: false, isEditingObjective: false, objectiveText: '', keyObjective: '' }
  ];

  @Output() dataSubmitted = new EventEmitter<any>();


  toggleObjective(obj: Objective): void {
    obj.isOpen = !obj.isOpen;
  }

  toggleObjectiveEdit(obj: Objective): void {
    obj.isEditingObjective = !obj.isEditingObjective;
  }

  onBack() {
    // handle previous step
  }

  onNext() {
    // Example: log full data to see stored input
    console.log('Saved objectives:', this.objectives);
  }

  submitData() {
    this.dataSubmitted.emit(this.objectives);
    console.log(this.objectives);
  }


}
