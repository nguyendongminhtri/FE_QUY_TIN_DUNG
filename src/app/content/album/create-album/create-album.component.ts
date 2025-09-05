import { Component } from '@angular/core';
import {Song} from "../../../model/Song";
import {Playlist} from "../../../model/Playlist";
import {PlaylistService} from "../../../service/playlist.service";
import {SongService} from "../../../service/song.service";
import {AlbumService} from "../../../service/album.service";
import {Album} from "../../../model/Album";
import {Category} from "../../../model/Category";
import {CategoryService} from "../../../service/category.service";

@Component({
  selector: 'app-create-album',
  templateUrl: './create-album.component.html',
  styleUrls: ['./create-album.component.css']
})
export class CreateAlbumComponent {
  status = "";
  form: any = {};
  album? : Album;

  constructor(private albumService : AlbumService) {
  }

  protected readonly = onunload;
  onUpload($event: string) {
    this.form.avatar = $event;
  }

  createAlbum() {
    this.album = new  Album(
      this.form.name,
      this.form.avatar
    )
    if (this.form.avatar == undefined){
      this.status = "Avatar field cannot be empty!"
    }else {
      this.albumService.createAlbum(this.album).subscribe(data =>{
        if (data.message=='name_exist'){
          this.status = 'The name is exist'
        }else {
          this.status = 'Create success';
        }
      })
    }
  }
}
