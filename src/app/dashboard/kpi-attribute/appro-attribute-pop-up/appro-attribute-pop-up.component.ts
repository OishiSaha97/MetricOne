import {Component, EventEmitter} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../common-service.service";

@Component({
  selector: 'app-appro-attribute-pop-up',
  templateUrl: './appro-attribute-pop-up.component.html',
  styleUrls: ['./appro-attribute-pop-up.component.css']
})
export class ApproAttributePopUpComponent {
  userId:any;
  selectedAttribute:any;
  dropdownOpen = false;
  selectedKpiType = '';
  mode:any = '';
  kpiType = ['KPI Objective', 'KPI Values', 'KPI HR'];
  attributeName: any = '';
  resData: any;
  constructor(public modalRef: BsModalRef,
              private modalService: BsModalService,
              private kpi: CommonServiceService) {}
  ngOnInit(): void {

    this.userId = localStorage.getItem('username');
    console.log("selectedAttribute :", this.selectedAttribute);
    if(this.mode=== 'edit'){
      this.getData();
    }

  }
  getData(){
    this.kpi.getLogData({param: 'getPrevAttribute', userIdKPI: this.userId, pid:this.selectedAttribute.id})
      .subscribe(res => {
        this.resData = res?.['getPrevAttribute'] || [];
        if(this.resData && this.resData.length>0){
          this.attributeName = this.resData[0]?.attributeName || '';
          this.selectedKpiType = this.resData[0]?.selectedKpiType || '';
        }
      });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(type: string, event: Event) {
    this.selectedKpiType = type;
    this.dropdownOpen = false;
    event.stopPropagation();
  }
  requestEmitter: EventEmitter<any> = new EventEmitter<any>();
  save() {

    const formData = new FormData();

    formData.append('userId', this.userId);
    formData.append('attributeName', this.attributeName);
    formData.append('selectedKpiType', this.selectedKpiType);

    this.kpi.saveKPIAttribute(formData).subscribe({
      next: (response) => {
        this.modalRef.hide();
        this.requestEmitter.emit(true);

      },
      error: (error) => {

      }
    });


  }

  closePopup() {
    this.modalRef.hide();
  }

}
