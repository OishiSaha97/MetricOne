import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../../common-service.service";
import {CookiesService} from "../../../cookies.service";
import {CryptoService} from "../../../crypto.service";
interface Objective {
  id: number;
  name: string;
  selectedRating: string;
  objectiveText: string;
  keyObjective: string;
  isOpen: boolean;
  isEditingObjective: boolean;
  overAllRating: string;
}
@Component({
  selector: 'app-values-component',
  templateUrl: './values-component.component.html',
  styleUrls: ['./values-component.component.css']
})
export class ValuesComponentComponent {
  objectives: Objective[] = [
    { id: 1, name: 'DEPENDABILITY', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false, overAllRating: '' },
    { id: 2, name: 'JOB KNOWLEDGE AND SKILLS', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false, overAllRating: '' },
    { id: 3, name: 'INITIATIVE AND RESOURCEFULNESS', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false, overAllRating: '' },
    { id: 4, name: 'JUDGEMENT', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false , overAllRating: ''},
    { id: 5, name: 'ADAPTABILITY', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false, overAllRating: '' },
    { id: 6, name: 'DECISIVENESS', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false, overAllRating: '' },
    { id: 7, name: 'INTERPERSONAL RELATIONSHIPS', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false, overAllRating: '' },
    { id: 8, name: 'OVERALL RATING', selectedRating: '', objectiveText: '', keyObjective: '', isOpen: false, isEditingObjective: false, overAllRating: '' }];

