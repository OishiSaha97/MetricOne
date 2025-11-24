import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
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
  @Output() rateSubmit = new EventEmitter<any>();
  @Input() currentStatus: any;
  @Input() view: any;




  @Input() userData: any;
  objectiveTypes: any[] = [{id:1,name:'Production'},
    {id:2,name: 'Support'},
    {id:3,name: 'Innovation'},
    {id:4,name: 'People'},
    {id:5,name: 'Recruitment'},
    {id:6,name: 'Performance Management'},
    {id:7,name: 'Compensation & Benefits '},
    {id:8,name: 'Training & Development'},
    {id:9,name: 'Employee Engagement'},
    {id:10,name: 'Record Keeping'},
    {id:11,name: 'Financial Reporting/Analysis'},
    {id:12,name: 'Budgeting & Forecasting'},
    {id:13,name: 'Compliance & Tax Management'},
    {id:14,name: 'Financial Statement Preparation'},
    {id:15,name: 'Network & Server Management'},
    {id:16,name: 'Device Management'},
    {id:17,name: 'Trouble Shooting'},
    {id:18,name: 'User Assistance'},
    {id:19,name: 'Cyber Security & Data Protection'},
    {id:20,name: 'Software & Application Management'},
    {id:21,name: 'IT Governance & Strategy'},
    {id:22,name: 'Policy Implementation'},
    {id:23,name: 'Facility Management'},
    {id:24,name: 'Stationery Management'},
    {id:25,name:'Other'}];
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

    console.log(this.view)
    for (let i = 1; i <= 3; i++) {
      this.addObjective();
    }
    this.getRating();

    // this.getAttribute();
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
              objectiveText: (item.objective || '').replace(/\\n/g, '\n'),
              targetText: (item.target || '').replace(/\\n/g, '\n'),
              performanceText: (item.performance || '').replace(/\\n/g, '\n'),
              weightage: item.weightage,
              rating:
                item.overall_rating === null ||
                item.overall_rating === undefined ||
                item.overall_rating === '' ||
                item.overall_rating === 'null'
                  ? null
                  : item.overall_rating,
              achievedText: (item.achieved_text || '').replace(/\\n/g, '\n'),
              achievedInt: item.achieved_int,
              //targetText: item.target,
              isOpen: false
            }));
          },
          (error) => {
            console.error("Error fetching permission list", error);
          }

   );
      if(['manager','hr','approver'].includes(this.currentStatus)){
        this.getOverallRating();
      }


  }

  submitData() {
    if (!this.validateObjectives()) {
      return;
    }
    this.rateSubmit.emit(this.objOverallRating);
    this.dataSubmitted.emit(this.objectives);
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
    if (obj.selectedType === type.name) {
      obj.selectedType = '';
    } else {
      obj.selectedType = type.name;
    }
    this.isOpen[i] = false;
    console.log(`Objective ${obj.id} selected type:`, obj.selectedType);
    this.searchType='';
    // this.filterObjectiveTypes = this.filterObjectiveTypes.filter(
    //   (t: any) => t.name !== obj.selectedType
    // );
    // this.filterTypes();
  }


  searchType: any;
  filterObjectiveTypes: any[]=[];


  filterTypes() {
    const search = this.searchType.trim().toLowerCase();

    this.filterObjectiveTypes = this.objectiveTypes.filter((apr: any) =>
      // Type obj explicitly as Objective
      !this.objectives.some((obj: Objective) => obj.selectedType === apr.name) &&
      apr.name.toLowerCase().includes(search)
    );
  }


  onRating(type: any, obj: Objective,i:number): void {
    obj.rating = type.kpi_category_name;
    this.isOpen[i] = false;
    console.log(`Objective ${obj.id} selected rating:`, obj.rating);
  }
  objectiveErrors: { [key: number]:
      {
        selectedType?: string;
        rating?: string;
        objectiveText?: string;
        targetText?: string;
        performanceText?: string;
        achievedText?: string;
        achievedInt?: string;
        keyObjectiveText?:string;
        keyPerformanceText?:string;
        keyTargetText?:string;
        keyAchieved?:string;
        weightage?: string;
      } } = {};

  objOverallRatingError: string = '';


  validateObjectives(): boolean {
    let hasError = false;
    let totalWeightage = 0;
    for (let i = 0; i < this.objectives.length; i++) {
      const obj = this.objectives[i];
      this.objectiveErrors[i] = {};
      if(this.currentStatus != 'employee' && (this.role == 'hr' || this.role == 'manager')){
        if (!obj.rating?.trim()) {
          this.objectiveErrors[i].rating = '*Rating is required';
          hasError = true;
        }
        if (!obj.weightage?.trim()) {
          this.objectiveErrors[i].weightage = '*Weightage is required';
          hasError = true;
        }
        if (!obj.objectiveText?.trim()) {
          this.objectiveErrors[i].objectiveText = '*Objective is required';
          hasError = true;
        }
        if (!obj.targetText?.trim()) {
          this.objectiveErrors[i].targetText = '*Target is required';
          hasError = true;
        }
        if (!obj.performanceText?.trim()) {
          this.objectiveErrors[i].performanceText = '*Performance Text is required';
          hasError = true;
        }
        if (!obj.achievedText?.trim()) {
          this.objectiveErrors[i].achievedText = '*Achieved Text is required';
          hasError = true;
        }
        if (!obj.achievedInt) {
          this.objectiveErrors[i].achievedInt = '*Achieved Number is required';
          hasError = true;
        }
        if (!this.objOverallRating) {
          this.objOverallRatingError = '*Overall Rating is required';
          hasError = true;
        }


        if (obj.isEditingObjective && !obj.keyObjective?.trim()) {
          this.objectiveErrors[i].keyObjectiveText = '*Key Update Points required';
          hasError = true;
        }
        if (obj.isEditingPerformance && !obj.keyPerformance?.trim()) {
          this.objectiveErrors[i].keyPerformanceText = '*Key Update Points required';
          hasError = true;
        }
        if (obj.isEditingTarget && !obj.keyTarget?.trim()) {
          this.objectiveErrors[i].keyTargetText = '*Key Update Points required';
          hasError = true;
        }
        if (obj.isEditingAchieved && !obj.keyAchieved?.trim()) {
          this.objectiveErrors[i].keyAchieved = '*Key Update Points required';
          hasError = true;
        }
        if (!this.objOverallRating?.trim()) {
          hasError = true;
        }
        if (
          !obj.selectedType?.trim()
        ) {
          hasError = true;
        }

        const weight = parseFloat((obj.weightage || '0').toString().trim());

        if(!weight){
          this.objectiveErrors[i].weightage = '*Weightage is required';
          hasError = true;
        }
        else if (isNaN(weight) || weight <= 0) {
          this.objectiveErrors[i].weightage = '*Weightage must be > 0';
          hasError = true;
        }
        totalWeightage += weight;

        //
        //
        // if (
        //   !obj.selectedType?.trim() ||
        //   !obj.objectiveText?.trim() ||
        //   !obj.targetText?.trim() ||
        //   !obj.performanceText?.trim() ||
        //   !obj.achievedText?.trim() ||
        //   !obj.achievedInt ||
        //   !obj.weightage?.trim() ||
        //   !obj.rating?.trim()
        //   // ||
        //   // !obj.overAllRating?.trim()
        // ) {
        //   console.log(obj)
        //   alert(`Please fill all fields for ${obj.title || 'Objective ' + (i + 1)}`);
        //   return hasError;
        // }
      }
      else{
        if (this.currentStatus == 'employee'){
          if (!obj.weightage?.trim()) {
            this.objectiveErrors[i].weightage = '*Weightage is required';
            hasError = true;
          }
          if (!obj.selectedType?.trim()) {
            hasError = true;
          }
          if (!obj.objectiveText?.trim()) {
            this.objectiveErrors[i].objectiveText = '*Objective is required';
            hasError = true;
          }
          if (!obj.targetText?.trim()) {
            this.objectiveErrors[i].targetText = '*Target is required';
            hasError = true;
          }
          if (!obj.performanceText?.trim()) {
            this.objectiveErrors[i].performanceText = '*Performance Text is required';
            hasError = true;
          }
          if (!obj.achievedText?.trim()) {
            this.objectiveErrors[i].achievedText = '*Achieved Text is required';
            hasError = true;
          }
          // if (!obj.achievedInt) {
          //   this.objectiveErrors[i].achievedInt = '*Achieved Number is required';
          //   hasError = true;
          // }

          if (obj.isEditingObjective && !obj.keyObjective?.trim()) {
            this.objectiveErrors[i].keyObjectiveText = '*Key Update Points required';
            hasError = true;
          }
          if (obj.isEditingPerformance && !obj.keyPerformance?.trim()) {
            this.objectiveErrors[i].keyPerformanceText = '*Key Update Points required';
            hasError = true;
          }
          if (obj.isEditingTarget && !obj.keyTarget?.trim()) {
            this.objectiveErrors[i].keyTargetText = '*Key Update Points required';
            hasError = true;
          }
          if (obj.isEditingAchieved && !obj.keyAchieved?.trim()) {
            this.objectiveErrors[i].keyAchieved = '*Key Update Points required';
            hasError = true;
          }
          const weight = parseFloat((obj.weightage || '0').toString().trim());

          if(!weight){
            this.objectiveErrors[i].weightage = '*Weightage is required';
            hasError = true;
          }
          else if (isNaN(weight) || weight <= 0) {
            this.objectiveErrors[i].weightage = '*Weightage must be > 0';
            hasError = true;
          }
          totalWeightage += weight;



        }
        // if ((this.currentStatus == 'employee') &&
        //   !obj.selectedType?.trim() ||
        //   !obj.objectiveText?.trim() ||
        //   !obj.targetText?.trim() ||
        //   !obj.weightage?.trim() ||
        //   !obj.performanceText?.trim() ||
        //   !obj.achievedText?.trim()
        // ) {
        //   console.log(obj)
        //   alert(`Please fill all fields for ${obj.title || 'Objective ' + (i + 1)}`);
        //   return false;
        // }
      }

    }
    if (Math.round(totalWeightage) !== 100) {

      this.showToast(`Total weightage must be exactly 100%. Current total: ${totalWeightage}%`);
      return false;
    }

    return !hasError;
  }
  @ViewChild('errorToast', { static: false }) errorToast!: ElementRef;
  toastMessage: string = '';
  showToast(msg: string) {
    this.toastMessage = msg;

    // Show toast after 20 sec
    setTimeout(() => {
      const el = this.errorToast.nativeElement;

      el.classList.add('show');

      // Auto-hide after 3 seconds
      setTimeout(() => {
        el.classList.remove('show');
      }, 5000);

    }, 0);
  }

  blockDecimal(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];


    if (allowedKeys.includes(event.key)) return;

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onSubmit(): void {
    if (!this.validateObjectives()) {
      return;
    }

    let processedObjectives = this.objectives.map((obj: Objective) => {

      const escapeText = (text: string | undefined) => {
        return text;
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


  // getAttribute() {
  //   this.kpi.getLogData({param: 'attributeType'})
  //     .subscribe(res => {
  //         this.attributeType = Array.isArray(res?.['attributeType']) ? res?.['attributeType'] : res?.['attributeType']
  //         console.log(this.attributeType);
  //       },
  //       (error) => {
  //         console.error("Error fetching permission list", error);
  //       }
  //     );
  // }

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
    obj.isEditingAchieved = !obj.isEditingAchieved;
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

  getOverallRating(){
    this.kpi.getLogData({userIdKPI:this.userId,param: 'get_overAllRating',objectId:this.userData.user_id,parameter:this.userData.team,pid:this.userData.year,extraParam:this.userData.id})
      .subscribe(res => {
          this.objOverallRating = Array.isArray(res?.['get_overAllRating']) ? res?.['get_overAllRating'][0].over_all_rating : res?.['get_overAllRating'][0].over_all_rating
          console.log("Overall Rating :", this.objOverallRating);
        },
        (error) => {
          console.error("Error fetching ratings", error);
        }
      );
  }

  autoGrow(event: any) {
    const textarea = event.target;
    textarea.style.height = '41px';
    textarea.style.height = textarea.scrollHeight + 'px';
  }


}
