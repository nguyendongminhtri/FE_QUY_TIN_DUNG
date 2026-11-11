import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserStat} from "../model/UserStat";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class ContractStatsService {
  private API_CREDIT_STATS = environment.API + 'admin/contract-stats'
  constructor(private http: HttpClient) {}

  getStats(year: number, month?: number): Observable<UserStat[]> {
    let params = new HttpParams().set('year', year);
    if (month != null) {
      params = params.set('month', month);
    }
    return this.http.get<UserStat[]>(this.API_CREDIT_STATS, { params });
  }
}
