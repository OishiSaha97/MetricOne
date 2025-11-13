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

  objectives: Objective[] = [
    { id: 1, name: 'HR’S COMMENT', isOpen: false, isEditingObjective: false, objectiveText: '', keyObjective: '',attendanceRating:'',leaveRating:'',issueRating:'' ,awardRating:''}];
  mode: any;
  ratings: any = [];
  userName: any;
  userId: any;
  role: any;

  ngOnInit(): void {
    this.userName = localStorage.getItem('fullName');
    this.userId = localStorage.getItem('username');
    this.role = localStorage.getItem('role');
  }

  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('username');
    this.getRating();
  }
  toggleObjective(obj: Objective): void {
    obj.isOpen = !obj.isOpen;
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
    this.dataSubmitted.emit(this.objectives);
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
