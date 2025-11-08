import { Component } from '@angular/core';


interface Objective {
  id: number;
  title: string;
  selectedRating: string;
  objectiveText: string;
  targetText: string;
  isOpen: boolean;
  keyObjective?: string;
  keyTarget?: string;
}
@Component({
  selector: 'app-manager-insight',
  templateUrl: './manager-insight.component.html',
  styleUrls: ['./manager-insight.component.css']
})
export class ManagerInsightComponent {
  objectives: any = [
    {name:'MANAGER’S COMMENT',isOpen: false, isEditingObjective:false},
    {name:'OVERALL PERFORMANCE',isOpen: false, isEditingObjective:false},
    {name:'PROPOSED INCREMENT',isOpen: false, isEditingObjective:false}];
  isOpen: boolean[] = [];
  mode:any;
  toggleObjective(obj: Objective): void {
    obj.isOpen = !obj.isOpen;
  }
  toggleObjectiveEdit(obj: any) {
    obj.isEditingObjective = !obj.isEditingObjective;
  }


  onBack() {

  }

  onNext() {

  }
}
