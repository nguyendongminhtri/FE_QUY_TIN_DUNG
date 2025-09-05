import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {SongService} from "../../../service/song.service";
import {Song} from "../../../model/Song";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-top-trending',
  templateUrl: './top-trending.component.html',
  styleUrls: ['./top-trending.component.css']
})
export class TopTrendingComponent implements OnInit{
  listSong: Song[] = [];
  constructor(private songService : SongService) {
  }

  displayedColumns: string[] = ['id', 'avatar', 'name','view'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  ngOnInit(): void {
    this.songService.getTopTrendingSong().subscribe(data =>{
      // @ts-ignore
      this.listSong = data;
      this.dataSource = new MatTableDataSource<Song>(this.listSong);
      this.dataSource.paginator = this.paginator;
    })
  }

}
