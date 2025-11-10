import {Component, EventEmitter, Output} from '@angular/core';
interface Objective {
  id: number;
  name: string;
  selectedRating: string;
  objectiveText: string;
  keyObjective: string;
  isOpen: boolean;
  isEditingObjective: boolean;
}
@Component({
  selector: 'app-values-component',
  templateUrl: './values-component.component.html',
  styleUrls: ['./values-component.component.css']
})
export class ValuesComponentComponent {
  objectives: Objective[] = [
    { id: 1, name: 'DEPENDABILITY', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false },
    { id: 2, name: 'JOB KNOWLEDGE AND SKILLS', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false },
    { id: 3, name: 'INITIATIVE AND RESOURCEFULNESS', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false },
    { id: 4, name: 'JUDGEMENT', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false },
    { id: 5, name: 'ADAPTABILITY', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false },
    { id: 6, name: 'DECISIVENESS', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false },
    { id: 7, name: 'INTERPERSONAL RELATIONSHIPS', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false },
  ];

  @Output() dataSubmitted = new EventEmitter<any>();
  isOpen: boolean[] = [];
  mode:any;

  rating: any[] = ['Role Model', 'Very Good', 'Good', 'Improvement Required', 'Unacceptable'];
  overAllRating: any;



  // onObjectiveChange(type: any, obj: Objective,i:number): void {
  //   obj.selectedRating = type;
  //   this.isOpen[i] = false;
  //   console.log(`Objective ${obj.id} selected rating:`, obj.selectedRating);
  // }


  onBack() {

  }

  onOverallRating(type: any) {
    this.overAllRating = type;
  }

  toggleObjective(obj: Objective): void {
    obj.isOpen = !obj.isOpen;
  }

  // toggleObjectiveEdit(obj: Objective): void {
  //   obj.isEditingObjective = !obj.isEditingObjective;
  // }

  onObjectiveChange(type: string, obj: Objective): void {
    obj.selectedRating = type;
  }

  onNext(): void {
    // log or save full data
    console.log('All Objectives:', this.objectives);

    // Example: show unsaved ones
    const incomplete = this.objectives.filter(o => !o.objectiveText || !o.selectedRating);
    if (incomplete.length > 0) {
      console.warn('Incomplete objectives:', incomplete);
    } else {
      console.log('All objectives are filled in.');
    }
  }


  submitData() {
    setTimeout(() => {
      this.dataSubmitted.emit(this.objectives);
    }, 500);
    console.log(this.objectives)
  }
}
