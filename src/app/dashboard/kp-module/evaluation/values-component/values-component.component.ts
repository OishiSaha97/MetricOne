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
  selector: 'app-values-component',
  templateUrl: './values-component.component.html',
  styleUrls: ['./values-component.component.css']
})
export class ValuesComponentComponent {
  objectives: any = [{name:'DEPENDABILITY',isOpen: false, isEditingObjective:false},
    {name:'JOB KNOWLEDGE AND SKILLS',isOpen: false, isEditingObjective:false}
    , {name:'INITIATIVE AND RESOURCEFULNESS',isOpen: false, isEditingObjective:false},
    {name:'JUDGEMENT',isOpen: false, isEditingObjective:false},
    {name:'ADAPTABILITY',isOpen: false, isEditingObjective:false},
    {name:'DECISIVENESS',isOpen: false, isEditingObjective:false},
    {name: 'INTERPERSONAL RELATIONSHIPS', isOpen: false, isEditingObjective:false}];
  isOpen: boolean[] = [];
  mode:any
  objectiveTypes: string[] = ['Production', 'Support', 'Innovation', 'People', 'Other'];
  rating: any[] = ['Role Model', 'Very Good', 'Good', 'Improvement Required', 'Unacceptable'];
  overAllRating: any;

  addObjective(): void {
    const newObjective: Objective = {
      id: this.objectives.length + 1,
      title: `Work Objective ${this.objectives.length + 1}`,
      selectedRating: '',
      objectiveText: '',
      targetText: '',
      isOpen: false
    };
    this.objectives.push(newObjective);
  }

  onObjectiveChange(type: any, obj: Objective,i:number): void {
    obj.selectedRating = type;
    this.isOpen[i] = false;
    console.log(`Objective ${obj.id} selected rating:`, obj.selectedRating);
  }
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

  onOverallRating(type: any) {
    this.overAllRating = type;
  }
}
