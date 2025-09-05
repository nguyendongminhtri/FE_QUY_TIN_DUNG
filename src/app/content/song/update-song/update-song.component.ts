import {Component, Inject, OnInit} from '@angular/core';
import {Song} from "../../../model/Song";
import {SongService} from "../../../service/song.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Category} from "../../../model/Category";
import {Singer} from "../../../model/Singer";
import {CategoryService} from "../../../service/category.service";
import {SingerService} from "../../../service/singer.service";

@Component({
  selector: 'app-update-song',
  templateUrl: './update-song.component.html',
  styleUrls: ['./update-song.component.css']
})
export class UpdateSongComponent implements OnInit{
  status = 'Fill in the form to update';
  // @ts-ignore
  song = new Song();
  listCategory : Category[] = [];
  singerList : Singer[] =[];
  constructor(private songService: SongService,
              @Inject(MAT_DIALOG_DATA)
              public data: any,
              private categoryService: CategoryService,
              private singerService : SingerService) {
  }
  updateSong() {
    // @ts-ignore
    this.songService.updateSong(this.song?.id,this.song).subscribe(data=>{
      if (data.message == 'no_change'){
        this.status = 'No change';
      }else if (data.message == 'update_success'){
        this.status = 'Update success!'
      }
    })
  }

  onUpload($event: string) {
    this.song.avatar = $event
  }

  onUploadFile($event: string) {
    this.song.url = $event
  }

  ngOnInit(): void {
    this.categoryService.getListCategoryService().subscribe(data => {
      this.listCategory = data;
      console.log("listCategory", this.listCategory);
    })
    this.singerService.getListSingerService().subscribe(data => {
      this.singerList = data;
    })
    console.log('data tu inject --->', this.data.dataKey)

    this.songService.findSongById(this.data.dataKey).subscribe(data =>{
      this.song = data;
      console.log('category OLD ------------------>', this.song)
    })
  }
}
