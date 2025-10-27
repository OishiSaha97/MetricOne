
import { NgModule ,Component, OnInit } from '@angular/core';

interface Objective {
  id: number;
  title: string;
  selectedType: string;
  objectiveText: string;
  targetText: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-kpi-form',
  templateUrl: './kpi-form.component.html',
  styleUrl: './kpi-form.component.css'
})
export class KpiFormComponent implements OnInit {

  objectiveTypes: string[] = ['Production', 'Support', 'Innovation'];
  objectives: Objective[] = [];

  ngOnInit(): void {
    for (let i = 1; i <= 3; i++) {
      this.addObjective();
    }
  }

  addObjective(): void {
    const newObjective: Objective = {
      id: this.objectives.length + 1,
      title: `Work Objective ${this.objectives.length + 1}`,
      selectedType: '',
      objectiveText: '',
      targetText: '',
      isOpen: false
    };
    this.objectives.push(newObjective);
  }

  toggleObjective(obj: Objective): void {
    obj.isOpen = !obj.isOpen;
  }

  onObjectiveChange(event: any, obj: Objective): void {
    obj.selectedType = event.target.value;
    console.log(`Objective ${obj.id} selected type:`, obj.selectedType);
  }

  // removeObjective(index: number): void {
  //   this.objectives.splice(index, 1);
  //   // reassign ids/titles if you want sequential ids
  //   this.objectives.forEach((o, i) => {
  //     o.id = i + 1;
  //     o.title = `Work Objective ${i + 1}`;
  //   });
  // }

  onSubmit(): void {
    console.log('Submitting Objectives:', this.objectives);

    // Example backend POST
    // const apiUrl = 'https://your-backend-api.com/api/kpi/save-objectives';
    // this.http.post(apiUrl, this.objectives).subscribe({
    //   next: (response) => {
    //     console.log('Objectives saved successfully!', response);
    //     alert('Objectives submitted successfully!');
    //   },
    //   error: (error) => {
    //     console.error('Error submitting objectives:', error);
    //     alert('Failed to submit objectives.');
    //   }
    // });
  }


}
