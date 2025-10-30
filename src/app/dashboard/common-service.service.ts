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
  getHierarchyList(obj:any): Observable<any> {
    return this.http.post(`${this.ApiEndpoint}/hierarchy/list`, obj);
  }
  saveKpiHierarchy(obj:any){
    return this.http.post(`${this.ApiEndpoint}/hierarchy/save`, obj);
  }


}
