import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {News} from "../model/News";
import {Observable} from "rxjs";
import {StorySuccess} from "../model/StorySuccess";

@Injectable({
  providedIn: 'root'
})
export class StorySuccessService {

  private API_STORY_SUCCESS = environment.API + 'story-success'
  constructor(private http: HttpClient) { }
  createStorySuccess(storySuccess: StorySuccess): Observable<any> {
    return this.http.post<News>(this.API_STORY_SUCCESS, storySuccess);
  }
  getListStorySuccess(): Observable<any> {
    return this.http.get<News>(this.API_STORY_SUCCESS);
  }
  updateStatus(id: number, isShow: boolean): Observable<any> {
    return this.http.put(`${this.API_STORY_SUCCESS}/${id}/status`, { isShow });
  }
  deleteStorySuccess(id: number): Observable<any> {
    return this.http.delete(this.API_STORY_SUCCESS + '/' + id);
  }
  getStorySuccessById(id: number): Observable<News> {
    return this.http.get<News>(`${this.API_STORY_SUCCESS}/${id}`);
  }
  updateStorySuccess(id: number, data: any): Observable<any> {
    return this.http.put(`${this.API_STORY_SUCCESS}/${id}`, data);
  }
  getPageStorySuccessByCategoryId(categoryId: number, request: any): Observable<any> {
    return this.http.get(
      `${this.API_STORY_SUCCESS}/by-category/${categoryId}`,
      { params: request }
    );
  }
  searchStorySuccessByCategory(categoryId: number, request: any): Observable<any> {
    return this.http.get(
      `${this.API_STORY_SUCCESS}/by-category/${categoryId}/search`,
      { params: request }
    );
  }
}
