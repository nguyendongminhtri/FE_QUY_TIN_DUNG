import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Playlist} from "../model/Playlist";
import {Observable} from "rxjs";
import {PlaylistDTO} from "../model/PlaylistDTO";

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  // private API_PLAYLIST = environment.API_LOCAL + 'playlist';
private API_PLAYLIST = environment.API_SERVER+'playlist';
  constructor(private httpClient: HttpClient) {
  }

  createPlaylist(playlist: Playlist): Observable<any> {
    return this.httpClient.post(this.API_PLAYLIST, playlist);
  }

  getPlayListByUserId():Observable<any>{

    return this.httpClient.get(this.API_PLAYLIST+'/playlist_user')
  }
  findPlaylistById(id: number): Observable<any> {
    return this.httpClient.get(this.API_PLAYLIST + '/' + id);
  }
  addSong(playlistDTO: PlaylistDTO):Observable<any>{
    return this.httpClient.post(this.API_PLAYLIST +'/add-song',playlistDTO);
  }
  getListSongFromPlaylist(id:number):Observable<any>{
    return this.httpClient.get(this.API_PLAYLIST+ '/get-songList/' + id);
  }

  deleteSongInPlaylist(playlistDTO: PlaylistDTO):Observable<any>{
    console.log(playlistDTO, " playlistDTO")
    return this.httpClient.put(this.API_PLAYLIST+'/delete-song', playlistDTO);
  }
}
