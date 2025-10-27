import { Component } from '@angular/core';

@Component({
  selector: 'app-all-employee-kpi',
  templateUrl: './all-employee-kpi.component.html',
  styleUrls: ['./all-employee-kpi.component.css']
})
export class AllEmployeeKPIComponent {


  label="All Employee KPI";


  userList = [
    { slNo: 1, year: 2000, employeeName: "Revert", team: "Frontend", employeeId: "E2000", status: "Active", designation: "Software Engineer", SBU: "Datasoft", action: "" },
    { slNo: 2, year: 2001, employeeName: "Alice", team: "Backend", employeeId: "E2001", status: "Inactive", designation: "Senior Developer", SBU: "Datasoft", action: "" },
    { slNo: 3, year: 2002, employeeName: "Bob", team: "Frontend", employeeId: "E2002", status: "Active", designation: "Project Manager", SBU: "Datasoft", action: "" },
    { slNo: 4, year: 2003, employeeName: "Charlie", team: "QA", employeeId: "E2003", status: "Active", designation: "QA Engineer", SBU: "Datasoft", action: "" },
    { slNo: 5, year: 2004, employeeName: "David", team: "Design", employeeId: "E2004", status: "Inactive", designation: "UI/UX Designer", SBU: "Datasoft", action: "" },
    { slNo: 6, year: 2005, employeeName: "Eva", team: "Infrastructure", employeeId: "E2005", status: "Active", designation: "DevOps Engineer", SBU: "Datasoft", action: "" },
    { slNo: 7, year: 2006, employeeName: "Frank", team: "Backend", employeeId: "E2006", status: "Active", designation: "Software Engineer", SBU: "Datasoft", action: "" },
    { slNo: 8, year: 2007, employeeName: "Grace", team: "Frontend", employeeId: "E2007", status: "Inactive", designation: "Senior Developer", SBU: "Datasoft", action: "" },
    { slNo: 9, year: 2008, employeeName: "Hannah", team: "QA", employeeId: "E2008", status: "Active", designation: "Project Manager", SBU: "Datasoft", action: "" },
    { slNo: 10, year: 2009, employeeName: "Ian", team: "Design", employeeId: "E2009", status: "Active", designation: "QA Engineer", SBU: "Datasoft", action: "" },
    { slNo: 11, year: 2010, employeeName: "Jack", team: "Frontend", employeeId: "E2010", status: "Inactive", designation: "UI/UX Designer", SBU: "Datasoft", action: "" },
    { slNo: 12, year: 2011, employeeName: "Kathy", team: "Backend", employeeId: "E2011", status: "Active", designation: "DevOps Engineer", SBU: "Datasoft", action: "" },
    { slNo: 13, year: 2012, employeeName: "Leo", team: "QA", employeeId: "E2012", status: "Active", designation: "Software Engineer", SBU: "Datasoft", action: "" },
    { slNo: 14, year: 2013, employeeName: "Mona", team: "Design", employeeId: "E2013", status: "Inactive", designation: "Senior Developer", SBU: "Datasoft", action: "" },
    { slNo: 15, year: 2014, employeeName: "Nina", team: "Frontend", employeeId: "E2014", status: "Active", designation: "Project Manager", SBU: "Datasoft", action: "" },
    { slNo: 16, year: 2015, employeeName: "Oscar", team: "Backend", employeeId: "E2015", status: "Active", designation: "QA Engineer", SBU: "Datasoft", action: "" },
    { slNo: 17, year: 2016, employeeName: "Paul", team: "QA", employeeId: "E2016", status: "Inactive", designation: "UI/UX Designer", SBU: "Datasoft", action: "" },
    { slNo: 18, year: 2017, employeeName: "Quinn", team: "Design", employeeId: "E2017", status: "Active", designation: "DevOps Engineer", SBU: "Datasoft", action: "" },
    { slNo: 19, year: 2018, employeeName: "Rita", team: "Frontend", employeeId: "E2018", status: "Active", designation: "Software Engineer", SBU: "Datasoft", action: "" },
    { slNo: 20, year: 2019, employeeName: "Steve", team: "Backend", employeeId: "E2019", status: "Inactive", designation: "Senior Developer", SBU: "Datasoft", action: "" }
  ];

}
