import {Component, Inject, Input, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../common-service.service";
import {DOCUMENT} from "@angular/common";

declare var $: any;
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  currentStage = 0;
  selectedDate: string | null = null;
  selectedDateEva: string | null = null;
  userId:any;
  stages = ['KPI Initiation', 'KPI Modification', 'KPI Evaluation'];
  tables = {
    initiation: {
      selected: true
    },
    modification: {
      selected: false
    },
    evaluation: {
      selected: false
    },
  };
  currentTable: keyof SettingsComponent['tables'] = 'initiation';
  tab: any;
  resData: any;
  showProceedButton: boolean = false;
   mode: any;
   isInitCrossed: boolean = false;
   showEvaluation: boolean = false;
  constructor(public bsModalRef: BsModalRef,
              private modalServ: BsModalService,
              private kpi: CommonServiceService) {}
  ngOnInit(){
    this.userId = localStorage.getItem('username');
    this.currentTable = 'initiation';
    this.tab='initiation';

    this.tables[this.currentTable].selected = true;
    this.checkEndDate();
    this.checkInitiationDate();
  }
  checkInitiationDate() {
    this.kpi.getLogData({ param: 'initiationCheck', userIdKPI: this.userId })
      .subscribe(res => {
        this.isInitCrossed = res?.['initiationCheck'][0].deadline_crossed;
        if(this.isInitCrossed){
          this.showEvaluation = true;
        }
      });
  }

  checkEndDate() {
    this.kpi.getLogData({ param: 'KPIendDate', userIdKPI: this.userId })
      .subscribe(res => {
        this.resData = res?.['KPIendDate'][0] || [];

        this.selectedDate = this.formatDateForInput(this.resData.kpi_last_date);

      });
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  changeTable(table: any){

    this.tables[this.currentTable].selected = false;

    this.currentTable = table;
    if(this.currentTable=='initiation'){
      this.tab='initiation';
    }
    else if(this.currentTable=='evaluation'){
      this.tab='evaluation';
    }
    else{
      this.tab='modification';
    }

    this.tables[this.currentTable].selected = true;
    this.updateTemplate();

  }

   updateTemplate() {

  }

  closePopup() {
    this.bsModalRef.hide();

  }

  onSubmit() {

  }

  getProceedButton($event: any) {
    this.showProceedButton = $event;
  }

  onActive() {
    const formattedDate =  this.selectedDate || '';
    const formData = new FormData();

    formData.append('userId', this.userId);
    formData.append('date', formattedDate);
    formData.append('forDate', 'initiation');

    console.log('Submitting EndDate:', formData);
    this.kpi.saveEndDate(formData).subscribe({
      next: (response) => {
        // this.finalApproverSelected.emit({'username': approverId, 'full_name': name});
        if (this.modalRef) {
          this.modalRef.hide();
        }
        this.bsModalRef.hide();

      },
      error: (error) => {

      }
    });
  }
  onActiveEva() {
    const formattedDate = this.selectedDateEva || '';
    const formData = new FormData();

    formData.append('userId', this.userId);
    formData.append('date', formattedDate.toString());
    formData.append('forDate', 'evaluation');

    console.log('Submitting EndDate:', formData);
    this.kpi.saveEvaEndDate(formData).subscribe({
      next: (response) => {
        // this.finalApproverSelected.emit({'username': approverId, 'full_name': name});
        if (this.modalRef) {
          this.modalRef.hide();
        }
        this.bsModalRef.hide();

      },
      error: (error) => {

      }
    });
  }

  getSelectedEndDate($event: any) {
    if(this.tab === 'evaluation'){
      this.selectedDateEva = $event;
    }
    else{
      this.selectedDate = $event;
    }
  }
  modalRef?: BsModalRef;
  statusAction(template: TemplateRef<any>) {


    this.modalRef = this.modalServ.show(template, {
      backdrop: true,
      keyboard: false,
      class: 'modal-dialog modal-dialog-centered modal-max-smaller confirm-modal',
    } );
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }


}
