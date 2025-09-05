import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Song} from "../model/Song";

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private API_SONG = environment.API_SERVER + 'song';
  // private API_SONG = environment.API_LOCAL + 'song';

  constructor(private httpClient: HttpClient) {
  }

  getListSongService(): Observable<any> {
    return this.httpClient.get(this.API_SONG);
  }

  getPageSong(request: any): Observable<any> {
    const params = request;
    return this.httpClient.get(this.API_SONG + '/page', {params})
  }

  getPageSearchSong(request: any, search: string): Observable<any> {
    ///search tham so de search
    const params = request;
    return this.httpClient.get(this.API_SONG + '/search/' + search, {params})
  }

  createSongService(song: Song): Observable<any> {
    return this.httpClient.post(this.API_SONG, song);
  }

  findSongById(id: number): Observable<any> {
    console.log(id)
    return this.httpClient.get(this.API_SONG + '/' + id);
  }

  private myBehaviorSubject = new BehaviorSubject<string>('');

  setValue(value: string) {
    this.myBehaviorSubject.next(value);
  }

  getValue() {
    return this.myBehaviorSubject.asObservable();
  }

  get3SongRandom(): Observable<any> {
    return this.httpClient.get(this.API_SONG + '/randomSong')
  }

  viewSong(id: number): Observable<any> {
    return this.httpClient.get(this.API_SONG + "/view/" + id);
  }

  getTopTrendingSong() {
    return this.httpClient.get(this.API_SONG + '/trending')
  }

  deleteSong(id: number): Observable<any> {
    return this.httpClient.delete(this.API_SONG + '/' + id);
  }

  updateSong(id: number, song: Song): Observable<any> {
    return this.httpClient.put(this.API_SONG + '/' + id, song);
  }

}
