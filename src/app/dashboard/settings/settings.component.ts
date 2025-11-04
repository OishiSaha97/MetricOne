import {Component, Input} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../common-service.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  currentStage = 0;
  selectedDate: Date | null = null;
  stages = ['KPI Initiation', 'KPI Modification', 'KPI Evaluation'];
  tables = {
    initiation: {
      selected: true
    },
    modification: {
      selected: false
    },
    evaluation: {
      selected: false
    },
  };
  currentTable: keyof SettingsComponent['tables'] = 'initiation';
  tab: any;
   showProceedButton: boolean = false;
  constructor(public bsModalRef: BsModalRef,
              private kpi: CommonServiceService) {}
  ngOnInit(){
    this.currentTable = 'initiation';
    this.tab='initiation';

    this.tables[this.currentTable].selected = true;
  }
  nextStage() {
    if (this.currentStage < this.stages.length - 1) {
      this.currentStage++;
    }
  }


  changeTable(table: any){

    this.tables[this.currentTable].selected = false;

    this.currentTable = table;
    if(this.currentTable=='initiation'){
      this.tab='initiation';
    }
    else if(this.currentTable=='evaluation'){
      this.tab='evaluation';
    }
    else{
      this.tab='modification';
    }

    this.tables[this.currentTable].selected = true;
    this.updateTemplate();

  }

   updateTemplate() {

  }

  closePopup() {
    this.bsModalRef.hide();

  }

  onSubmit() {

  }

  getProceedButton($event: any) {
    console.log("Received showProceedButton event:", $event);
    this.showProceedButton = $event;
    console.log("showProceedButton in settings:", this.showProceedButton);
  }
}
