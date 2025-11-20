import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {News} from "../model/News";
import {Observable} from "rxjs";
import {CarouselItem} from "../model/CarouselItem";

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private API_NEWS = environment.API + 'news'
  constructor(private http: HttpClient) { }
  createNews(news: News): Observable<any> {
    return this.http.post<News>(this.API_NEWS, news);
  }
  getListNews(): Observable<any> {
    return this.http.get<News>(this.API_NEWS);
  }
  updateStatus(id: number, isShow: boolean): Observable<any> {
    return this.http.put(`${this.API_NEWS}/${id}/status`, { isShow });
  }
  deleteNews(id: number): Observable<any> {
    return this.http.delete(this.API_NEWS + '/' + id);
  }
  getNewsById(id: number): Observable<News> {
    return this.http.get<News>(`${this.API_NEWS}/${id}`);
  }
  updateNews(id: number, data: any): Observable<any> {
    return this.http.put(`${this.API_NEWS}/${id}`, data);
  }
  getPageNewsByCategoryId(categoryId: number, request: any): Observable<any> {
    return this.http.get(
      `${this.API_NEWS}/by-category/${categoryId}`,
      { params: request }
    );
  }
}
