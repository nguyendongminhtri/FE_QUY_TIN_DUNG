import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {TokenService} from "../../../service/token.service";
import {PlaylistService} from "../../../service/playlist.service";
import {Playlist} from "../../../model/Playlist";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {SongService} from "../../../service/song.service";
import {Song} from "../../../model/Song";
import {PlaylistDTO} from "../../../model/PlaylistDTO";
import {AlbumDTO} from "../../../model/AlbumDTO";
import {AlbumService} from "../../../service/album.service";
import {CreateSongComponent} from "../create-song/create-song.component";
import {DialogSuccessComponent} from "../../../dialog/dialog-success/dialog-success.component";

@Component({
  selector: 'app-list-song',
  templateUrl: './list-song.component.html',
  styleUrls: ['./list-song.component.css']
})
export class ListSongComponent {
   checkUserAdmin = false;
   playlistDTO ?: PlaylistDTO;
   albumDTO?: AlbumDTO;

  constructor(private dialog: MatDialog,
              private tokenService: TokenService,
              private songService: SongService,
              @Inject(MAT_DIALOG_DATA)
              public data:any,
              private playService: PlaylistService,
              private albumService: AlbumService){}


  listSong: Song[] = [];
  displayedColumns: string[] = ['id', 'name', 'avatar','add'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      console.log('role ---->', this.tokenService.getRole())
      if(JSON.stringify(this.tokenService.getRole())== JSON.stringify(['ADMIN'])){
        this.checkUserAdmin = true;
      }

    }
    this.songService.getListSongService().subscribe(data =>{
      this.listSong = data;
      this.dataSource = new MatTableDataSource<Song>(this.listSong);
      this.dataSource.paginator = this.paginator;
    })
  }
openDialogSuccess(){
  const dialogRef = this.dialog.open(DialogSuccessComponent);
}
  addSong(id : any) {
    console.log(id , "id song");
    console.log('dataKey --->', this.data.dataKey)
    if(this.data.dataKey.type=='pll'){
      this.playlistDTO = new PlaylistDTO(
        this.data.dataKey.id,
        id
      )
      console.log(this.playlistDTO , "playlistDTO")
      this.playService.addSong(this.playlistDTO).subscribe(data=>{
        if (data.message == "create_success"){
          console.log("create PLL thanh cong")
          this.openDialogSuccess();
        }
      })
    } else if(this.data.dataKey.type=='alb'){
      this.albumDTO = new AlbumDTO(
        this.data.dataKey.id,
        id
      )
      console.log(this.playlistDTO , "playlistDTO")
      this.albumService.addSong(this.albumDTO).subscribe(data=>{
        if (data.message == "create_success"){
          console.log("create ALB thanh cong")
          this.openDialogSuccess();
        }
      })
    }


  }
}
