import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {News} from "../model/News";
import {Observable} from "rxjs";
import {Introduce} from "../model/Introduce";

@Injectable({
  providedIn: 'root'
})
export class IntroduceService {

  private API_NEWS = environment.API + 'introduce'
  constructor(private http: HttpClient) { }
  createIntroduce(introduce: Introduce): Observable<any> {
    return this.http.post<Introduce>(this.API_NEWS, introduce);
  }
  getListIntroduce(): Observable<any> {
    return this.http.get<Introduce>(this.API_NEWS);
  }
  updateStatus(id: number, isShow: boolean): Observable<any> {
    return this.http.put(`${this.API_NEWS}/${id}/status`, { isShow });
  }
  deleteNews(id: number): Observable<any> {
    return this.http.delete(this.API_NEWS + '/' + id);
  }
  getIntroduceById(id: number): Observable<News> {
    return this.http.get<News>(`${this.API_NEWS}/${id}`);
  }
  updateIntroduce(id: number, data: any): Observable<any> {
    return this.http.put(`${this.API_NEWS}/${id}`, data);
  }
}
