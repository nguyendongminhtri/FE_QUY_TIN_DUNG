import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SongService} from "../../../service/song.service";
import {Song} from "../../../model/Song";

@Component({
  selector: 'app-detail-song',
  templateUrl: './detail-song.component.html',
  styleUrls: ['./detail-song.component.css']
})
export class DetailSongComponent implements OnInit {
  song?: Song;
  id= 0;

  constructor(private act: ActivatedRoute,
              private songService: SongService) {
  }

  ngOnInit(): void {
    this.act.paramMap.subscribe(songId => {
      // @ts-ignore
      this.id = +songId.get('id');

      this.songService.findSongById(this.id).subscribe(data => {
        this.song = data;
        console.log(data)
        console.log("this.song    ---->",this.song);
      })
    })

  }
  count = 0;
  public onTimeUpdate(value:any){
    if (value.target.currentTime > 10){
      if (this.count == 0){
        this.songService.viewSong(this.id).subscribe(data =>{
          console.log("dataaaaaaaaaaa",data)
          return;
        })
      }

      this.count++;
    }
    console.log("current time",value.target.currentTime);
  }
}
