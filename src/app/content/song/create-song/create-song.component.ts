import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {Category} from "../../../model/Category";
import {Singer} from "../../../model/Singer";
import {CategoryService} from "../../../service/category.service";
import {SongService} from "../../../service/song.service";
import {SingerService} from "../../../service/singer.service";
import {Song} from "../../../model/Song";

@Component({
  selector: 'app-create-song',
  templateUrl: './create-song.component.html',
  styleUrls: ['./create-song.component.css']
})
export class CreateSongComponent implements OnInit {
  form: any = {};
  validateCategory = new FormControl('', [
    Validators.required
  ]);
  listCategory: Category[] = [];
  singerList: Singer[] = [];
  status = '';
  song?: Song;

  constructor(private categoryService: CategoryService,
              private songService: SongService,
              private singerService: SingerService) {
  }

  protected readonly onunload = onunload;

  // singer: any;

  ngOnInit(): void {
    this.categoryService.getListCategoryService().subscribe(data => {
      this.listCategory = data;
      console.log("listCategory", this.listCategory);
    })
    this.singerService.getListSingerService().subscribe(data => {
      this.singerList = data;
    })
  }

  onUploadFile($event: string) {
    this.form.url = $event;
  }

  onUpload($event: string) {
    this.form.avatar = $event;
  }

  createSong() {
    if (this.form.category == undefined) {
      this.status = "Choose a category";
      return;
    }
    if (this.form.avatar == undefined) {
      this.status = "Choose avatar";
      return;
    }
    if (this.form.url == undefined) {
      this.status = "Choose URL";
      return;

    }
    console.log("singerList", this.form.singerList);

    this.song = new Song(
      this.form.name,
      this.form.avatar,
      this.form.lyrics,
      this.form.url,
      this.form.category,
      this.form.singerList
    )
    console.log("song", this.song);

    this.songService.createSongService(this.song).subscribe(data => {
      console.log("data song : ", data)

      if (data.message == 'create_success') {
        this.status = 'Create Song Success';
      }
    })
  }
}
