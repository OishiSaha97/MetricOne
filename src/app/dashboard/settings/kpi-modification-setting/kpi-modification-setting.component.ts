import { Component } from '@angular/core';
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {BsModalRef} from "ngx-bootstrap/modal";
import {CommonServiceService} from "../../common-service.service";
import {CookiesService} from "../../cookies.service";

@Component({
  selector: 'app-kpi-modification-setting',
  templateUrl: './kpi-modification-setting.component.html',
  styleUrls: ['./kpi-modification-setting.component.css']
})
export class KpiModificationSettingComponent {
  bsConfig?: Partial<BsDatepickerConfig>;
  today: any;
  selectedDate: string | null = null;
  totalEmloyee: any;
  userId:any;
  isOpen: boolean = false;
  isOpenNew: boolean = false;
  selectedFor: any;
  searchFor: any;
  modificationForList = [
    { id: 1, name: 'All Employees' },
    { id: 2, name: 'Teams' },
    { id: 3, name: 'Individuals' }
  ];
  filterModificationForList: any=[];
  modificationFor: any;
  teams: any;
  filterTeams: any;
  selectedTeams: any[] = [];
  selectedIndividuals: any[] = [];

  searchTeam: any;
   individuals: any;
   filterIndividuals: any;
  userName: any;

  constructor(public bsModalRef: BsModalRef,
              private kpi: CommonServiceService,
              public cookieService: CookiesService) {}
  ngOnInit() {
    this.userId = this.cookieService.getCookie('username');
    this.userName = this.cookieService.getCookie('fullName');
    this.today = new Date();
    this.bsConfig = {
      adaptivePosition: false,
      containerClass: 'theme-default bs-datepicker-top',
      dateInputFormat: 'DD MMM YYYY',
      showWeekNumbers: false
    };

    this.totalEmloyee = 250;

    this.filterModificationForList = [...this.modificationForList];

  }



  closePopup() {

  }

  selectOption(option: any) {
    this.selectedFor = option;
    console.log("this.selectedFor.name ", this.selectedFor.name)
    if(this.selectedFor.name === "Teams"){
      this.getTeams();
    }
    else if(this.selectedFor.name === "Individuals"){
      this.getUsers();
    }
    this.isOpen = false;
  }
  selectTeams(option: any) {
    if (this.selectedFor?.name === 'Individuals') {
      const index = this.selectedIndividuals.findIndex(i => i.id === option.id);
      if (index > -1) {
        this.selectedIndividuals.splice(index, 1);
      } else {
        this.selectedIndividuals.push(option);
      }
    } else {
      const index = this.selectedTeams.findIndex(t => t.id === option.id);
      if (index > -1) {
        this.selectedTeams.splice(index, 1);
      } else {
        this.selectedTeams.push(option);
      }
    }

    this.isOpenNew=false;
  }

  isSelected(option: any): boolean {
    if (this.selectedFor?.name === 'Individuals') {
      return this.selectedIndividuals.some(i => i.username === option.username);
    } else {
      return this.selectedTeams.some(t => t.name === option.name);
    }
  }




  onDateSelect() {

  }

  getTeams() {
    this.kpi.getLogData({param: 'getTeams',userIdKPI:this.userId})
      .subscribe(res => {
          this.teams = res?.['getTeams'];
          this.filterTeams = res?.['getTeams'];
        }, error => {
          // this.alerts.closeAlert();
          // this.alerts.toast('error', 'Unable to fetch incident Category List.  Please try again. If the problem persists then please contact our Support Team')
        }
      );
  }

  filterTeam() {
    if (this.searchTeam.trim()) {
      this.filterTeams = this.teams.filter((apr: any) =>
        apr.name.toLowerCase().includes(this.searchTeam.toLowerCase())
      );
    } else {
      this.filterTeams = [...this.teams];
    }
  }

   getUsers() {
    this.kpi.getLogData({param: 'user-name-list',userIdKPI:this.userId})
      .subscribe(res => {
          this.individuals = res?.['user-name-list'];
          this.filterIndividuals = res?.['user-name-list'];
        }, error => {
          // this.alerts.closeAlert();
          // this.alerts.toast('error', 'Unable to fetch incident Category List.  Please try again. If the problem persists then please contact our Support Team')
        }
      );
  }

  filterIndividual() {
    if (this.searchTeam.trim()) {
      this.filterIndividuals = this.individuals.filter((apr: any) =>
        apr.full_name.toLowerCase().includes(this.searchTeam.toLowerCase())
      );
    } else {
      this.filterIndividuals = [...this.individuals];
    }
  }

  onActive() {
    const formattedDate = this.selectedDate || '';
    let modifyFor: any;
    if(this.selectedFor.name === "Teams"){
      modifyFor = this.selectedTeams?.map(t => t.name) || [];
    }
    else if(this.selectedFor.name === "Individuals"){
      modifyFor = this.selectedIndividuals?.map(u => u.username) || [];
    }
    else{
      modifyFor = ['all'];
    }
    const formData = new FormData();

    formData.append('userKpiId', this.userId);
    formData.append('selectedFor', this.selectedFor?.name);
    formData.append('modifyFor',  JSON.stringify(modifyFor));
    formData.append('date', formattedDate);

    console.log('Submitting EndDate:', formData);

    this.kpi.saveModifiedData(formData).subscribe({
      next: (response) => {
        // this.finalApproverSelected.emit({'username': approverId, 'full_name': name});


      },
      error: (error) => {

      }
    });
  }
}
