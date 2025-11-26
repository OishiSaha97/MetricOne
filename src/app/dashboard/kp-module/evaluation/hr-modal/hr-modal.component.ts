import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../../common-service.service";

interface Objective {
  id: number;
  name: string;
  isOpen: boolean;
  isOpenIncrement: boolean;
  isEditingObjective: boolean;
  objectiveText: string;
  increment: string;
  keyObjective?: string;
  attendanceRating:string;
  leaveRating:string;
  issueRating:string;
  awardRating:string;
}
@Component({
  selector: 'app-hr-modal',
  templateUrl: './hr-modal.component.html',
  styleUrls: ['./hr-modal.component.css']
})
export class HrModalComponent {

  @Output() dataSubmitted = new EventEmitter<any>();
  @Input() userData: any;
  @Input() currentStatus: any;
  @Input() view: any;
  @Input() oldObjective:any=[];
  @Input() isBack:any=false;

  objectives: Objective[] = [
    { id: 1, name: 'HR’S COMMENT', isOpen: false,isOpenIncrement: false,isEditingObjective: false, objectiveText: '',increment: '', keyObjective: '',attendanceRating:'',leaveRating:'',issueRating:'' ,awardRating:''},
    // { id: 2, name: 'FINAL INCREMENT', isOpen: false, isEditingObjective: false, objectiveText: '', keyObjective: '',attendanceRating:'',leaveRating:'',issueRating:'' ,awardRating:''},
  ];
  mode: any;
  userName: any;
  userId: any;
  role: any;
  ratings: any = [];
  // attendanceRating: any;
  // leaveRating: any;
  // issueRating: any;
  // awardRating: any;

  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }


  ngOnInit(): void {
    this.userName = localStorage.getItem('fullName');
    this.userId = localStorage.getItem('username');
    this.role = localStorage.getItem('role');
    this.getRating();
  }

  toggleObjective(obj: Objective): void {
    obj.isOpen = !obj.isOpen;
  }
  toggleObjectiveIncrement(obj: Objective): void {
    obj.isOpenIncrement = !obj.isOpenIncrement;
  }

  onAttendanceRating(obj: Objective,type: any) {
    // this.attendanceRating = type;
    obj.attendanceRating=type.kpi_category_name;
  }

  onLeaveRating(obj: Objective,type: any) {
    // this.leaveRating = type;
    obj.leaveRating=type.kpi_category_name;
  }

  onIssueRating(obj: Objective,type: any) {
    // this.issueRating = type;
    obj.issueRating=type.kpi_category_name;
  }

  onAwardRating(obj: Objective,type: any) {
    // this.awardRating = type;
    obj.awardRating=type.kpi_category_name;
  }

  submitData() {
    if (!this.validateObjectives()) {
      return;
    }
    console.log("objectives : ", this.objectives);
    this.dataSubmitted.emit(this.objectives);
  }
  objectiveErrors: { [key: number]:
      {
        objectiveText?: string;
        attendanceRating?: string;
        leaveRating?: string;
        issueRating?: string;
        awardRating?: string;
        incrementText?: string;
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
      if (!obj.increment?.trim()) {
        this.objectiveErrors[i].incrementText = '*Final Increment is required';
        hasError = true;
      }
      if (!obj.attendanceRating?.trim()) {
        this.objectiveErrors[i].attendanceRating = '*Attendance rating is required';
        hasError = true;
      }
      if (!obj.leaveRating?.trim()) {
        this.objectiveErrors[i].leaveRating = '*Leave Rating is required';
        hasError = true;
      }
      if (!obj.issueRating?.trim()) {
        this.objectiveErrors[i].issueRating = '*Issue Rating is required';
        hasError = true;
      }
      if (!obj.awardRating?.trim()) {
        this.objectiveErrors[i].awardRating = '*Award Rating is required';
        hasError = true;
      }
    }
    return !hasError;
  }

  getRating() {
    this.kpi.getLogData({userIdKPI:this.userId,param: 'get_ratings',extraParam:'KPI HR'})
      .subscribe(res => {
          this.ratings = Array.isArray(res?.['get_ratings']) ? res?.['get_ratings'] : res?.['get_ratings']
        },
        (error) => {
          console.error("Error fetching ratings", error);
        }
      );
  }

}
