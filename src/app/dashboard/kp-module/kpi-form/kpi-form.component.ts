
import { NgModule ,Component, OnInit } from '@angular/core';
import {CommonServiceService} from "../../common-service.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

interface Objective {
  id: number;
  title: string;
  selectedType: string;
  objectiveText: string;
  targetText: string;
  isOpen: boolean;
  keyObjective?: string;
  keyTarget?: string;
}

@Component({
  selector: 'app-kpi-form',
  templateUrl: './kpi-form.component.html',
  styleUrls: ['./kpi-form.component.css']
})
export class KpiFormComponent implements OnInit {

  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }



  objectiveTypes: string[] = ['Production', 'Support', 'Innovation', 'People', 'Other'];
  objectives: any = [];
  data: any = [];
  year:string='2025';
  userName:any;
  userId:any;
  mode:any
  team:any;
  kpiUserId:any;


  ngOnInit(): void {
    for (let i = 1; i <= 3; i++) {
      this.addObjective();
    }
    this.userName = localStorage.getItem('fullName');
    this.userId = localStorage.getItem('username');
      if(this.mode == 'approver'){
        this.kpi.getLogData({userIdKPI:this.userId,param: 'kpi-list',objectId:this.kpiUserId,parameter:this.team,pid:this.year})
          .subscribe(res => {
              // this.data = res?.['kpi-list'];
              this.data = Array.isArray(res?.['kpi-list']) ? res?.['kpi-list'] : res?.['kpi-list']
              console.log(this.data);
              this.objectives = this.data.map((item:any, index:any) => ({
                id: item.id,
                title: `Work Objective ${index + 1}`,
                selectedType: item.category_name,
                objectiveText: item.objective,
                targetText: item.target,
                isOpen: false
              }));
            },
            (error) => {
              console.error("Error fetching permission list", error);
            }
          );
      }

  }

  // addObjectivesFromData(): void {
  //   this.data.forEach((item:any, index:any) => {
  //     const newObjective: Objective = {
  //       id: this.objectives.length + 1,
  //       title: `Work Objective ${this.objectives.length + 1}`,
  //       selectedType: item.category_name,
  //       objectiveText: item.objective,
  //       targetText: item.target,
  //       isOpen: false
  //     };
  //     this.objectives.push(newObjective);
  //   });
  // }


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
        alert(`Please fill all fields for ${obj.title || 'Objective ' + (i + 1)}`);
        return false;
      }
    }

    return true;
  }

  onSubmit(): void {
    if (!this.validateObjectives()) {
      return;
    }
    let processedObjectives = this.objectives.map((obj: Objective) => {
      // Create a structured object grouped by title
      let item: any = {
        title: obj.title,
        selectedType: obj.selectedType,
        objectiveText: obj.objectiveText,
        targetText: obj.targetText
      };

      // If mode = approver, include key points if present
      if (this.mode === 'approver') {
        if (obj.keyObjective?.trim()) {
          item.keyObjective = obj.keyObjective.trim();
        }
        if (obj.keyTarget?.trim()) {
          item.keyTarget = obj.keyTarget.trim();
        }
      }

      return item;
    });
    console.log(processedObjectives)

    const param = this.mode === 'approver'
      ? 'kpi_update_data_by_approver'
      : 'kpi_insert_data';

    let obj ={
      userIdKPI:this.userId,
      userName:this.userName,
      randomData:JSON.stringify(processedObjectives),
      year:this.year,
      param:param
    }


    this.kpi.saveKpi(obj).subscribe({
      next: (response) => {

      },
      error: (error) => {

      }
    });
  }

  toggleObjectiveEdit(obj: any) {
    obj.isEditingObjective = !obj.isEditingObjective;
  }

  toggleTargetEdit(obj: any) {
    obj.isEditingTarget = !obj.isEditingTarget;
  }

  onCancel() {
    this.modalRef.hide();
  }


}
