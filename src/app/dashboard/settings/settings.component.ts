import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  currentStage = 0;
  selectedDate: Date | null = null;
  stages = ['KPI Initiation', 'KPI Modification', 'KPI Evaluation'];

  nextStage() {
    if (this.currentStage < this.stages.length - 1) {
      this.currentStage++;
    }
  }
}
