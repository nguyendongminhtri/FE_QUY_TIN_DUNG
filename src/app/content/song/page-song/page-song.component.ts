import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {SongService} from "../../../service/song.service";
import {Song} from "../../../model/Song";
import {CreateSongComponent} from "../create-song/create-song.component";
import {TokenService} from "../../../service/token.service";
import {DeleteSongComponent} from "../delete-song/delete-song.component";
import {UpdateSongComponent} from "../update-song/update-song.component";


@Component({
  selector: 'app-page-song',
  templateUrl: './page-song.component.html',
  styleUrls: ['./page-song.component.css']
})
export class PageSongComponent implements OnInit{
  listSong?: Song[];
  totalElements: number=0;

  constructor(private songService: SongService,
              public dialog:MatDialog,
              private tokenService: TokenService) {
  }

  getPageRequest(request:any){
    this.songService.getPageSong(request).subscribe(data =>{
      // console.log("song---->",data)
      this.listSong = data['content'];
      // console.log("song list",this.listSong)
      this.totalElements = data['totalElements']
    })
  }

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  checkUserAdmin= false;

  openDialogCreate() {
    const dialogRef = this.dialog.open(CreateSongComponent);
    dialogRef.afterClosed().subscribe(result => {

      if (result||result == undefined){
        this.getPageRequest({page:0,size:6})
      }
    });
  }


  nextPage($event: PageEvent) {
    const request={};
    // @ts-ignore
    request['page'] = $event.pageIndex.toString();
    // @ts-ignore
    request['size'] = $event.pageSize.toString();
    this.getPageRequest(request);
  }

  ngOnInit(): void {
    const request = {page:0,size:6}
    this.getPageRequest(request);

    if (this.tokenService.getToken()) {
      console.log('role ---->', this.tokenService.getRole())
      if (JSON.stringify(this.tokenService.getRole()) == JSON.stringify(['ADMIN'])) {
        this.checkUserAdmin = true;
      }
    }
    this.songService.getPageSong(request).subscribe(data =>{
      this.getPageRequest({page: 0, size: 6})
    })
  }

  openDialogDelete(id:any) {
    const dialogRef= this.dialog.open(DeleteSongComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.songService.deleteSong(id).subscribe(data =>{
          this.getPageRequest({page:0,size:6});
        })
      }
    })
  }

  openDialogUpdate(id:any) {
    const dialogRef = this.dialog.open(UpdateSongComponent, {
      data:{
        dataKey:id
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result || result == undefined){
        this.getPageRequest({page:0,size:6})
      }
    })
  }
}
