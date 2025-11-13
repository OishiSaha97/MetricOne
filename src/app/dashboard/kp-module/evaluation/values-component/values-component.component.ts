import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../../common-service.service";
interface Objective {
  id: number;
  name: string;
  selectedRating: string;
  objectiveText: string;
  keyObjective: string;
  isOpen: boolean;
  isEditingObjective: boolean;
}
@Component({
  selector: 'app-values-component',
  templateUrl: './values-component.component.html',
  styleUrls: ['./values-component.component.css']
})
export class ValuesComponentComponent {
  objectives: Objective[] = [
    { id: 1, name: 'DEPENDABILITY', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false },
    { id: 2, name: 'JOB KNOWLEDGE AND SKILLS', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false },
    { id: 3, name: 'INITIATIVE AND RESOURCEFULNESS', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false },
    { id: 4, name: 'JUDGEMENT', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false },
    { id: 5, name: 'ADAPTABILITY', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false },
    { id: 6, name: 'DECISIVENESS', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false },
    { id: 7, name: 'INTERPERSONAL RELATIONSHIPS', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false },
    { id: 8, name: 'OVERALL RATING', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false }];

  @Output() dataSubmitted = new EventEmitter<any>();
  @Input() userData: any;
  @Input() currentStatus: any;
  isOpen: boolean[] = [];
  mode:any;
  userId:any;
  ratings: any = [];
  overAllRating: any;
  data: any =[];
  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }


  ngOnInit(): void {
    this.userId = localStorage.getItem('username');
    this.getRating();
    this.kpi.getLogData({param: 'evalution-values-kpi-list',objectId:this.userData.user_id,parameter:this.userData.team,pid:this.userData.year,extraParam:this.userData.id})
      .subscribe(res => {
          const data = res?.['evalution-values-kpi-list']?.[0];
          if (!data) return;
          let ratingArray: string[] = [];
          try {
            ratingArray = data.rating ? JSON.parse(data.rating) : [];
          } catch (e) {
            console.warn("Rating parse failed, using empty array");
          }
          this.objectives = this.objectives.map((obj, index) => {
            let rating = '';

            switch (obj.name.toUpperCase()) {
              case 'DEPENDABILITY': rating = data.dependability; break;
              case 'JOB KNOWLEDGE AND SKILLS': rating = data.job_knowledge; break;
              case 'INITIATIVE AND RESOURCEFULNESS': rating = data.initiative; break;
              case 'JUDGEMENT': rating = data.judgement; break;
              case 'ADAPTABILITY': rating = data.adaptability; break;
              case 'DECISIVENESS': rating = data.decidiveness; break;
              case 'INTERPERSONAL RELATIONSHIPS': rating = data.interpersonal_relation; break;
              case 'OVERALL RATING': rating = data.overall_rating; break;
              default: rating = ratingArray[index] || '';
            }

            return { ...obj, selectedRating: rating };
          });

          console.log("this.objectives : ", this.objectives);
        },
        (error) => {
          console.error("Error fetching permission list", error);
        }

      );
  }
  // onObjectiveChange(type: any, obj: Objective,i:number): void {
  //   obj.selectedRating = type;
  //   this.isOpen[i] = false;
  //   console.log(`Objective ${obj.id} selected rating:`, obj.selectedRating);
  // }


  onBack() {

  }

  // onOverallRating(type: any,) {
  //   obj.selectedRating = type;
  // }

  toggleObjective(obj: Objective): void {
    obj.isOpen = !obj.isOpen;
  }

  // toggleObjectiveEdit(obj: Objective): void {
  //   obj.isEditingObjective = !obj.isEditingObjective;
  // }

  onObjectiveChange(type: any, obj: Objective): void {
    obj.selectedRating = type.kpi_category_name;
  }

  onNext(): void {
    console.log('All Objectives:', this.objectives);

    const incomplete = this.objectives.filter(o => !o.objectiveText || !o.selectedRating);
    if (incomplete.length > 0) {
      console.warn('Incomplete objectives:', incomplete);
    } else {
      console.log('All objectives are filled in.');
    }
  }


  submitData() {
    // this.dataSubmitted.emit(this.objectives);
    console.log(this.objectives)
  }
  getRating() {
    this.kpi.getLogData({userIdKPI:this.userId,param: 'get_ratings',extraParam:'KPI Values'})
      .subscribe(res => {
          this.ratings = Array.isArray(res?.['get_ratings']) ? res?.['get_ratings'] : res?.['get_ratings']
        },
        (error) => {
          console.error("Error fetching ratings", error);
        }
      );
  }


}
