import {Component, ViewChild} from '@angular/core';
import {ObjectiveSetComponent} from "./objective-set/objective-set.component";
import {SelfAssessmentComponent} from "./self-assessment/self-assessment.component";
import {ManagerInsightComponent} from "./manager-insight/manager-insight.component";
import { ValuesComponentComponent } from './values-component/values-component.component';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../common-service.service";
import {HrModalComponent} from "./hr-modal/hr-modal.component";




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

  isOpenRemark: boolean[] = [];


  currentStatus:any='';
  objectiveSet:any = [];
  selfAssessment:any = [];
  valuesData:any = [];
  managerData:any = [];
  hrData:any = [];



  @ViewChild(ObjectiveSetComponent) objectiveComp!: ObjectiveSetComponent;
  @ViewChild(SelfAssessmentComponent) selfComp!: SelfAssessmentComponent;
  @ViewChild(ValuesComponentComponent) valuesComp!: ValuesComponentComponent;
  @ViewChild(ManagerInsightComponent) managerComp!: ManagerInsightComponent;
  @ViewChild(HrModalComponent) hrComp!: HrModalComponent;

  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }

  ngOnInit(){
    this.maxStep();
    this.currentTable = 'objective';
    console.log('Received user data:', this.userData);
    console.log('Current Status:', this.userData.currentStatus);
  }

  maxStep(): number {
    if (this.currentStatus === 'employee') return 2;
    if (this.currentStatus === 'manager' || this.currentStatus === 'approver') return 4;
    if (this.currentStatus === 'hr') return 5;
    return 2;
  }


  changeTable(tab: string, stepNumber: number) {
    this.tables[this.currentTable].selected = false;
    this.currentTable = tab;
    this.currentStep = stepNumber;
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
      currentStep = 2;
      this.changeTable('self',currentStep)
    }else if(this.currentStep == 2) {
      this.selfComp.submitData();
      if(this.currentStatus == 'employee'){
        this.submitEmployee();
      }else{
        currentStep = 3;
        this.changeTable('values',currentStep)
      }
    }else if(this.currentStep == 3){
      this.valuesComp.submitData();
      currentStep = 4;
      this.changeTable('manager',currentStep)
    }else if(this.currentStep == 4){
     this.managerComp.submitData();
      if(this.currentStatus == 'manager' || this.currentStatus == 'approver'){
        this.submitEmployee();
      }else{
        currentStep = 4;
        this.changeTable('hr',currentStep)
      }

    }else if(this.currentStep == 5){
      this.hrComp.submitData();
      this.submitEmployee();
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

  }

  onDropdownOpen(): void {
    this.isOpenRemark.fill(true);
  }

  onToggle(index: number): void {
    this.isOpenRemark[index] = !this.isOpenRemark[index];

  }

  onChildDataSubmitted(data: any,item:any) {
    if(item == 'objective'){
      this.objectiveSet = data;
      console.log('Received data from objective:', data);
    }else if(item == 'self'){
      this.selfAssessment = data;
      console.log('Received data from self:', data);
    }else if(item == 'values'){
      this.valuesData = data;
      console.log('Received data from value:', data);
    }else if(item == 'manager'){
      this.managerData = data;
      console.log('Received data from manager:', data);
    }else if(item == 'hr'){
      this.hrData = data;
      console.log('Received data from hr:', data);
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
        keyObjective: escapeText(obj.keyObjective),
        keyTarget: escapeText(obj.keyTarget),
      };
      return item;
    });

    let obj: any = {
      userIdKPI: this.userData.user_id,
      year: this.userData.year,
      objectiveData: JSON.stringify(processedObjectives),
      selfAssessment: JSON.stringify(this.selfAssessment),
      pid: this.userData.id,
      param: 'evaluation-employee-data'
    };

    this.kpi.evaluationDataInsert(obj).subscribe({
      next: (response: any) => {
        console.log('KPI saved successfully:', response);
      },
      error: (error: any) => {
        console.error('Error saving KPI:', error);
        this.onCancel();
      }
    });

  }

}