  @Output() dataSubmitted = new EventEmitter<any>();
  @Input() userData: any;
  @Input() currentStatus: any;
  @Input() view: any;
  @Input() isBack:any=false;
  @Input() onNexts:any=false;
  @Input() oldObjective:any=[];
  @Input() oldOverallRating:any=[];
  @Output() backdataSubmitted = new EventEmitter<any>();
  @Input() savedValuesData:any=[];
  isOpen: boolean[] = [];
  mode:any;
  userId:any;
  role:any;
  ratings: any = [];
  overAllRating: any;
  data: any =[];
  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService,
              private cryptoService: CryptoService,
              public cookieService: CookiesService) {
  }


  ngOnInit(): void {
    this.role = this.cookieService.getCookie('role');
    this.userId = this.cookieService.getCookie('username');
    this.getRating();
    if(!this.isBack) {
      this.kpi.getLogData({
        param: 'evalution-values-kpi-list',
        objectId: this.userData.user_id,
        parameter: this.userData.team,
        pid: this.userData.year,
        extraParam: this.userData.id
      })
        .subscribe(async res => {
            const data = res?.['evalution-values-kpi-list']?.[0];
            if (!data) return;
            let ratingArray: string[] = [];
            try {
              ratingArray = data.rating ? JSON.parse(data.rating) : [];
            } catch (e) {
              console.warn("Rating parse failed, using empty array");
            }
            this.objectives =  await Promise.all(this.objectives.map(async(obj, index) => {
              let rating = '';

              switch (obj.name.toUpperCase()) {
                case 'DEPENDABILITY':
                  rating = await this.cryptoService.decrypt( data.dependability)?? '';
                  break;
                case 'JOB KNOWLEDGE AND SKILLS':
                  rating = await this.cryptoService.decrypt( data.job_knowledge)?? '';
                  break;
                case 'INITIATIVE AND RESOURCEFULNESS':
                  rating = await this.cryptoService.decrypt( data.initiative)?? '';
                  break;
                case 'JUDGEMENT':
                  rating = await this.cryptoService.decrypt( data.judgement)?? '';
                  break;
                case 'ADAPTABILITY':
                  rating = await this.cryptoService.decrypt( data.adaptability)?? '';
                  break;
                case 'DECISIVENESS':
                  rating = await this.cryptoService.decrypt(data.decidiveness)?? '';
                  break;
                case 'INTERPERSONAL RELATIONSHIPS':
                  rating = await this.cryptoService.decrypt(data.interpersonal_relation)?? '';
                  break;
                case 'OVERALL RATING':
                  rating = await this.cryptoService.decrypt(data.overall_rating)?? '';
                  break;
                default:
                  rating = ratingArray[index] || '';
              }

              if (index === 7) {
                return {...obj, overAllRating: rating};
              } else {
                return {...obj, selectedRating: rating};
              }
            }) );

          },
          (error) => {
            console.error("Error fetching permission list", error);
          }
        );
    }
    else if(this.onNexts === true && this.isBack === true){
      this.objectives = this.savedValuesData.map((obj: any, index: number) => {

        const savedRating = obj.selectedRating || '';
        const overallRating = obj.overAllRating || '';

        if (index === 7) {
          return {
            ...obj,
            selectedRating: undefined,
            overAllRating: overallRating
          };
        } else {
          return {
            ...obj,
            selectedRating: savedRating,
            overAllRating: undefined
          };
        }
      });

    }
    else {

      this.objectives = this.oldObjective.map((obj: any, index: number) => {

        const savedRating = obj.selectedRating || '';
        const overallRating = obj.overAllRating || '';

        if (index === 7) {
          return {
            ...obj,
            selectedRating: undefined,
            overAllRating: overallRating
          };
        } else {
          return {
            ...obj,
            selectedRating: savedRating,
            overAllRating: undefined
          };
        }
      });
    }

  }
  // onObjectiveChange(type: any, obj: Objective,i:number): void {
  //   obj.selectedRating = type;
  //   this.isOpen[i] = false;
  //   console.log(`Objective ${obj.id} selected rating:`, obj.selectedRating);
  // }


  toggleObjective(obj: Objective): void {
    obj.isOpen = !obj.isOpen;
  }

  onObjectiveChange(type: any, obj: Objective): void {

    if (obj.selectedRating === type.kpi_category_name) {
      obj.selectedRating = '';
    } else {
      obj.selectedRating = type.kpi_category_name;
    }
    // obj.selectedRating = type.kpi_category_name;
  }
  onOverAllRating(type: any, obj: Objective): void {
    obj.selectedRating = type.kpi_category_name;

    if (obj.overAllRating === type.kpi_category_name) {
      obj.overAllRating = '';
    } else {
      obj.overAllRating = type.kpi_category_name;
    }
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

  onNextsself(){
    this.backdataSubmitted.emit(this.objectives);
  }

  objectiveErrors: { [key: number]:
      {
        selectedRating?: string;
        overAllRating?: string;
      } } = {};

  validateObjectives(): boolean {
    let hasError = false;
    for (let i = 0; i < this.objectives.length; i++) {
      if (i === 7) {
        continue;
      }
      const obj = this.objectives[i];
      this.objectiveErrors[i] = {};
      if (!obj.selectedRating?.trim()) {
        this.objectiveErrors[i].selectedRating = '*Rating is required';
        hasError = true;
      }

    }

    if(!this.objectives[7].overAllRating?.trim() && (this.currentStatus === 'manager' || this.currentStatus === 'approver' || this.currentStatus === 'hr')){
      this.objectiveErrors[7].overAllRating = '*Overall Rating is required';
      hasError = true;
    }

    if (hasError) {
      this.showToast("Please fill all required fields.");
      return false;
    }
    return !hasError;
  }


  submitData() {

    if (!this.validateObjectives()) {
      return;
    }
    const finalData = this.objectives.map((obj, index) => {
      if (index === 7) {
        return {
          ...obj,
          overall_rating: obj.overAllRating   // API needs this
        };
      }
      return obj;
    });
    this.dataSubmitted.emit(finalData);
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

  @ViewChild('errorToast', { static: false }) errorToast!: ElementRef;
  toastMessage: string = '';

  showToast(msg: string) {
    this.toastMessage = msg;

    setTimeout(() => {
      const el = this.errorToast.nativeElement;

      el.classList.add('show');
      setTimeout(() => {
        el.classList.remove('show');
      }, 5000);

    }, 0);
  }



}
