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
  data: any =[];

  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }

  ngOnInit(): void {
    this.kpi.getLogData({param: 'evalution-manager-insight-kpi-list',objectId:this.userData.user_id,parameter:this.userData.team,pid:this.userData.year,extraParam:this.userData.id})
      .subscribe(res => {
          this.data = Array.isArray(res?.['evalution-manager-insight-kpi-list']) ? res?.['evalution-manager-insight-kpi-list'] : res?.['evalution-manager-insight-kpi-list']
          console.log(this.data);
          this.objectives = this.objectives.map((obj, index) => ({
            ...obj,
            objectiveText: this.data[index]?.remark || ''
          }));

          console.log("this.objectives : ", this.objectives);
        },
        (error) => {
          console.error("Error fetching permission list", error);
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
    this.dataSubmitted.emit(this.objectives);
    console.log(this.objectives);
  }


}
