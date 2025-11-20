import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CarouselItem} from "../model/CarouselItem";

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  private API_CAROUSEL = environment.API + 'carousel';
  constructor(private httpClient: HttpClient) { }
  createCarousel(carouselItem: CarouselItem): Observable<any> {
    return this.httpClient.post(this.API_CAROUSEL + '/create', carouselItem);
  }
  getListCarousel(): Observable<any> {
    return this.httpClient.get(this.API_CAROUSEL);
  }
  updateStatus(id: number, isShow: boolean): Observable<any> {
    return this.httpClient.put(`${this.API_CAROUSEL}/${id}/status`, { isShow });
  }
  deleteCarousel(id: number): Observable<any> {
    return this.httpClient.delete(this.API_CAROUSEL + '/' + id);
  }
  getCarouselById(id: number): Observable<CarouselItem> {
    return this.httpClient.get<CarouselItem>(`${this.API_CAROUSEL}/${id}`);
  }
  updateCarousel(id: number, data: any): Observable<any> {
    return this.httpClient.put(`${this.API_CAROUSEL}/${id}`, data);
  }
}
