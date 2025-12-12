import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CreditContract} from "../model/CreditContract";
import {FileMetadataEntity} from "../model/FileMetadataEntity";
import {Introduce} from "../model/Introduce";

@Injectable({
  providedIn: 'root'
})
export class CreditContractService {
  private API_CREDIT_CONTRACT = environment.API + 'credit-contract'
  constructor(private http: HttpClient) { }
  // 👉 Gửi payload và nhận về danh sách URL (string[])
  createCreditContract(contract: CreditContract): Observable<string[]> {
    return this.http.post<string[]>(this.API_CREDIT_CONTRACT, contract);
  }
  exportContract(request: CreditContract, avatarUrls: FileMetadataEntity[]): Observable<Blob> {
    const payload = {
      ...request,
      fileAvatarUrls: avatarUrls.map(a => a.fileName)
    };
    return this.http.post(`${this.API_CREDIT_CONTRACT}/export`, payload, { responseType: 'blob' });
  }
  // Export hợp đồng đã có (update + lưu DB)
  exportContractUpdate(id: number, request: any): Observable<Blob> {
    return this.http.post(`${this.API_CREDIT_CONTRACT}/export/${id}`, request, { responseType: 'blob' });
  }
  getListCreditContract(): Observable<any> {
    return this.http.get<CreditContract>(this.API_CREDIT_CONTRACT);
  }

}
