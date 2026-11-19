import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {KpiManagement} from "../model/KpiManagement";

@Injectable({
  providedIn: 'root'
})
export class KpiManagementService {

  constructor(private http: HttpClient) {}

  getTongHop(ky: string, boPhan?: string) {
    let params = new HttpParams().set('ky', ky);
    if (boPhan) params = params.set('boPhan', boPhan);
    return this.http.get<KpiManagement[]>('/api/kpi/tong-hop', { params });
  }
}
