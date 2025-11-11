import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../../common-service.service";



interface Objective {
  id: number;
  title: string;
  selfText: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-self-assessment',
  templateUrl: './self-assessment.component.html',
  styleUrls: ['./self-assessment.component.css']
})
export class SelfAssessmentComponent {

  @Output() dataSubmitted = new EventEmitter<any>();
  @Input() userData: any;
  @Input() currentStatus: any;
  objectives: Objective[] = [
    {
      id: 1,
      title: 'If any, list your accomplishments that do not specifically pertain to work objectives but may pertain to your ongoing job responsibilities.',
      selfText: '',
      isOpen: false
    },
    {
      id:2,
      title: 'If any, list areas where you faced challenges that relate to your work objectives or ongoing job responsibilities.',
      selfText: '',
      isOpen: false
    },
    {
      id:3,
      title: 'List areas where you feel you need to improve or where you feel you require more support (i.e., training, guidance and mentoring).',
      selfText: '',
      isOpen: false
    }
  ];


  data:any = [];
  isOpen: boolean[] = [];
  mode:any;
  objectiveTypes: string[] = ['Production', 'Support', 'Innovation', 'People', 'Other'];
  rating: any[] = ['Role Model', 'Very Good', 'Good', 'Improvement Required', 'Unacceptable'];
  overAllRating: any;

  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }



  ngOnInit(): void {
    this.kpi.getLogData({param: 'evalution-self-kpi-list',objectId:this.userData.user_id,parameter:this.userData.team,pid:this.userData.year,extraParam:this.userData.id})
      .subscribe(res => {
          // this.data = res?.['kpi-list'];
          this.data = Array.isArray(res?.['evalution-self-kpi-list']) ? res?.['evalution-self-kpi-list'] : res?.['evalution-self-kpi-list']
          console.log(this.data);
          this.objectives = this.objectives.map((obj, index) => ({
            ...obj,
            selfText: this.data[index]?.remark || ''
          }));
        },
        (error) => {
          console.error("Error fetching permission list", error);
        }

      );
  }


  toggleObjective(obj: Objective): void {
    obj.isOpen = !obj.isOpen;
  }


  onBack() {

  }

  onNext() {
    const answers = this.objectives.map((obj, index) => ({
      index: index + 1,
      title: obj.title,
      answer: obj.selfText,
    }));


    // if you want to send to backend:
    // const formData = new FormData();
    // formData.append('userId', this.userId);
    // formData.append('answers', JSON.stringify(answers));
    // this.kpiService.saveSelfAssessment(formData).subscribe(...);
  }

  isNextDisabled(): boolean {
    return this.objectives.some((o: Objective) => !(o.selfText && o.selfText.trim()));
  }

  onOverallRating(type: any) {
    this.overAllRating = type;
  }


  submitData() {
    this.dataSubmitted.emit(this.objectives);
    console.log(this.objectives)
  }
}
