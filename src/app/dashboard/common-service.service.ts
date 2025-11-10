import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {


  constructor(private http: HttpClient) { }

  ApiEndpoint = `${environment.baseUrl}/kpi`;

  saveKpi(obj:any){
    return this.http.post(`${this.ApiEndpoint}/kpi-form/save`, obj);
  }

  revertKpi(obj:any){
    return this.http.post(`${this.ApiEndpoint}/kpi-form/revert`, obj);
  }

  evaluationDataInsert(obj:any){
    return this.http.post(`${this.ApiEndpoint}/kpi-form/evaluation-insert`, obj);
  }

  getHierarchyList(obj:any): Observable<any> {
    return this.http.post(`${this.ApiEndpoint}/hierarchy/list`, obj);
  }

  getAttributeList(obj:any): Observable<any> {
    return this.http.post(`${this.ApiEndpoint}/attribute/list`, obj);
  }


  getKpiList(obj:any): Observable<any> {
    return this.http.post(`${this.ApiEndpoint}/list/myKpi`, obj);
  }

  getTeamKpiList(obj:any): Observable<any> {
    return this.http.post(`${this.ApiEndpoint}/list/teamKpi`, obj);
  }
  saveKpiHierarchy(obj:any){
    return this.http.post(`${this.ApiEndpoint}/hierarchy/save`, obj);
  }
  saveFinalHierarchy(obj: any) {
    return this.http.post(`${this.ApiEndpoint}/hierarchy/add/final_approver`, obj);
  }
  saveEndDate(obj: any) {
    return this.http.post(`${this.ApiEndpoint}/dashboard/save/endDate`, obj);
  }

  saveModifiedData(obj: any) {
    return this.http.post(`${this.ApiEndpoint}/dashboard/modified/info`, obj);
  }

  getLogData(obj:any): Observable<any>{
    return this.http.post(`${this.ApiEndpoint}/hierarchy/config/data`, obj);
  }
  saveKPIAttribute(obj: any) {
    return this.http.post(`${this.ApiEndpoint}/attribute/save`, obj);
  }
  getAllEmpKpiList(obj:any): Observable<any> {
    return this.http.post(`${this.ApiEndpoint}/list/allEmp`, obj);
  }
}
