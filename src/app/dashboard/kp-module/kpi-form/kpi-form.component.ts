
import {NgModule, Component, OnInit, TemplateRef, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {CommonServiceService} from "../../common-service.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Subject} from "rxjs";
import {Toast} from "primeng/toast";

declare var $: any;

interface Objective {
  id: number;
  title: string;
  selectedType: string;
  objectiveText: string;
  targetText: string;
  performanceText: string;
  weightage: string;
  isOpen: boolean;
  keyObjective?: string;
  keyTarget?: string;
  keyPerformance?: string;
}

@Component({
  selector: 'app-kpi-form',
  templateUrl: './kpi-form.component.html',
  styleUrls: ['./kpi-form.component.css']
})
export class KpiFormComponent implements OnInit {
  filterObjectiveTypes: any[]=[];
  currentIndex : any;
  selectedIndexForDelete: any;

  constructor(public modalRef: BsModalRef,
              public modalRefRemark: BsModalRef,
              public modalServ: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {
  }

  requestEmitter: EventEmitter<any> = new EventEmitter<any>();
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
  data: any = [];
  check_kpi: any = [];
  changedHistory: any = [];
  changedObjHistory: any = [];
  attributeType: any = [];
  changedTargetHistory: any = [];
  changedPerformanceHistory: any = [];
  year:string='2025';
  userName:any;
  userId:any;
  mode:any
  team:any;
  kpiUserId:any;
  kpiId:any='';
  saveEmitter = new Subject<any>();
  approvalStatus:any;
  currentStatus:any='';
  name:any='';
  view:any='';
  showObjectiveHistoryIndex: number | null = null;
  remark: string = '';
  searchType: any;

  ngOnInit(): void {
    for (let i = 1; i <= 3; i++) {
      this.addObjective();
    }
    this.getAttribute();
    this.userName = localStorage.getItem('fullName');
    this.userId = localStorage.getItem('username');
      if(this.approvalStatus == 'Reverted' ){
        this.getData();
      }
      if(this.mode == 'approver' || this.view == false || this.view == true){
        this.kpi.getLogData({userIdKPI:this.userId,param: 'kpi-list',objectId:this.kpiUserId,parameter:this.team,pid:this.year})
          .subscribe(res => {
              this.data = Array.isArray(res?.['kpi-list']) ? res?.['kpi-list'] : res?.['kpi-list']
              console.log(this.data);
              this.objectives = this.data.map((item:any, index:any) => ({
                id: item.id,
                workId: item.work_id,
                title: `Work Objective ${index + 1}`,
                selectedType: item.category_name,
                objectiveText: item.objective,
                targetText: item.target,
                performanceText: item.performance,
                weightage: item.weightage,
                isOpen: false
              }));
            },
            (error) => {
              console.error("Error fetching permission list", error);
            }
          );

        this.kpi.getLogData({userIdKPI:this.userId,param: 'changed-history',objectId:this.kpiUserId,parameter:this.team,pid:this.year,extraParam:this.kpiId})
          .subscribe(res => {

              this.changedHistory = Array.isArray(res?.['changed-history']) ? res?.['changed-history'] : res?.['changed-history']
              console.log(this.changedHistory);
            },
            (error) => {
              console.error("Error fetching permission list", error);
            }
          );
      }
    this.filterObjectiveTypes = [...this.objectiveTypes];
    console.log(this.currentStatus)
  }


  addObjective(): void {
    const newObjective: Objective = {
      id: this.objectives.length + 1,
      title: `Work Objective ${this.objectives.length + 1}`,
      selectedType: '',
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

    // this.filterObjectiveTypes = this.filterObjectiveTypes.filter(
    //   (t: any) => t.name !== obj.selectedType
    // );
    // this.filterTypes();
  }
  selectedTypes: string[] = [];
  @ViewChild('errorToast', { static: false }) errorToast!: ElementRef;
  toastMessage: string = '';

  isOpen: boolean[] = [];

  objectiveErrors: { [key: number]:
      {
          selectedType?: string;
          objectiveText?: string;
          targetText?: string;
          performanceText?: string;
          keyObjectiveText?:string;
          keyPerformanceText?:string;
          keyTargetText?:string;
          weightage?: string
      } } = {};


  showToast(msg: string) {
    this.toastMessage = msg;

    // Show toast after 20 sec
    setTimeout(() => {
      const el = this.errorToast.nativeElement;

      el.classList.add('show');

      // Auto-hide after 3 seconds
      setTimeout(() => {
        el.classList.remove('show');
      }, 1000);

    }, 0);
  }

  validateObjectives(): boolean {
    let totalWeightage = 0;
    this.objectiveErrors = {};

    for (let i = 0; i < this.objectives.length; i++) {
      const obj = this.objectives[i];
      this.objectiveErrors[i] = {};

      if (!obj.selectedType?.trim()) {
        this.objectiveErrors[i].selectedType = '*Type is required';
      }
      if (!obj.objectiveText?.trim()) {
        this.objectiveErrors[i].objectiveText = '*Objective is required';
      }
      if (!obj.targetText?.trim()) {
        this.objectiveErrors[i].targetText = '*Target is required';
      }
      if (!obj.performanceText?.trim()) {
        this.objectiveErrors[i].performanceText = '*Performance Text is required';
      }

      const weight = parseFloat((obj.weightage || '0').toString().trim());

      if(!weight){
        this.objectiveErrors[i].weightage = '*Weightage is required';
      }
      else if (isNaN(weight) || weight <= 0) {
        this.objectiveErrors[i].weightage = '*Weightage must be > 0';
      }
      totalWeightage += weight;
    }

    const typeCount: { [key: string]: number } = {};

    this.objectives.forEach((obj: { selectedType: string; }) => {
      if (obj.selectedType?.trim()) {
        const type = obj.selectedType.trim();
        typeCount[type] = (typeCount[type] || 0) + 1;
      }
    });

    Object.keys(typeCount).forEach(typeKey => {
      if (typeCount[typeKey] > 1) {
        this.objectives.forEach((obj:Objective, index:any) => {
          if (obj.selectedType === typeKey) {
            this.objectiveErrors[index].selectedType = '*Duplicate Type is not allowed';
          }
        });
      }
    });

    if (Math.round(totalWeightage) !== 100) {

      this.showToast(`Total weightage must be exactly 100%. Current total: ${totalWeightage}%`);
      return false;
    }

    const hasErrors = Object.values(this.objectiveErrors).some(err => Object.keys(err).length > 0);
    if (hasErrors) {

      this.showToast("Please fill all required fields before submitting!");
      return false;
    }

    return true;
  }



  blockDecimal(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];


    if (allowedKeys.includes(event.key)) return;

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onSubmit(type:any): void {
    if (!this.validateObjectives()) {
      return;
    }

    let processedObjectives = this.objectives.map((obj: Objective) => {

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
        weightage: obj.weightage,
        objectiveText: escapeText(obj.objectiveText),
        performanceText: escapeText(obj.performanceText),
        targetText: escapeText(obj.targetText)
      };

      if (this.mode === 'approver') {
        if (obj.keyObjective?.trim()) {
          item.keyObjective = escapeText(obj.keyObjective.trim());
        }
        if (obj.keyTarget?.trim()) {
          item.keyTarget = escapeText(obj.keyTarget.trim());
        }
        if (obj.keyPerformance?.trim()) {
          item.keyPerformance = escapeText(obj.keyPerformance.trim());
        }
      }

      return item;
    });

    let param: string ='';

    if(this.currentStatus === 'hr'){
      param = 'kpi_initiation_final_approver';
    }
    else if(this.currentStatus === 'employee' ){
      param = 'kpi_insert_data';
    }
    else if (this.currentStatus === 'manager' || this.currentStatus === 'approver') {
      param = 'kpi_update_data_by_approver';
    }

    let obj: any = {
      userIdKPI: this.userId,
      userName: this.userName,
      randomData: JSON.stringify(processedObjectives),
      year: this.year,
      param: param
    };

    if (this.kpiId != '') {
      obj.objectId = this.kpiId;
    }else{
      obj.objectId = '';
    }

    this.kpi.saveKpi(obj).subscribe({
      next: (response) => {

        if(type === 'publish'){
          this.showToast("KPI submitted successfully.");
        }
        else if(type === 'submit' ){
          this.showToast("KPI submitted successfully.");
        }
        else if (type === 'forward') {
          this.showToast("KPI submitted successfully.");
        }

        this.saveEmitter.next(true);
        this.onCancel();
        this.requestEmitter.emit(true);

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

  togglePerformanceEdit(obj: any) {
    obj.isEditingPerformance = !obj.isEditingPerformance;
  }

  onCancel() {
    this.modalRefRemark.hide();
  }


  openPerformanceHistory(obj: any) {
    console.log(obj)
    this.kpi.getLogData({userIdKPI:this.userId,param: 'changed-performance-history',objectId:obj.id,parameter:this.team,pid:this.year,extraParam:obj.workId})
      .subscribe(res => {
          this.changedPerformanceHistory = Array.isArray(res?.['changed-performance-history']) ? res?.['changed-performance-history'] : res?.['changed-performance-history']
          this.openChangedHistory();
        },
        (error) => {
          console.error("Error fetching permission list", error);
        }
      );
  }

  openTargetHistory(obj: any) {
    console.log(obj)
    this.kpi.getLogData({userIdKPI:this.userId,param: 'changed-target-history',objectId:obj.id,parameter:this.team,pid:this.year,extraParam:obj.workId})
      .subscribe(res => {

          this.changedTargetHistory = Array.isArray(res?.['changed-target-history']) ? res?.['changed-target-history'] : res?.['changed-target-history']
          this.openChangedTargetHistory();
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


  getAttribute() {
    this.kpi.getLogData({param: 'attributeType'})
      .subscribe(res => {
          this.attributeType = Array.isArray(res?.['attributeType']) ? res?.['attributeType'] : res?.['attributeType']
          console.log(this.attributeType);
        },
        (error) => {
          console.error("Error fetching permission list", error);
        }
      );
  }

  showHistory = false;
  showTargetHistory = false;
  showObjectiveHistory = false;

  openChangedHistory() {
    this.showHistory = !this.showHistory;
  }

  openChangedTargetHistory() {
    this.showTargetHistory = !this.showTargetHistory;
  }



  openChangedObjectiveHistory(index: number): void {
    if (this.showObjectiveHistoryIndex === index) {
      this.showObjectiveHistoryIndex = null;
    } else {
      this.showObjectiveHistoryIndex = index;
    }
  }

  onRevert() {
    if (!this.validateObjectives()) {
      return;
    }

    const escapeText = (text: string | undefined) => {
      return text
        ? text
          .replace(/\r/g, '\\r')
          .replace(/\n/g, '\\n')
          .replace(/\t/g, '\\t')
        : '';
    };

    let processedObjectives = this.objectives.map((obj: Objective) => {
      let item: any = {
        title: obj.title,
        selectedType: obj.selectedType,
        objectiveText: escapeText(obj.objectiveText),
        targetText: escapeText(obj.targetText)
      };
      return item;
    });

    let requestPayload: any = {
      userIdKPI: this.userId,
      userName: this.userName,
      randomData: JSON.stringify(processedObjectives),
      year: this.year,
      param: "revert_kpi_update_data",
      objectId: this.mode === 'approver' ? this.kpiId : '',
      remarks:this.remark
    };


    this.kpi.revertKpi(requestPayload).subscribe({
      next: (response) => {
        this.showToast("KPI reverted successfully.");
        this.onCancel();
        this.onClose();
      },
      error: (error) => {
        console.error('Error saving KPI:', error);
        alert('Something went wrong while saving KPI.');
      }
    });
  }


  openModal(template: TemplateRef<any>) {
      this.modalRefRemark = this.modalService.show(template, {
        backdrop: 'static',
        keyboard: false,
        class: 'modal-md'
      });
    }

  onClose(): void {
    this.modalRef?.hide();
  }

   getData() {
     this.kpi.getLogData({userIdKPI:this.userId,param: 'kpi-reverted-list',extraParam:this.kpiId,objectId:this.kpiUserId,parameter:this.team,pid:this.year})
       .subscribe(res => {
           this.data = Array.isArray(res?.['kpi-reverted-list']) ? res?.['kpi-reverted-list'] : res?.['kpi-reverted-list']
           console.log(this.data);
           this.objectives = this.data.map((item:any, index:any) => ({
             id: item.id,
             workId: item.work_id,
             title: `Work Objective ${index + 1}`,
             selectedType: item.category_name,
             objectiveText: item.objective,
             targetText: item.target,
             performanceText: item.performance,
             weightage: item.weightage,
             isOpen: false
           }));
         },
         (error) => {
           console.error("Error fetching permission list", error);
         }
       );
  }

  filterTypes() {
    if (this.searchType.trim()) {
      this.filterObjectiveTypes = this.objectiveTypes.filter((apr: any) =>
        apr.name.toLowerCase().includes(this.searchType.toLowerCase())
      );
    } else {
      this.filterObjectiveTypes = [...this.objectiveTypes];
    }
    // this.filterObjectiveTypes = this.objectiveTypes.filter((apr: any) =>
    //   // Type obj explicitly as Objective
    //   !this.objectives.some((obj: Objective) => obj.selectedType === apr.name) &&
    //   apr.name.toLowerCase().includes(search)
    // );
  }

  deleteObjective(index: number) {
    this.objectives.splice(index, 1);
    this.recalculateObjectiveTitles();
    this.modalServ.hide();
  }

  recalculateObjectiveTitles() {
    this.objectives = this.objectives.map((obj: any, i: number) => {
      return {
        ...obj,
        title: `Work Objective ${i + 1}`,
        id: i + 1
      };
    });
  }


  actionDelete(template: TemplateRef<any>,i: number) {
    this.selectedIndexForDelete = i;
    this.modalServ = this.modalService.show(template, {
      backdrop: true,
      keyboard: false,
      class: 'modal-dialog modal-dialog-centered modal-max-smaller confirm-modal',

    } );

  }


  closeDeleteModal() {
      if (this.modalServ) {
        this.modalServ.hide();
      }
  }


}
