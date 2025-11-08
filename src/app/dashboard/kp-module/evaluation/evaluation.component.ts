import { Component } from '@angular/core';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent {
  tables: { [key: string]: { selected: boolean } } = {
    values: { selected: true },
    manager: { selected: false },
  };
  currentTable: string = 'values';

  ngOnInit(){
    this.currentTable = 'values';
  }
  changeTable(tab: string) {
    this.tables[this.currentTable].selected = false;


    this.currentTable = tab;

    this.tables[this.currentTable].selected = true;
  }
}
