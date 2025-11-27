import {Component, TemplateRef, ViewChild} from '@angular/core';
import {ObjectiveSetComponent} from "./objective-set/objective-set.component";
import {SelfAssessmentComponent} from "./self-assessment/self-assessment.component";
import {ManagerInsightComponent} from "./manager-insight/manager-insight.component";
import { ValuesComponentComponent } from './values-component/values-component.component';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../common-service.service";
import {HrModalComponent} from "./hr-modal/hr-modal.component";
import {Subject} from "rxjs";
declare var $: any;


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
  view:any='';
  isBack1:any=false;
  isBack2:any=false;
  isBack3:any=false;
  isBack4:any=false;
  isBack5:any=false;
  onNext1:any=false;
  onNext3:any=false;
  kpiUserId:any;
  status: any;
  team: any;
  name: any;
  year: any;
  kpiId: any;

  isOpenRemark: boolean[] = [];


  currentStatus:any='';
  rateOverall:any = '';
  objectiveSet:any = [];
  selfAssessment:any = [];
  valuesData:any = [];
  managerData:any = [];
  hrData:any = [];
  userId:any;
  userName:any;

  managerBackData: any = null;


  @ViewChild(ObjectiveSetComponent) objectiveComp!: ObjectiveSetComponent;
  @ViewChild(SelfAssessmentComponent) selfComp!: SelfAssessmentComponent;
  @ViewChild(ValuesComponentComponent) valuesComp!: ValuesComponentComponent;
  @ViewChild(ManagerInsightComponent) managerComp!: ManagerInsightComponent;
  @ViewChild(HrModalComponent) hrComp!: HrModalComponent;
  role: any = '';
  timePeriod:any = '';
  saveEmitter = new Subject<any>();

  constructor(public modalRef: BsModalRef,
              public revertModalRef: BsModalRef,
              public modalRefConfirma: BsModalRef,
              public modalRefForward: BsModalRef,
              public modalRefPublish: BsModalRef,
              public modalRefDirectPublish: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }
  maxStep:any=3;
  managerName: any;



  ngOnInit(){
    this.maxStepData();
    this.currentTable = 'objective';
    this.userId = localStorage.getItem('username');
    this.userName = localStorage.getItem('fullName');
    this.role = localStorage.getItem('role');
    this.timePeriod = localStorage.getItem('timePeriod');
    this.kpiId = this.userData.id;
    console.log("Role:", this.role);
    console.log("user:", this.userData);
    this.getManagerName();
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
    this.tables[this.currentTable].selected = true;
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

      // currentStep = 4;
      // this.changeTable('manager',currentStep)
    }else if(this.currentStep == 4){
     this.managerComp.submitData();
      if(this.currentStatus == 'manager' || this.currentStatus == 'approver'){
        if(this.managerData && this.managerData.length > 0){
          this.openForwardConfirmation(this.confirmationForward)
          //this.submitManager();
        }
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
      this.selfComp.onNext();
      this.isBack1=true;
      this.changeTable('objective',currentStep)
    }else if(this.currentStep == 3) {
      currentStep = 2;
      this.isBack2 =true;
      this.changeTable('self',currentStep)
    }else if(this.currentStep == 4){
      currentStep = 3;
      this.isBack3 =true;
      this.managerComp.onNext();
      this.changeTable('values',currentStep)
    }else if(this.currentStep == 5){
      currentStep = 4;
      this.isBack4 =true;
      this.changeTable('manager',currentStep)
    }
  }

  onChildBackDataSubmitted(data: any,item:any) {
    let currentStep;
    if(item == 'objective'){
      this.objectiveSet = data;
      if(this.objectiveSet?.objectives?.length > 0 || this.objectiveSet?.length > 0){
        currentStep = 2;
        this.changeTable('self',currentStep)
      }
    }else if(item == 'self'){
      this.onNext1 = true;
      this.selfAssessment = data;

    }else if(item == 'values'){
      this.valuesData = data;
      console.log("Received data from values:", this.valuesData);
      currentStep = 4;
      this.changeTable('manager',currentStep);
    }else if(item == 'manager'){
      this.onNext3 = true;
      this.managerData = data;
    }else if(item == 'hr'){
      this.hrData = data;
      console.log('Received data from hr:', data);
      this.openPublishConfirmation(this.confirmationPublish);
      // this.submitHr();
    }

  }

  onModalOff(){
    this.modalRefConfirma.hide();
    this.modalRefPublish.hide();
    this.modalRefDirectPublish.hide();
    this.modalRefForward.hide();
    this.revertModalRef.hide();
  }

  cancel(){
    this.modalService.hide();
  }


  onToggle(index: number): void {
    this.isOpenRemark[index] = !this.isOpenRemark[index];
  }

  onChildDataSubmitted(data: any,item:any) {
    let currentStep;
    if(item == 'objective'){
      this.objectiveSet = data;
      if(this.objectiveSet?.objectives?.length > 0 || this.objectiveSet?.length > 0){
        currentStep = 2;
        this.changeTable('self',currentStep)
      }
    }else if(item == 'self'){
      this.selfAssessment = data;
      if(this.selfAssessment.length > 0){
        if(this.currentStatus == 'employee'){
          this.openConfirmation(this.confirmation);
          return;
          // this.submitEmployee();
        }
          currentStep = 3;
          this.changeTable('values',currentStep)
      }
    }else if(item == 'values'){
      this.valuesData = data;
      console.log("Received data from values:", this.valuesData);
        currentStep = 4;
        this.changeTable('manager',currentStep);
    }else if(item == 'manager'){
      this.managerData = data;
    }else if(item == 'hr'){
      this.hrData = data;
      console.log('Received data from hr:', data);
      this.openPublishConfirmation(this.confirmationPublish);
      // this.submitHr();
    }


  }

  @ViewChild('confirmation') confirmation!: TemplateRef<any>;

  openConfirmation(template: TemplateRef<any>) {
    this.modalRefConfirma = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-dialog-centered'
    });
  }


  submitEmployee(type:any) {
    let objectiveData;
    if(this.objectiveSet?.objectives){
      objectiveData = this.objectiveSet?.objectives;
    }else {
      objectiveData = this.objectiveSet;
    }

    let processedObjectives = objectiveData.map((obj: any ) => {
      const escapeText = (text: string | undefined) => {
        return text;

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
        keyAchieved: escapeText(obj.keyAchieved),
        keyPerformance: escapeText(obj.keyPerformance),
        selectedRating: escapeText(obj.rating),
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
        this.saveEmitter.next({ action:'submit'});
        this.cancel();
      },
      error: (error: any) => {
        console.error('Error saving KPI:', error);
        this.cancel();
      }
    });

  }

  submitManager(type:any) {
    let objectiveData;
    if(this.objectiveSet?.objectives){
      objectiveData = this.objectiveSet?.objectives;
    }else {
      objectiveData = this.objectiveSet;
    }

    let processedObjectives = objectiveData.map((obj: any ) => {
      const escapeText = (text: string | undefined) => {
        return text;
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
        keyAchieved: escapeText(obj.keyAchieved),
        keyPerformance: escapeText(obj.keyPerformance),
        selectedRating: escapeText(obj.rating),
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
      otherParam:this.rateOverall,
      param: 'manager_evaluation_insert_data'
    };

    this.kpi.evaluationDataInsert(obj).subscribe({
      next: (response: any) => {
        console.log('KPI saved successfully:', response);
        this.saveEmitter.next({ action:'forward'});
        this.cancel();
      },
      error: (error: any) => {
        console.error('Error saving KPI:', error);
        this.cancel();
      }
    });
  }


  submitHr(type:any) {

    let objectiveData;
    if(this.objectiveSet?.objectives){
      objectiveData = this.objectiveSet?.objectives;
    }else {
      objectiveData = this.objectiveSet;
    }

    let processedObjectives = objectiveData.map((obj: any ) => {
      const escapeText = (text: string | undefined) => {
        return text;
          // ? text
          //   .replace(/\r/g, '\\r')
          //   .replace(/\n/g, '\\n')
          //   .replace(/\t/g, '\\t')
          // : '';
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
        keyAchieved: escapeText(obj.keyAchieved),
        keyPerformance: escapeText(obj.keyPerformance),
        selectedRating: escapeText(obj.rating),
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
        this.saveEmitter.next({ action:'publish'});
        this.cancel();
      },
      error: (error: any) => {
        console.error('Error saving KPI:', error);
        this.cancel();
      }
    });
  }

  openModal(template: TemplateRef<any>) {
    this.revertModalRef = this.modalService.show(template, {
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
        // alert('KPI data submitted successfully!');
        this.saveEmitter.next({ action:'revert'});
        this.cancel();
      },
      error: (error) => {
        console.error('Error saving KPI:', error);
        alert('Something went wrong while saving KPI.');
      }
    });
  }


  onClickRate(event: any) {
    this.rateOverall = event;
  }


  openRemarks(event: MouseEvent) {
    event.stopPropagation();
    this.kpi.getLogData({
      param: 'reverted_remark_list',
      userIdKPI: this.userId,
      parameter:this.timePeriod,
      extraParam:this.userData.id

    }).subscribe(res => {
      this.remarkList = res?.['reverted_remark_list'] || [];
    });
  }

  setData(){
    if(this.currentStep==1){
      this.objectiveComp?.submitDraftData();
    }else{
      this.selfComp?.submitDataDraft();
    }
  }


  draft() {
    let objectiveData;
    if(this.objectiveSet?.objectives){
      objectiveData = this.objectiveSet?.objectives;
    }else {
      objectiveData = this.objectiveSet;
    }

    let processedObjectives = objectiveData.map((obj: any ) => {
      const escapeText = (text: string | undefined) => {
        return text;

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
        selectedRating: escapeText(obj.rating),
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
      param: 'employee_evaluation_draft_data'
    };

    this.kpi.evaluationDataInsert(obj).subscribe({
      next: (response: any) => {
        console.log('KPI saved successfully:', response);
        this.saveEmitter.next({ action:'draft'});
        this.cancel();
      },
      error: (error: any) => {
        console.error('Error saving KPI:', error);
        this.cancel();
      }
    });
  }

   getManagerName() {
     console.log("Getting manager name ",this.userData.team )
     this.kpi.getLogData({
       param: 'get_manager_name',
       extraParam:this.userData.team

     }).subscribe(res => {
       this.managerName = res?.['get_manager_name'][0].managerName || [];
     });

  }

  closeModal() {
    this.revertModalRef.hide();
  }

  onChildDataSubmittedDraft(data: any,item:any) {
    if (item == 'objective') {
      this.objectiveSet = data;
      this.draft();
    } else if (item == 'self') {
      this.selfAssessment = data;
      this.draft();
    }
  }

  @ViewChild('confirmationForward') confirmationForward!: TemplateRef<any>;
  openForwardConfirmation(template: TemplateRef<any>){
    this.modalRefForward = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-md'
    });
  }

  @ViewChild('confirmationPublish') confirmationPublish!: TemplateRef<any>;
  openPublishConfirmation(template: TemplateRef<any>){
    this.modalRefPublish = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-md'
    });
  }

  // openDirectPublishConfirmation(template: TemplateRef<any>){
  //   this.modalRefDirectPublish = this.modalService.show(template, {
  //     backdrop: 'static',
  //     keyboard: false,
  //     class: 'modal-md'
  //   });
  // }


  closeConfirmModal() {
    if (this.modalRefConfirma) {
      this.modalRefConfirma.hide();
    }
  }

  closePublishModal() {
    if (this.modalRefPublish) {
      this.modalRefPublish.hide();
    }
  }

  closeDirectPublishModal() {
    if (this.modalRefDirectPublish) {
      this.modalRefDirectPublish.hide();
    }
  }

  closeForwardModal(){
    if (this.modalRefForward) {
      this.modalRefForward.hide();
    }
  }


}
