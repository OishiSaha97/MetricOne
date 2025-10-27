import { Component } from '@angular/core';

@Component({
  selector: 'app-teams-kpi',
  templateUrl: './teams-kpi.component.html',
  styleUrls: ['./teams-kpi.component.css']
})
export class TeamsKPIComponent {
  label="Team’s KPI";
  choosedOption="Initial KPI settings";

  userList = [
    { slNo: 1, year: 2000, employeeName: "Revert", team: "Frontend", employeeId: "E2000", status: "Reverted", designation: "Software Engineer", remarks: "1", action: "" },
    { slNo: 2, year: 2001, employeeName: "Alice", team: "Backend", employeeId: "E2001", status: "Forwarded", designation: "Senior Developer", remarks: "2", action: "" },
    { slNo: 3, year: 2002, employeeName: "Bob", team: "Frontend", employeeId: "E2002", status: "Approved", designation: "Project Manager", remarks: "3", action: "" },
    { slNo: 4, year: 2003, employeeName: "Charlie", team: "QA", employeeId: "E2003", status: "Submitted", designation: "QA Engineer", remarks: "4", action: "" },
    { slNo: 5, year: 2004, employeeName: "David", team: "Design", employeeId: "E2004", status: "Reverted", designation: "UI/UX Designer", remarks: "5", action: "" },
    { slNo: 6, year: 2005, employeeName: "Eva", team: "Infrastructure", employeeId: "E2005", status: "Forwarded", designation: "DevOps Engineer", remarks: "6", action: "" },
    { slNo: 7, year: 2006, employeeName: "Frank", team: "Backend", employeeId: "E2006", status: "Approved", designation: "Software Engineer", remarks: "7", action: "" },
    { slNo: 8, year: 2007, employeeName: "Grace", team: "Frontend", employeeId: "E2007", status: "Submitted", designation: "Senior Developer", remarks: "8", action: "" },
    { slNo: 9, year: 2008, employeeName: "Hannah", team: "QA", employeeId: "E2008", status: "Reverted", designation: "Project Manager", remarks: "9", action: "" },
    { slNo: 10, year: 2009, employeeName: "Ian", team: "Design", employeeId: "E2009", status: "Forwarded", designation: "QA Engineer", remarks: "10", action: "" },
    { slNo: 11, year: 2010, employeeName: "Jack", team: "Frontend", employeeId: "E2010", status: "Approved", designation: "UI/UX Designer", remarks: "11", action: "" },
    { slNo: 12, year: 2011, employeeName: "Kathy", team: "Backend", employeeId: "E2011", status: "Submitted", designation: "DevOps Engineer", remarks: "12", action: "" },
    { slNo: 13, year: 2012, employeeName: "Leo", team: "QA", employeeId: "E2012", status: "Reverted", designation: "Software Engineer", remarks: "13", action: "" },
    { slNo: 14, year: 2013, employeeName: "Mona", team: "Design", employeeId: "E2013", status: "Forwarded", designation: "Senior Developer", remarks: "14", action: "" },
    { slNo: 15, year: 2014, employeeName: "Nina", team: "Frontend", employeeId: "E2014", status: "Approved", designation: "Project Manager", remarks: "15", action: "" },
    { slNo: 16, year: 2015, employeeName: "Oscar", team: "Backend", employeeId: "E2015", status: "Submitted", designation: "QA Engineer", remarks: "16", action: "" },
    { slNo: 17, year: 2016, employeeName: "Paul", team: "QA", employeeId: "E2016", status: "Reverted", designation: "UI/UX Designer", remarks: "17", action: "" },
    { slNo: 18, year: 2017, employeeName: "Quinn", team: "Design", employeeId: "E2017", status: "Forwarded", designation: "DevOps Engineer", remarks: "18", action: "" },
    { slNo: 19, year: 2018, employeeName: "Rita", team: "Frontend", employeeId: "E2018", status: "Approved", designation: "Software Engineer", remarks: "19", action: "" },
    { slNo: 20, year: 2019, employeeName: "Steve", team: "Backend", employeeId: "E2019", status: "Submitted", designation: "Senior Developer", remarks: "20", action: "" }
  ];


  getStatusClass(status: string): string {
    if (!status) return '';

    switch (status.toLowerCase()) {
      case 'reverted':
        return 'status-reverted';
      case 'forwarded':
        return 'status-forwarded';
      case 'approved':
        return 'status-approved';
      case 'submitted':
        return 'status-submitted';
      default:
        return '';
    }
  }

}
