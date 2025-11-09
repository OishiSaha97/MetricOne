import { Component } from '@angular/core';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent {
  tables: { [key: string]: { selected: boolean } } = {
    objective: { selected: false },
    self: { selected: false },
    values: { selected: true },
    manager: { selected: false },
  };
  currentTable: string = 'objective';
  currentStep: number = 1;
  mode:any
  ngOnInit(){
    this.currentTable = 'objective';
  }
  changeTable(tab: string, stepNumber: number) {
    this.tables[this.currentTable].selected = false;
    this.currentTable = tab;
    this.currentStep = stepNumber;
    this.tables[this.currentTable].selected = true;
  }
  onCancel() {

  }
  onSubmit(){

  }
  onNext(){
    let currentStep;
    if (this.currentStep == 1) {
      currentStep = 2;
      this.changeTable('self',currentStep)
    }else if(this.currentStep == 2) {
      currentStep = 3;
      this.changeTable('values',currentStep)
    }else if(this.currentStep == 3){
      currentStep = 4;
      this.changeTable('manager',currentStep)
    }
  }
  onBack(){

  }
}
