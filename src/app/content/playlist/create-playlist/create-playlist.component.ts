import {Component, OnInit} from '@angular/core';
import {Song} from "../../../model/Song";
import {PlaylistService} from "../../../service/playlist.service";
import {SongService} from "../../../service/song.service";
import {Playlist} from "../../../model/Playlist";

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.css']
})
export class CreatePlaylistComponent implements OnInit {
  status = '';
  form: any = {};
  songList?: Song[] = [];
  playlist?: Playlist;

  constructor(private playlistService: PlaylistService,
              private songService: SongService) {
  }

  createPlaylist() {
    if (this.form.avatar == undefined) {
      this.status = "Choose avatar";
      return;
    }
    if (this.form.songList == undefined) {
      this.status = "Choose song"
    }
    this.playlist = new Playlist(
      this.form.name,
      this.form.avatar,
      this.form.songList
    )
    console.log()
    this.playlistService.createPlaylist(this.playlist).subscribe(data => {
      console.log("data", data)
      if (data.message == "create_success") {
        this.status = 'create success'
      }
    })
  }

  onUpload($event: string) {
    this.form.avatar = $event;
  }

  ngOnInit(): void {
    // @ts-ignore
    this.songService.getListSongService().subscribe(data => {
      this.songList = data;
      console.log(this.songList)
    })
  }
}
