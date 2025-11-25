import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../../common-service.service";


interface Objective {
  id: number;
  name: string;
  isOpen: boolean;
  isEditingObjective: boolean;
  objectiveText: string;
  keyObjective?: string;
}
@Component({
  selector: 'app-manager-insight',
  templateUrl: './manager-insight.component.html',
  styleUrls: ['./manager-insight.component.css']
})
export class ManagerInsightComponent {

  objectives: Objective[] = [
    { id: 1, name: 'MANAGER’S COMMENT', isOpen: false, isEditingObjective: false, objectiveText: '', keyObjective: '' },
    { id: 2, name: 'OVERALL PERFORMANCE', isOpen: false, isEditingObjective: false, objectiveText: '', keyObjective: '' },
    { id: 3, name: 'PROPOSED INCREMENT', isOpen: false, isEditingObjective: false, objectiveText: '', keyObjective: '' }
  ];

  @Output() dataSubmitted = new EventEmitter<any>();
  @Input() userData: any;
  @Input() currentStatus: any;
  @Input() view: any;
  data: any =[];

  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }

  ngOnInit(): void {
    this.loadManagerInsight();
    console.log(this.currentStatus)
    // this.kpi.getLogData({param: 'evalution-manager-insight-kpi-list',objectId:this.userData.user_id,parameter:this.userData.team,pid:this.userData.year,extraParam:this.userData.id})
    //   .subscribe(res => {
    //       this.data = Array.isArray(res?.['evalution-manager-insight-kpi-list']) ? res?.['evalution-manager-insight-kpi-list'] : res?.['evalution-manager-insight-kpi-list']
    //       const mapFields: any = {
    //         "MANAGER’S COMMENT": "managers_comment",
    //         "OVERALL PERFORMANCE": "overall_performance",
    //         "PROPOSED INCREMENT": "proposed_increment"
    //       };
    //
    //       this.objectives = this.objectives.map(obj => ({
    //         ...obj,
    //         objectiveText: this.data[mapFields[obj.name]] || ''
    //       }));
    //       console.log("this.objectives : ", this.objectives);
    //     },
    //     (error) => {
    //       console.error("Error fetching permission list", error);
    //     }
    //
    //   );
  }


  loadManagerInsight() {
    this.kpi.getLogData({
      param: 'evalution-manager-insight-kpi-list',
      objectId: this.userData.user_id,
      parameter: this.userData.team,
      pid: this.userData.year,
      extraParam: this.userData.id
    }).subscribe(
      (res: any) => {
        const dataArray = res?.['evalution-manager-insight-kpi-list'];
        const data = Array.isArray(dataArray) ? dataArray[0] : null;

        if (!data) {
          console.warn("No manager insight data found");
          return;
        }

        const mapFields: any = {
          "MANAGER’S COMMENT": "managers_comment",
          "OVERALL PERFORMANCE": "overall_performance",
          "PROPOSED INCREMENT": "proposed_increment"
        };

        this.objectives = this.objectives.map(obj => ({
          ...obj,
          objectiveText: data[mapFields[obj.name]] || ''
        }));

        console.log("Updated objectives:", this.objectives);
      },
      (error) => {
        console.error(" Error fetching manager insight:", error);
      }
    );
  }


  toggleObjective(obj: Objective): void {
    obj.isOpen = !obj.isOpen;
  }

  toggleObjectiveEdit(obj: Objective): void {
    obj.isEditingObjective = !obj.isEditingObjective;
  }

  onBack() {
    // handle previous step
  }

  onNext() {
    // Example: log full data to see stored input
    console.log('Saved objectives:', this.objectives);
  }

  submitData() {
    if (!this.validateObjectives()) {
      return;
    }
    this.dataSubmitted.emit(this.objectives);
    console.log(this.objectives);
  }

  objectiveErrors: { [key: number]:
      {
        objectiveText?: string;
      } } = {};

  validateObjectives(): boolean {
    let hasError = false;
    for (let i = 0; i < this.objectives.length; i++) {
      const obj = this.objectives[i];
      this.objectiveErrors[i] = {};
      if (!obj.objectiveText?.trim()) {
        this.objectiveErrors[i].objectiveText = '*Objective is required';
        hasError = true;
      }
    }

    return !hasError;
  }


}
