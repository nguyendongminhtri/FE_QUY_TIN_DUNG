import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {CreditContract} from "../model/CreditContract";
import {FileMetadataEntity} from "../model/FileMetadataEntity";
import {Introduce} from "../model/Introduce";
import {CreditContractListItem, PageResponse} from "../model/CreditContractListItem";

@Injectable({
  providedIn: 'root'
})
export class CreditContractService {
  private API_CREDIT_CONTRACT = environment.API + 'credit-contract'
  constructor(private http: HttpClient) { }
  // 👉 Gửi payload và nhận về danh sách URL (string[])
  previewContract(contract: CreditContract): Observable<string[]> {
    return this.http.post<string[]>(this.API_CREDIT_CONTRACT, contract);
  }
  exportContract(request: CreditContract): Observable<Blob> {
    return this.http.post(`${this.API_CREDIT_CONTRACT}/export`, request, { responseType: 'blob' });
  }

  // Export hợp đồng đã có (update + lưu DB)
  exportContractUpdate(id: number, request: any): Observable<Blob> {
    return this.http.post(`${this.API_CREDIT_CONTRACT}/export/${id}`, request, { responseType: 'blob' });
  }
  getListCreditContract(): Observable<any> {
    return this.http.get<CreditContract>(this.API_CREDIT_CONTRACT);
  }
  getContractById(id: number): Observable<CreditContract> {
    return this.http.get<CreditContract>(`${this.API_CREDIT_CONTRACT}/${id}`);
  }
  deleteCreditContract(id: number): Observable<any> {
    console.log('API XOA --> ',this.API_CREDIT_CONTRACT + '/' + id)
    return this.http.delete(this.API_CREDIT_CONTRACT + '/' + id);
  }
  searchCreditContracts(keyword: string, page: number, size: number): Observable<PageResponse<CreditContractListItem>> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page)
      .set('size', size);
    // Dùng đúng biến base URL mà các hàm khác trong service này đang dùng
    return this.http.get<PageResponse<CreditContractListItem>>(`${this.API_CREDIT_CONTRACT}/search`, {params});
  }
}
