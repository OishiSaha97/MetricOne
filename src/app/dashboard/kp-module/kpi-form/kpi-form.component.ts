
import { NgModule ,Component, OnInit } from '@angular/core';
import {CommonServiceService} from "../../common-service.service";

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
  styleUrls: ['./kpi-form.component.css']
})
export class KpiFormComponent implements OnInit {

  constructor(private kpi: CommonServiceService){
  }

  objectiveTypes: string[] = ['Production', 'Support', 'Innovation', 'People', 'Other'];
  objectives: any = [];
  year:string=''

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

  onObjectiveChange(type: any, obj: Objective,i:number): void {
    obj.selectedType = type;
    this.isOpen[i] = false;
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
  isOpen: boolean[] = [];

  validateObjectives(): boolean {
    for (let i = 0; i < this.objectives.length; i++) {
      const obj = this.objectives[i];

      if (
        !obj.selectedType?.trim() ||
        !obj.objectiveText?.trim() ||
        !obj.targetText?.trim()
      ) {
        alert(`⚠️ Please fill all fields for ${obj.title || 'Objective ' + (i + 1)}`);
        return false;
      }
    }

    return true;
  }

  onSubmit(): void {
    if (!this.validateObjectives()) {
      return;
    }
    let obj ={
      randomData:JSON.stringify(this.objectives),
      year:this.year,
      param:'kpi_insert_data'
    }
    console.log('Submitting Objectives:', obj);
    this.kpi.saveKpi(obj).subscribe({
      next: (response) => {

      },
      error: (error) => {

      }
    });
  }


}
