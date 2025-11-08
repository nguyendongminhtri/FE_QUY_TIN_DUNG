import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Playlist} from "../model/Playlist";
import {Observable} from "rxjs";
import {AlbumDTO} from "../model/AlbumDTO";
import {Album} from "../model/Album";
import {Category} from "../model/Category";

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private API_ALBUM = environment.API + 'album';
  constructor(private httpClient: HttpClient) { }
  createAlbum(album: Album): Observable<any> {
    return this.httpClient.post(this.API_ALBUM, album);
  }
  getPageAlbum(request: any): Observable<any> {
    const params = request;
    return this.httpClient.get(this.API_ALBUM + '/page', {params})
  }
  getAlbumByUserId():Observable<any>{
    return this.httpClient.get(this.API_ALBUM+'/album_user')
  }
  findAlbumById(id: number): Observable<any> {
    return this.httpClient.get(this.API_ALBUM + '/' + id);
  }
  addSong(albumDTO: AlbumDTO):Observable<any>{
    return this.httpClient.post(this.API_ALBUM +'/add-song',albumDTO);
  }
  getListSongFromAlbum(id:number):Observable<any>{
    return this.httpClient.get(this.API_ALBUM+ '/get-songList/' + id);
  }

  deleteSongInAlbum(albumDTO: AlbumDTO):Observable<any>{
    console.log(albumDTO, " albumDTO")
    return this.httpClient.put(this.API_ALBUM+'/delete-song', albumDTO);
  }
  deleteAlbum(id: number): Observable<any> {
    return this.httpClient.delete(this.API_ALBUM + '/' + id);
  }
  updateAlbum(id: number, album: Album): Observable<any> {
    return this.httpClient.put(this.API_ALBUM + '/' + id, album);
  }
  getAlbumById(id: number): Observable<any> {
    return this.httpClient.get(this.API_ALBUM + '/' + id);
    // return this.httpClient.get(`${this.API_CATEGORY}/${id}`)
  }
}
