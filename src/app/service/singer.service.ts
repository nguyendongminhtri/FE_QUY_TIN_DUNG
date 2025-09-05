import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Singer} from "../model/Singer";

@Injectable({
  providedIn: 'root'
})
export class SingerService {
  // private API_SINGER = environment.API_LOCAL + 'singer';
  private API_SINGER = environment.API_SERVER+'singer';


  constructor(private httpClient: HttpClient) {
  }

  getListSingerService(): Observable<any> {
    return this.httpClient.get(this.API_SINGER);
  }

  createSingerService(singer: Singer): Observable<any> {
    console.log("singer service", singer)
    return this.httpClient.post(this.API_SINGER, singer);
  }

  getPageSinger(request: any): Observable<any> {
    const params = request;
    return this.httpClient.get(this.API_SINGER + '/page', {params})
  }

  findSingerById(id: number): Observable<any> {
    console.log(id)
    return this.httpClient.get(this.API_SINGER + '/' + id);
  }

  updateSinger(id: number, singer: Singer): Observable<any> {
    console.log("api sev"    , singer)
    return this.httpClient.put(this.API_SINGER + '/' + id, singer);
  }

  deleteSinger(id: number): Observable<any> {
    return this.httpClient.delete(this.API_SINGER + '/' + id);
  }

}

