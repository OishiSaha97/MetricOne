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

  @Output() dataSubmittedDraft = new EventEmitter<any>();
  @Output() dataSubmitted = new EventEmitter<any>();
  @Output() backdataSubmitted = new EventEmitter<any>();
  @Input() userData: any;
  @Input() currentStatus: any;
  @Input() view: any;
  @Input() isBack:any=false;
  @Input() onNexts:any=false;
  @Input() savedselfData:any=[];
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
  userName: any;
  userId: any;
  role: any;
  @Input() oldObjective:any=[];
  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }



  ngOnInit(): void {
    this.userName = localStorage.getItem('fullName');
    this.userId = localStorage.getItem('username');
    this.role = localStorage.getItem('role');


    if(this.onNexts == true){
      console.log("savedselfData",this.savedselfData);
      this.objectives = this.savedselfData.map((obj:Objective, index:number) => ({
        ...obj,
        selfText: this.savedselfData[index]?.selfText || ''
      }));
    }
    else{
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
  }


  toggleObjective(obj: Objective): void {
    obj.isOpen = !obj.isOpen;
  }


  onBack() {

  }

  onNext() {
    this.backdataSubmitted.emit(this.objectives);


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
    if (!this.validateObjectives()) {
      return;
    }
    this.dataSubmitted.emit(this.objectives);
    console.log(this.objectives)
  }

  submitDataDraft() {
    this.dataSubmittedDraft.emit(this.objectives);
  }

  objectiveErrors: { [key: number]:
      {
        selfText?: string;
        rating?: string;
      } } = {};

  validateObjectives(): boolean {
    let hasError = false;
    for (let i = 0; i < this.objectives.length; i++) {
      const obj = this.objectives[i];
      this.objectiveErrors[i] = {};

      if (!obj.selfText?.trim()) {
        this.objectiveErrors[i].selfText = '*Text is required';
        hasError = true;
      }
        //
        // if ((this.currentStatus == 'employee') &&
        //   !obj.selfText?.trim()
        // ) {
        //   console.log(obj)
        //   alert(`Please fill all fields for ${obj.title || 'Objective ' + (i + 1)}`);
        //   return false;
        // }
      }

    // }

    return !hasError;
  }



}
