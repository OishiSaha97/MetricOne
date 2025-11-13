import {Component, TemplateRef, ViewChild} from '@angular/core';
import {ObjectiveSetComponent} from "./objective-set/objective-set.component";
import {SelfAssessmentComponent} from "./self-assessment/self-assessment.component";
import {ManagerInsightComponent} from "./manager-insight/manager-insight.component";
import { ValuesComponentComponent } from './values-component/values-component.component';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../common-service.service";
import {HrModalComponent} from "./hr-modal/hr-modal.component";
import {Subject} from "rxjs";




@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})


export class EvaluationComponent {
  tables: { [key: string]: { selected: boolean } } = {
    objective: { selected: true },
    self: { selected: false },
    values: { selected: false },
    manager: { selected: false },
    hr: { selected: false },
  };
  currentTable: string = 'objective';
  userData: any;
  currentStep: number = 1;
  mode:any
  remarkList: any;
  remark: any;

  kpiUserId:any;
  status: any;
  team: any;
  name: any;
  year: any;
  kpiId: any;

  isOpenRemark: boolean[] = [];


  currentStatus:any='';
  objectiveSet:any = [];
  selfAssessment:any = [];
  valuesData:any = [];
  managerData:any = [];
  hrData:any = [];
  userId:any;


  @ViewChild(ObjectiveSetComponent) objectiveComp!: ObjectiveSetComponent;
  @ViewChild(SelfAssessmentComponent) selfComp!: SelfAssessmentComponent;
  @ViewChild(ValuesComponentComponent) valuesComp!: ValuesComponentComponent;
  @ViewChild(ManagerInsightComponent) managerComp!: ManagerInsightComponent;
  @ViewChild(HrModalComponent) hrComp!: HrModalComponent;
  role: any = '';
  timePeriod:any = '';
  saveEmitter = new Subject<any>();

  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }
  maxStep:any=3;


  ngOnInit(){
    this.maxStepData();
    this.currentTable = 'objective';
    this.userId = localStorage.getItem('username');
    this.role = localStorage.getItem('role');
    this.timePeriod = localStorage.getItem('timePeriod');

    console.log("Role:", this.role);
  }

  maxStepData() {
    if (this.currentStatus === 'employee'){
      this.maxStep=2;
    }
    if (this.currentStatus === 'manager' || this.currentStatus === 'approver'){
      this.maxStep=4;
    }
    if (this.currentStatus === 'hr') {
      this.maxStep=5;
    }
  }


  changeTable(tab: string, stepNumber: number) {
    this.tables[this.currentTable].selected = false;
    this.currentTable = tab;
    this.currentStep = stepNumber;
    console.log(this.currentStep)
    this.tables[this.currentTable].selected = true;
  }

  onCancel() {
  }

  onSubmit(){
  }

  onNext(){
    let currentStep;
    if (this.currentStep == 1) {
      this.objectiveComp.submitData();
      // currentStep = 2;
      // this.changeTable('self',currentStep)
    }else if(this.currentStep == 2) {
      this.selfComp.submitData();

    }else if(this.currentStep == 3){
      this.valuesComp.submitData();
      currentStep = 4;
      this.changeTable('manager',currentStep)
    }else if(this.currentStep == 4){
     this.managerComp.submitData();
      if(this.currentStatus == 'manager' || this.currentStatus == 'approver'){
        this.submitManager();
      }else{
        currentStep = 5;
        this.changeTable('hr',currentStep)
      }

    }else if(this.currentStep == 5){
      this.hrComp.submitData();
    }


  }

  onBack(){
    let currentStep;
    if (this.currentStep == 2) {
      currentStep = 1;
      this.changeTable('objective',currentStep)
    }else if(this.currentStep == 3) {
      currentStep = 2;
      this.changeTable('self',currentStep)
    }else if(this.currentStep == 4){
      currentStep = 3;
      this.changeTable('values',currentStep)
    }else if(this.currentStep == 5){
      currentStep = 4;
      this.changeTable('manager',currentStep)
    }
  }

  cancel(){
    this.modalService.hide();
  }

  onDropdownOpen(): void {
    this.isOpenRemark.fill(true);
  }

  onToggle(index: number): void {
    this.isOpenRemark[index] = !this.isOpenRemark[index];
  }

  onChildDataSubmitted(data: any,item:any) {
    let currentStep;
    if(item == 'objective'){
      this.objectiveSet = data;
      if(this.objectiveSet.length > 0){
        currentStep = 2;
        this.changeTable('self',currentStep)
      }
    }else if(item == 'self'){
      this.selfAssessment = data;
      if(this.selfAssessment.length > 0){
        if(this.currentStatus == 'employee'){
          this.submitEmployee();
        }
          currentStep = 3;
          this.changeTable('values',currentStep)
      }
    }else if(item == 'values'){
      this.valuesData = data;
    }else if(item == 'manager'){
      this.managerData = data;
    }else if(item == 'hr'){
      this.hrData = data;
      console.log('Received data from hr:', data);
      this.submitHr();
    }


  }


  submitEmployee() {
    console.log(this.objectiveSet);
    console.log(this.selfAssessment);

    let processedObjectives = this.objectiveSet.map((obj: any ) => {
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
        targetText: escapeText(obj.targetText),
        performanceText: escapeText(obj.performanceText),
        weightage: escapeText(obj.weightage),
        keyObjective: escapeText(obj.keyObjective),
        keyTarget: escapeText(obj.keyTarget),
        selectedRating: escapeText(obj.selectedRating),
        achievedText: escapeText(obj.achievedText),
        achievedInt: escapeText(obj.achievedInt),
      };
      return item;
    });

    let obj: any = {
      userIdKPI: this.userData.user_id,
      year: this.userData.year,
      objectiveData: JSON.stringify(processedObjectives),
      selfData: JSON.stringify(this.selfAssessment),
      pid: this.userData.id,
      param: 'employee_evaluation_insert_data'
    };

    this.kpi.evaluationDataInsert(obj).subscribe({
      next: (response: any) => {
        console.log('KPI saved successfully:', response);
        this.saveEmitter.next(true);
        this.cancel();
      },
      error: (error: any) => {
        console.error('Error saving KPI:', error);
        this.cancel();
      }
    });

  }

  submitManager() {
    console.log(this.objectiveSet);
    console.log(this.selfAssessment);
    console.log(this.valuesData);
    console.log(this.managerData);

    let processedObjectives = this.objectiveSet.map((obj: any ) => {
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
        targetText: escapeText(obj.targetText),
        performanceText: escapeText(obj.performanceText),
        weightage: escapeText(obj.weightage),
        keyObjective: escapeText(obj.keyObjective),
        keyTarget: escapeText(obj.keyTarget),
        selectedRating: escapeText(obj.selectedRating),
        achievedText: escapeText(obj.achievedText),
        achievedInt: escapeText(obj.achievedInt),
      };
      return item;
    });

    let obj: any = {
      userIdKPI: this.userData.user_id,
      year: this.userData.year,
      objectiveData: JSON.stringify(processedObjectives),
      selfData: JSON.stringify(this.selfAssessment),
      valuesData: JSON.stringify(this.valuesData),
      managerData: JSON.stringify(this.managerData),
      pid: this.userData.id,
      objectId:this.userId,
      param: 'manager_evaluation_insert_data'
    };

    this.kpi.evaluationDataInsert(obj).subscribe({
      next: (response: any) => {
        console.log('KPI saved successfully:', response);
        this.saveEmitter.next(true);
        this.cancel();
      },
      error: (error: any) => {
        console.error('Error saving KPI:', error);
        this.cancel();
      }
    });
  }


  submitHr() {
    console.log(this.objectiveSet);
    console.log(this.selfAssessment);
    console.log(this.valuesData);
    console.log(this.managerData);
    console.log(this.hrData);

    let processedObjectives = this.objectiveSet.map((obj: any ) => {
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
        targetText: escapeText(obj.targetText),
        performanceText: escapeText(obj.performanceText),
        weightage: escapeText(obj.weightage),
        keyObjective: escapeText(obj.keyObjective),
        keyTarget: escapeText(obj.keyTarget),
        selectedRating: escapeText(obj.selectedRating),
        achievedText: escapeText(obj.achievedText),
        achievedInt: escapeText(obj.achievedInt),
      };
      return item;
    });

    let obj: any = {
      userIdKPI: this.userData.user_id,
      year: this.userData.year,
      objectiveData: JSON.stringify(processedObjectives),
      selfData: JSON.stringify(this.selfAssessment),
      valuesData: JSON.stringify(this.valuesData),
      managerData: JSON.stringify(this.managerData),
      hrData: JSON.stringify(this.hrData),
      pid: this.userData.id,
      objectId:this.userId,
      param: 'hr_evaluation_insert_data'
    };

    this.kpi.evaluationDataInsert(obj).subscribe({
      next: (response: any) => {
        console.log('KPI saved successfully:', response);
        this.saveEmitter.next(true);
        this.cancel();
      },
      error: (error: any) => {
        console.error('Error saving KPI:', error);
        this.cancel();
      }
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-md'
    });
  }

  revert() {

    let requestPayload: any = {
      userIdKPI: this.userId,
      year: this.year,
      param: "revert_kpi_evaluation_data",
      objectId: this.kpiId ,
      remarks:this.remark
    };


    this.kpi.revertKpi(requestPayload).subscribe({
      next: (response) => {
        console.log('KPI saved successfully:', response);
        alert('KPI data submitted successfully!');
        this.cancel();
      },
      error: (error) => {
        console.error('Error saving KPI:', error);
        alert('Something went wrong while saving KPI.');
      }
    });
  }



}
