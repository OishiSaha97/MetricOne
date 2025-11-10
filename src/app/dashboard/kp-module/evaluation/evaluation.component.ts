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
  };
  currentTable: string = 'objective';
  userData: any;

  ngOnInit(){
    this.currentTable = 'objective';
    console.log('Received user data:', this.userData);
  }

  changeTable(tab: string) {
    this.tables[this.currentTable].selected = false;
    this.currentTable = tab;
    this.tables[this.currentTable].selected = true;
  }
}
