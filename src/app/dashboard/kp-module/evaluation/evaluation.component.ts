import { Component } from '@angular/core';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent {
  tables: { [key: string]: { selected: boolean } } = {
    objective: { selected: true },
    self: { selected: false },
    values: { selected: false },
    manager: { selected: false },
    hr: { selected: false },
  };
  currentTable: string = 'objective';
  userData: any;
  currentStep: number = 1;
  mode:any
  remarkList: any;
  remark: any;

  isOpenRemark: boolean[] = [];



  ngOnInit(){
    this.currentTable = 'objective';
    console.log('Received user data:', this.userData);
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
    }else if(this.currentStep == 4){
      currentStep = 5;
      this.changeTable('hr',currentStep)
    }
  }
  onBack(){
    let currentStep;
    if (this.currentStep == 2) {
      currentStep = 1;
      this.changeTable('objective',currentStep)
    }else if(this.currentStep == 3) {
      currentStep = 2;
      this.changeTable('self',currentStep)
    }else if(this.currentStep == 4){
      currentStep = 3;
      this.changeTable('values',currentStep)
    }else if(this.currentStep == 5){
      currentStep = 4;
      this.changeTable('manager',currentStep)
    }
  }

  cancel(){

  }

  onDropdownOpen(): void {
    this.isOpenRemark.fill(true);
  }

  onToggle(index: number): void {
    this.isOpenRemark[index] = !this.isOpenRemark[index];

  }

}
