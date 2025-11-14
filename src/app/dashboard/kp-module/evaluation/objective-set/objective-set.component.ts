import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../../common-service.service";

interface Objective {
  id: number;
  title: string;
  selectedType: string;
  rating: string;
  objectiveText: string;
  targetText: string;
  performanceText: string;
  weightage: string;
  isOpen: boolean;
  keyObjective?: string;
  keyTarget?: string;
  keyPerformance?: string;
  keyAchieved?: string;
  achievedText?:string;
  achievedInt?:string;
}


@Component({
  selector: 'app-objective-set',
  templateUrl: './objective-set.component.html',
  styleUrls: ['./objective-set.component.css']
})
export class ObjectiveSetComponent {
  objOverallRating: any;
   role: any;

  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }

  @Output() dataSubmitted = new EventEmitter<any>();
  @Input() currentStatus: any;




  @Input() userData: any;
  objectiveTypes: string[] = ['Production', 'Support', 'Innovation', 'People', 'Other'];
  objectives: any = [];
  // ratings: string[] = ['Exceeded', 'Achieved All Aspect', 'Achieved All Essentials', 'Did Not Achieve'];
  ratings: any = [];
  data: any = [];
  check_kpi: any = [];
  changedHistory: any = [];
  changedObjHistory: any = [];
  attributeType: any = [];
  changedTargetHistory: any = [];
  year:string='2025';
  userName:any;
  userId:any;
  mode:any
  team:any;
  kpiUserId:any;
  kpiId:any;
  isOpen: boolean[] = [];
  showHistory = false;
  changedPerformanceHistory: any = [];
  showObjectiveHistoryIndex: number | null = null;
  showTargetHistory = false;
  changedAchievedHistory: any =[];
  showAchievedHistory:boolean =  false;



  ngOnInit(): void {

    console.log(this.userData)
    for (let i = 1; i <= 3; i++) {
      this.addObjective();
    }
    this.getRating();
    this.getAttribute();
    this.userName = localStorage.getItem('fullName');
    this.userId = localStorage.getItem('username');
    this.role = localStorage.getItem('role');

      this.kpi.getLogData({userIdKPI:this.userData.employee_id,param: 'evalution-kpi-list',objectId:this.userData.user_id,parameter:this.userData.team,pid:this.userData.year,extraParam:this.userData.id})
        .subscribe(res => {
            // this.data = res?.['kpi-list'];
            this.data = Array.isArray(res?.['evalution-kpi-list']) ? res?.['evalution-kpi-list'] : res?.['evalution-kpi-list']
            console.log(this.data);
            this.objectives = this.data.map((item:any, index:any) => ({
              id: item.id,
              workId: item.work_id,
              title: `Work Objective ${index + 1}`,
              selectedType: item.category_name,
              objectiveText: item.objective,
              targetText: item.target,
              performanceText: item.performance,
              weightage: item.weightage,
              rating: item.overall_rating,
              achievedText: item.achieved_text,
              achievedInt: item.achieved_int,
              //targetText: item.target,
              isOpen: false
            }));
          },
          (error) => {
            console.error("Error fetching permission list", error);
          }

   );
      // this.kpi.getLogData({userIdKPI:this.userId,param: 'changed-history',objectId:this.kpiUserId,parameter:this.team,pid:this.year,extraParam:this.kpiId})
      //   .subscribe(res => {
      //
      //       this.changedHistory = Array.isArray(res?.['changed-history']) ? res?.['changed-history'] : res?.['changed-history']
      //       console.log(this.changedHistory);
      //     },
      //     (error) => {
      //       console.error("Error fetching permission list", error);
      //     }
      //   );
    // }

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

  submitData() {
    if (!this.validateObjectives()) {
      return;
    }
    this.dataSubmitted.emit(this.objectives);
    // this.dataSubmitted.emit({
    //   objectives: this.objectives,
    //   objOverallRating: this.objOverallRating
    // });
  }


  addObjective(): void {
    const newObjective: Objective = {
      id: this.objectives.length + 1,
      title: `Work Objective ${this.objectives.length + 1}`,
      selectedType: '',
      rating: '',
      objectiveText: '',
      targetText: '',
      performanceText: '',
      weightage: '',
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


  onRating(type: any, obj: Objective,i:number): void {
    obj.rating = type.kpi_category_name;
    this.isOpen[i] = false;
    console.log(`Objective ${obj.id} selected rating:`, obj.rating);
  }


  validateObjectives(): boolean {
    for (let i = 0; i < this.objectives.length; i++) {
      const obj = this.objectives[i];

      if(this.currentStatus != 'employee' && (this.role == 'hr' || this.role == 'manager')){
        if (
          !obj.selectedType?.trim() ||
          !obj.objectiveText?.trim() ||
          !obj.targetText?.trim() ||
          !obj.performanceText?.trim() ||
          !obj.achievedText?.trim() ||
          !obj.achievedInt ||
          !obj.weightage?.trim() ||
          !obj.rating?.trim()
          // ||
          // !obj.overAllRating?.trim()
        ) {
          console.log(obj)
          alert(`Please fill all fields for ${obj.title || 'Objective ' + (i + 1)}`);
          return false;
        }
      }else{
        if ((this.currentStatus == 'employee') &&
          !obj.selectedType?.trim() ||
          !obj.objectiveText?.trim() ||
          !obj.targetText?.trim() ||
          !obj.weightage?.trim() ||
          !obj.performanceText?.trim() ||
          !obj.achievedText?.trim()
        ) {
          console.log(obj)
          alert(`Please fill all fields for ${obj.title || 'Objective ' + (i + 1)}`);
          return false;
        }
      }

    }

    return true;
  }

  onSubmit(): void {
    if (!this.validateObjectives()) {
      return;
    }

    let processedObjectives = this.objectives.map((obj: Objective) => {

      const escapeText = (text: string | undefined) => {
        return text
          ? text
            .replace(/\r/g, '\\r')
            .replace(/\n/g, '\\n')
            .replace(/\t/g, '\\t')
          : '';
      };

      let item: any = {
        title: obj.title,
        selectedType: obj.selectedType,
        objectiveText: escapeText(obj.objectiveText),
        targetText: escapeText(obj.targetText)
      };

      if (this.mode === 'approver') {
        if (obj.keyObjective?.trim()) {
          item.keyObjective = escapeText(obj.keyObjective.trim());
        }
        if (obj.keyTarget?.trim()) {
          item.keyTarget = escapeText(obj.keyTarget.trim());
        }
      }

      return item;
    });

    console.log(processedObjectives);

    const param =
      this.mode === 'approver'
        ? 'kpi_update_data_by_approver'
        : 'kpi_insert_data';

    let obj: any = {
      userIdKPI: this.userId,
      userName: this.userName,
      randomData: JSON.stringify(processedObjectives),
      year: this.year,
      param: param
    };

    if (this.mode === 'approver') {
      obj.objectId = this.kpiId;
    }else{
      obj.objectId = '';
    }

    this.kpi.saveKpi(obj).subscribe({
      next: (response) => {
        console.log('KPI saved successfully:', response);
        this.onCancel();
      },
      error: (error) => {
        console.error('Error saving KPI:', error);
        this.onCancel();
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


  openTargetHistory(obj: any) {
    console.log(obj)
    this.kpi.getLogData({userIdKPI:this.userId,param: 'changed-target-history',objectId:this.kpiUserId,parameter:this.team,pid:this.year,extraParam:this.kpiId})
      .subscribe(res => {

          this.changedTargetHistory = Array.isArray(res?.['changed-target-history']) ? res?.['changed-target-history'] : res?.['changed-target-history']
          console.log(this.changedTargetHistory);
        },
        (error) => {
          console.error("Error fetching permission list", error);
        }
      );
  }

  openObjectiveHistory(obj: any,i:any) {
    this.showObjectiveHistoryIndex = null;
    this.kpi.getLogData({param: 'changed-objective-history',objectId:obj.id,parameter:this.team,pid:this.year,extraParam:obj.workId})
      .subscribe(res => {
          this.changedObjHistory = Array.isArray(res?.['changed-objective-history']) ? res?.['changed-objective-history'] : res?.['changed-objective-history']
          this.openChangedObjectiveHistory(i);
        },
        (error) => {
          console.error("Error fetching permission list", error);
        }
      );
  }


  getAttribute() {
    this.kpi.getLogData({param: 'attributeType'})
      .subscribe(res => {
          this.attributeType = Array.isArray(res?.['attributeType']) ? res?.['attributeType'] : res?.['attributeType']
          console.log(this.attributeType);
        },
        (error) => {
          console.error("Error fetching permission list", error);
        }
      );
  }

  togglePerformanceEdit(obj: any) {
    obj.isEditingPerformance = !obj.isEditingPerformance;
  }



  openPerformanceHistory(obj: any) {
    console.log(obj)
    this.kpi.getLogData({userIdKPI:this.userId,param: 'changed-performance-history',objectId:this.kpiUserId,parameter:this.team,pid:this.year,extraParam:this.kpiId})
      .subscribe(res => {
          this.changedPerformanceHistory = Array.isArray(res?.['changed-performance-history']) ? res?.['changed-performance-history'] : res?.['changed-performance-history']
          this.openChangedHistory();
        },
        (error) => {
          console.error("Error fetching permission list", error);
        }
      );
  }


  openChangedHistory() {
    this.showHistory = !this.showHistory;
  }

  openChangedTargetHistory() {

  }

  openChangedObjectiveHistory(i: number) {

  }


  openAchievedHistory(obj: any) {

  }

  openChangedAchievedHistory() {

  }

  toggleAchievedEdit(obj: any) {

  }


  getRating() {
    this.kpi.getLogData({userIdKPI:this.userId,param: 'get_ratings',extraParam:'KPI Objective'})
      .subscribe(res => {
          this.ratings = Array.isArray(res?.['get_ratings']) ? res?.['get_ratings'] : res?.['get_ratings']
        },
        (error) => {
          console.error("Error fetching ratings", error);
        }
      );
  }


  onOverallRating(type: any) {
    this.objOverallRating  = type.kpi_category_name;


  }
}
