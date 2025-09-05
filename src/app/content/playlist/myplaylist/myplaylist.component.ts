import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CreateCategoryComponent} from "../../category/create-category/create-category.component";
import {MatTableDataSource} from "@angular/material/table";
import {Category} from "../../../model/Category";
import {CreatePlaylistComponent} from "../create-playlist/create-playlist.component";
import {PlaylistService} from "../../../service/playlist.service";
import {Playlist} from "../../../model/Playlist";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-myplaylist',
  templateUrl: './myplaylist.component.html',
  styleUrls: ['./myplaylist.component.css']
})
export class MyplaylistComponent implements OnInit{
  playlist?:Playlist[];
  dataSource: any;

constructor(private dialog:MatDialog,
            private playlistService:PlaylistService) {
}

  ngOnInit(): void {
    this.playlistService.getPlayListByUserId().subscribe(data =>{
      console.log("datapll" , data);
      this.playlist = data;
      this.dataSource = new MatTableDataSource<Playlist>(this.playlist);
      this.dataSource.paginator = this.paginator;
    })
  }

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  openDialogCreate() {
    const dialogRef=this.dialog.open(CreatePlaylistComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result,"result")
      if (result||result==undefined){
        this.playlistService.getPlayListByUserId().subscribe(data =>{
          console.log("data pll" , data);
          this.playlist = data;
          this.dataSource = new MatTableDataSource<Playlist>(this.playlist);
          this.dataSource.paginator = this.paginator;
        })
      }
    })
  }
}
