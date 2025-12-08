import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {News} from "../model/News";
import {Observable} from "rxjs";
import {CreditContract} from "../model/CreditContract";

@Injectable({
  providedIn: 'root'
})
export class CreditContractService {
  private API_CREDIT_CONTRACT = environment.API + 'credit-contract'
  constructor(private http: HttpClient) { }
  createCreditContract(contract: CreditContract): Observable<any> {
    return this.http.post<CreditContract>(this.API_CREDIT_CONTRACT, contract);
  }
}
